import * as vscode from 'vscode';
import { defaultSettings, Settings } from "../common/settings";

export class XamlFormattingOptions {
    public settings: Settings = defaultSettings;
    constructor() {
        this.loadSettings();
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