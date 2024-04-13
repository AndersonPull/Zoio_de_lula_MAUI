import * as vscode from 'vscode';
import { defaultSettings, Settings } from "../common/settings";
import * as formattingConstants from '../common/formattingConstants';

export class XamlFormatter {
    public settings?: Settings = defaultSettings;

    public formatXaml(document: vscode.TextDocument, settings?: Settings): vscode.TextEdit[] {
        this.loadSettings(settings);

        let lastLine = document.lineAt(document.lineCount - 1);
        let range = new vscode.Range(document.positionAt(0), lastLine.range.end);
        let docText = document?.getText();

        if (!docText) {
            return [];
        }

        docText = this.removeWhitespace(docText);
        docText = this.removeUnusedAttributes(docText);
        docText = this.useSelfClosingTags(docText);
        docText = this.tagTreeConfiguration(docText);
        docText = this.configureAttributePosition(docText);

        return [vscode.TextEdit.replace(range, docText)];
    }

    private removeWhitespace(docText: string): string {
        docText = docText.replace(/>\s{0,}</g, (match: string) => {
            return match.replace(/[^\S\r\n]/g, formattingConstants.empty);
        });

        docText = docText.replace(/"\s+(?=[^\s]+=)/g, "\" ");
        docText = docText.replace(/"\s+(?=>)/g, "\"");
        docText = docText.replace(/"\s+(?=\/>)/g, "\"");
        docText = docText.replace(/(?!<!\[CDATA\[)[^ <>="]\s+[^ <>="]+=(?![^<]*?\]\]>)/g, (match: string) => {
            return match.replace(/\s+/g, formattingConstants.space);
        });

        return docText;
    }

    private useSelfClosingTags(docText: string): string {
        if (this.settings?.useSelfClosingTags) {
            docText = docText.replace(/<(\w+)([^>]*)>\s*<\/\1>/g, '<$1$2/>');
        }

        return docText;
    }

    private removeUnusedAttributes(docText: string): string {
        if (this.settings?.removeUnusedAttributes) {
            let elements = docText.match(/(\s*xmlns:[^\s=]*="[^"]*"\s*)/g);
            let counts: { [index: string]: number } = {};

            if (elements) {
                elements.forEach(function (x) {
                    counts[x] = (counts[x] || 0) + 1;
                });
            }

            for (const element in counts) {
                const attributeName = element.split('=')[0].trim();
                if (attributeName.startsWith('xmlns:') && !docText.includes(`<${attributeName.substr(6)}:`)) {
                    if (element.trim() !== 'xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"') {
                        docText = docText.replace(element, '');
                    }
                }
            }
        }

        return docText;
    }

    private configureAttributePosition(docText: string): string {
        if (this.settings?.positionAllAttributesOnFirstLine) {
            return docText;
        }

        let breakAfter = this.settings?.numberOfAttributesPerLine ?? 1;
        let elements = docText.match(/<[^>]+>/g);
        let spacesBetweenElements = docText.match(/>\s+</g) || [];
        let xmlDeclarationRegex: RegExp = /<\?xml\s+version\s*=\s*"1.0"\s+encoding\s*=\s*"utf-8"\?>/i;

        if (elements) {
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];

                let paramCount = 0;
                let totalParams = (element.match(/([^\s="]+)="([^"]*)"/g) || []).length;

                let formattedElement = element.replace(/([^\s="]+)="([^"]*)"/g, (match) => {
                    paramCount++;

                    if (element.trim().startsWith("<!--") && element.trim().endsWith("-->")) {
                        return match;
                    }

                    if (xmlDeclarationRegex.test(element)) {
                        return match;
                    }

                    if (this.settings?.putTheFirstAttributeOnTheFirstLine === false && paramCount === 1 && i > 0) {
                        let spaces = spacesBetweenElements[i - 1].length - 2; // Subtract 2 to disregard the characters '>' and '<'
                        match = formattingConstants.lineBreak + formattingConstants.space.repeat(spaces) + `${formattingConstants.shortTabSpace}` + match;
                    }

                    if (paramCount % breakAfter === 0 && paramCount !== totalParams && i > 0) {
                        let spaces = spacesBetweenElements[i - 1].length;
                        match += formattingConstants.lineBreak + formattingConstants.space.repeat(spaces);
                    }
                    return match;
                });

                docText = docText.replace(elements[i], formattedElement);
            }
        }

        return docText;
    }

    private tagTreeConfiguration(docText: string): string {
        let pad = 0;
        let formatted = formattingConstants.empty;

        docText.split(/>\s*</).forEach((node) => {
            if (node.match(/^\/\w/)) {
                pad--;
            }

            formatted += `${formattingConstants.tabSpace.repeat(pad)}<${node}>\n`;

            if (node.match(/^<?\w[^>]*[^\/]$/)) {
                pad++;
            }
        });

        return formatted.trim().replace('<<', '<').replace(/>{2,}/g, '>');
    }

    public loadSettings(settings?: Settings) {
        if (settings !== undefined) {
            this.settings = settings;
            return;
        }

        let zoioDeLulaConfig = vscode.workspace.getConfiguration('zoiodelula.settings');

        let numberOfAttributesPerLine = zoioDeLulaConfig.get<number>("numberOfAttributesPerLine");
        let putTheFirstAttributeOnTheFirstLine = zoioDeLulaConfig.get<boolean>('putTheFirstAttributeOnTheFirstLine');
        let positionAllAttributesOnFirstLine = zoioDeLulaConfig.get<boolean>('positionAllAttributesOnFirstLine');
        let removeUnusedAttributes = zoioDeLulaConfig.get<boolean>('removeUnusedAttributes');
        let useSelfClosingTags = zoioDeLulaConfig.get<boolean>('useSelfClosingTag');

        this.settings = new Settings(numberOfAttributesPerLine,
            positionAllAttributesOnFirstLine,
            putTheFirstAttributeOnTheFirstLine,
            removeUnusedAttributes,
            useSelfClosingTags);
    }
}