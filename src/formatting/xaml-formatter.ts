import * as vscode from 'vscode';
import { XamlFormattingOptions } from "./xaml-formatting-options";
import { defaultSettings, Settings } from "../common/settings";

export class XamlFormatter {
    public settings: Settings = defaultSettings;
    constructor() {
        this.loadSettings();
    }

    formatXaml(xaml: string, options: XamlFormattingOptions): string {
        return "return";
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