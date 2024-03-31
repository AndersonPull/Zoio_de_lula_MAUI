export interface ISettings {
    attributesInNewlineThreshold: number;
    positionAllAttributesOnFirstLine: boolean;
    putTheFirstAttributeOnTheFirstLine: boolean;
    removeUnusedAttributes: boolean;
    useSelfClosingTags: boolean;
}

export const defaultSettings: ISettings = {
    attributesInNewlineThreshold: 1,
    positionAllAttributesOnFirstLine: false,
    putTheFirstAttributeOnTheFirstLine: false,
    removeUnusedAttributes: false,
    useSelfClosingTags: true
};

export class Settings {
    attributesInNewlineThreshold?: number;
    positionAllAttributesOnFirstLine?: boolean;
    putTheFirstAttributeOnTheFirstLine?: boolean;
    removeUnusedAttributes?: boolean;
    useSelfClosingTags?: boolean;

    constructor(attributesInNewlineThreshold?: number,
        positionAllAttributesOnFirstLine?: boolean,
        putTheFirstAttributeOnTheFirstLine?: boolean,
        removeUnusedAttributes?: boolean,
        useSelfClosingTags?: boolean) {
        this.attributesInNewlineThreshold = attributesInNewlineThreshold ?? defaultSettings.attributesInNewlineThreshold;
        this.positionAllAttributesOnFirstLine = positionAllAttributesOnFirstLine ?? defaultSettings.positionAllAttributesOnFirstLine;
        this.putTheFirstAttributeOnTheFirstLine = putTheFirstAttributeOnTheFirstLine ?? defaultSettings.putTheFirstAttributeOnTheFirstLine;
        this.removeUnusedAttributes = removeUnusedAttributes ?? defaultSettings.removeUnusedAttributes;
        this.useSelfClosingTags = useSelfClosingTags ?? defaultSettings.useSelfClosingTags;
    }
} 