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
        docText = this.setUpTree(docText);
        docText = this.positionAllAttributesOnFirstLine(docText);
        docText = this.useSelfClosingTags(docText);

        return [vscode.TextEdit.replace(range, docText)];
    }

    private removeWhitespace(docText: string): string {
        // remove whitespace from between tags, except for line breaks
        docText = docText.replace(/>\s{0,}</g, (match: string) => {
            return match.replace(/[^\S\r\n]/g, "");
        });

        // do some light minification to get rid of insignificant whitespace
        docText = docText.replace(/"\s+(?=[^\s]+=)/g, "\" "); // spaces between attributes
        docText = docText.replace(/"\s+(?=>)/g, "\""); // spaces between the last attribute and tag close (>)
        docText = docText.replace(/"\s+(?=\/>)/g, "\""); // spaces between the last attribute and tag close (/>)
        docText = docText.replace(/(?!<!\[CDATA\[)[^ <>="]\s+[^ <>="]+=(?![^<]*?\]\]>)/g, (match: string) => { // spaces between the node name and the first attribute
            return match.replace(/\s+/g, " ");
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
            //TODO Validate that the claim is being used before removing
            //docText = docText.replace(/(\s*xmlns:[^\s=]*="[^"]*"\s*)/g, '');
        }

        return docText;
    }

    private positionAllAttributesOnFirstLine(docText: string): string {
        if (this.settings?.positionAllAttributesOnFirstLine) {
            return docText;
        }

        let breakAfter = this.settings?.attributesInNewlineThreshold ?? 1;
        let elements = docText.match(/<[^>]+>/g);
        let spacesBetweenElements = docText.match(/>\s+</g) || [];
        if (elements) {
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];

                let paramCount = 0;
                let totalParams = (element.match(/=/g) || []).length;

                let formattedElement = element.replace(/([^\s="]+)="([^"]*)"/g, (match) => {
                    paramCount++;
                    //TODO validar atraves de um regex e não por uma string 
                    if (element !== '<?xml version="1.0" encoding="utf-8"?>') {
                        if (this.settings?.putTheFirstAttributeOnTheFirstLine === false && paramCount === 1 && i > 0) {
                            let spaces = spacesBetweenElements[i - 1].length - 2; // Subtract 2 to disregard the characters '>' and '<'
                            match = formattingConstants.lineBreak + formattingConstants.space.repeat(spaces) + `${formattingConstants.shortTabSpace}` + match;
                        }

                        if (paramCount % breakAfter === 0 && paramCount !== totalParams && i > 0) {
                            let spaces = spacesBetweenElements[i - 1].length;
                            match += formattingConstants.lineBreak + formattingConstants.space.repeat(spaces);
                        }
                    }
                    return match;
                });

                docText = docText.replace(elements[i], formattedElement);
            }
        }

        return docText;
    }

    private setUpTree(docText: string): string {
        let pad = 0;
        let formatted = '';

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

        let attributesInNewlineThreshold = zoioDeLulaConfig.get<number>("attributesInNewlineThreshold");
        let putTheFirstAttributeOnTheFirstLine = zoioDeLulaConfig.get<boolean>('putTheFirstAttributeOnTheFirstLine');
        let positionAllAttributesOnFirstLine = zoioDeLulaConfig.get<boolean>('positionAllAttributesOnFirstLine');
        let removeUnusedAttributes = zoioDeLulaConfig.get<boolean>('removeUnusedAttributes');
        let useSelfClosingTags = zoioDeLulaConfig.get<boolean>('useSelfClosingTag');

        this.settings = new Settings(attributesInNewlineThreshold,
            positionAllAttributesOnFirstLine,
            putTheFirstAttributeOnTheFirstLine,
            removeUnusedAttributes,
            useSelfClosingTags);
    }
}