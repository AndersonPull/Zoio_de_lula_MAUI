import * as vscode from 'vscode';
import { defaultSettings, Settings } from "../common/settings";
import * as regex from '../common/regex';

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
        docText = docText.replace(/"\s+(?=\/>)/g, "\""); // spaces between the last attribute and tag close (/>)
        docText = docText.replace(/(?!<!\[CDATA\[)[^ <>="]\s+[^ <>="]+=(?![^<]*?\]\]>)/g, (match: string) => { // spaces between the node name and the first attribute
            return match.replace(/\s+/g, " ");
        });

        docText = this.removeUnusedAttributes(docText);
        docText = this.setUpTree(docText);
        docText = this.positionAllAttributesOnFirstLine(docText);
        docText = this.useSelfClosingTags(docText);

        return [vscode.TextEdit.replace(range, docText)];
    }

    private useSelfClosingTags(docText: string): string {
        if (this.settings.useSelfClosingTags) {
            docText = docText.replace(/<(\w+)([^>]*)>\s*<\/\1>/g, '<$1$2/>');
        }

        return docText;
    }

    private removeUnusedAttributes(docText: string): string {
        if (this.settings.removeUnusedAttributes) {
            //TODO Validar se o declaração esta sendo usada antes de remover
            //docText = docText.replace(/(\s*xmlns:[^\s=]*="[^"]*"\s*)/g, '');
        }

        return docText;
    }

    private positionAllAttributesOnFirstLine(docText: string): string {
        if (this.settings.positionAllAttributesOnFirstLine) {
            return docText;
        }

        let breakAfter = this.settings.attributesInNewlineThreshold ?? 1;
        let elements = docText.match(/<[^>]+>/g);
        let spacesBetweenElements = docText.match(/>\s+</g) || [];
        if (elements) {
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];

                let paramCount = 0;
                let totalParams = (element.match(/=/g) || []).length;

                let formattedElement = element.replace(/([^\s="]+)="([^"]*)"/g, (match) => {
                    paramCount++;
                    if (element !== '<?xml version="1.0" encoding="utf-8"?>') {
                        if (breakAfter === 0 && i > 0) {
                            let spaces = spacesBetweenElements[i - 1].length - 2; // Subtrai 2 para desconsiderar os caracteres '>' e '<'
                            match = '\n' + ' '.repeat(spaces) + `${regex.shortTabSpace}` + match;
                        }

                        if (paramCount % breakAfter === 0 && paramCount !== totalParams && i > 0) {
                            let spaces = spacesBetweenElements[i - 1].length;
                            match += `\n` + ' '.repeat(spaces);
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

            formatted += `${regex.tabSpace.repeat(pad)}<${node}>\n`;

            if (node.match(/^<?\w[^>]*[^\/]$/)) {
                pad++;
            }
        });

        return formatted.trim().replace('<<', '<').replace(/>{2,}/g, '>');
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