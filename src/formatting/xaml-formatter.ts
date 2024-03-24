import * as vscode from 'vscode';
import { defaultSettings, Settings } from "../common/settings";

export class XamlFormatter {
    public settings: Settings = defaultSettings;
    constructor() {
        this.loadSettings();
    }

    public formatXaml(document: vscode.TextDocument): vscode.TextEdit[] {
        this.loadSettings();//remove when adding commands

        let lastLine = document.lineAt(document.lineCount - 1);
        let range = new vscode.Range(document.positionAt(0), lastLine.range.end);
        let docText = document?.getText();

        if (!docText) {
            return [];
        }

        // remove whitespace from between tags, except for line breaks
        docText = docText.replace(/>\s{0,}</g, (match: string) => {
            return match.replace(/[^\S\r\n]/g, "");
        });

        // do some light minification to get rid of insignificant whitespace
        docText = docText.replace(/"\s+(?=[^\s]+=)/g, "\" "); // spaces between attributes
        docText = docText.replace(/"\s+(?=>)/g, "\""); // spaces between the last attribute and tag close (>)
        docText = docText.replace(/"\s+(?=\/>)/g, "\" "); // spaces between the last attribute and tag close (/>)
        docText = docText.replace(/(?!<!\[CDATA\[)[^ <>="]\s+[^ <>="]+=(?![^<]*?\]\]>)/g, (match: string) => { // spaces between the node name and the first attribute
            return match.replace(/\s+/g, " ");
        });

        docText = this.removeUnusedAttributes(docText);
        docText = this.positionAllAttributesOnFirstLine(docText);
        return [vscode.TextEdit.replace(range, docText)];
    }

    private removeUnusedAttributes(docText: string): string {
        if (this.settings.removeUnusedAttributes) {
            docText = docText.replace(/(\s*xmlns:[^\s=]*="[^"]*"\s*)/g, '');
        }

        return docText;
    }

    private positionAllAttributesOnFirstLine(docText: string): string {
        let breakAfter = this.settings.attributesInNewlineThreshold ?? 1;
        let elements = docText.match(/<[^>]+>/g);

        if (elements) {
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                let paramCount = 0;
                let totalParams = (element.match(/=/g) || []).length;
                let formattedElement = element.replace(/([^\s="]+)="([^"]*)"/g, (match) => {
                    paramCount++;

                    if (breakAfter === 0) {
                        match = '\n\t' + match;
                    }

                    if (paramCount % breakAfter === 0 && paramCount !== totalParams) {
                        match = match + '\n\t';
                    }

                    return match;
                });

                docText = docText.replace(elements[i], formattedElement);
            }
        }

        return docText;
    }

    public loadSettings() {
        let zoioDeLulaConfig = vscode.workspace.getConfiguration('zoiodelula.settings');

        let attributesInNewlineThreshold = zoioDeLulaConfig.get<number>("attributesInNewlineThreshold");
        let formatOnSave = zoioDeLulaConfig.get<boolean>('formatOnSave');
        let positionAllAttributesOnFirstLine = zoioDeLulaConfig.get<boolean>('positionAllAttributesOnFirstLine');
        let removeUnusedAttributes = zoioDeLulaConfig.get<boolean>('removeUnusedAttributes');
        let useSelfClosingTags = zoioDeLulaConfig.get<boolean>('useSelfClosingTag');

        this.settings = new Settings(attributesInNewlineThreshold,
            formatOnSave,
            positionAllAttributesOnFirstLine,
            removeUnusedAttributes,
            useSelfClosingTags);
    }
}