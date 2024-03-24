import * as vscode from 'vscode';
import { defaultSettings, Settings } from "../common/settings";

export class XamlFormatter {
    public settings: Settings = defaultSettings;
    constructor() {
        this.loadSettings();
    }

    public formatXaml(document: vscode.TextDocument): vscode.TextEdit[] {
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

        // Remove unused attributes
        docText = docText.replace(/(\s*xmlns:[^\s=]*="[^"]*"\s*)/g, '');

        return [vscode.TextEdit.replace(range, docText)];
    }

    public loadSettings() {
        let zoioDeLulaConfig = vscode.workspace.getConfiguration('zoiodelula.settings');

        let attributesInNewlineThreshold = zoioDeLulaConfig.get<number>("attributesInNewlineThreshold");
        let formatOnSave = zoioDeLulaConfig.get<boolean>('formatOnSave');
        let positionAllAttributesOnFirstLine = zoioDeLulaConfig.get<boolean>('positionAllAttributesOnFirstLine');
        let useSelfClosingTags = zoioDeLulaConfig.get<boolean>('useSelfClosingTag');

        this.settings = new Settings(attributesInNewlineThreshold,
            formatOnSave,
            positionAllAttributesOnFirstLine,
            useSelfClosingTags);
    }
}