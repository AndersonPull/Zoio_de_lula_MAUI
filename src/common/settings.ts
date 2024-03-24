export interface ISettings {
    attributesInNewlineThreshold: number;
    formatOnSave: boolean;
    positionAllAttributesOnFirstLine: boolean;
    removeUnusedAttributes: boolean;
    useSelfClosingTags: boolean;
}

export const defaultSettings: ISettings = {
    attributesInNewlineThreshold: 1,
    formatOnSave: false,
    positionAllAttributesOnFirstLine: false,
    removeUnusedAttributes: false,
    useSelfClosingTags: true
};

export class Settings {
    attributesInNewlineThreshold?: number;
    formatOnSave?: boolean;
    positionAllAttributesOnFirstLine?: boolean;
    removeUnusedAttributes?: boolean;
    useSelfClosingTags?: boolean;

    constructor(attributesInNewlineThreshold?: number,
        formatOnSave?: boolean,
        positionAllAttributesOnFirstLine?: boolean,
        removeUnusedAttributes?: boolean,
        useSelfClosingTags?: boolean) {
        this.attributesInNewlineThreshold = attributesInNewlineThreshold ?? defaultSettings.attributesInNewlineThreshold;
        this.formatOnSave = formatOnSave ?? defaultSettings.formatOnSave;
        this.positionAllAttributesOnFirstLine = positionAllAttributesOnFirstLine ?? defaultSettings.positionAllAttributesOnFirstLine;
        this.removeUnusedAttributes = removeUnusedAttributes ?? defaultSettings.removeUnusedAttributes;
        this.useSelfClosingTags = useSelfClosingTags ?? defaultSettings.useSelfClosingTags;
    }
} 