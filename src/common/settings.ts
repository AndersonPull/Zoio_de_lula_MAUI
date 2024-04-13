export interface ISettings {
    numberOfAttributesPerLine: number;
    positionAllAttributesOnFirstLine: boolean;
    putTheFirstAttributeOnTheFirstLine: boolean;
    removeUnusedAttributes: boolean;
    useSelfClosingTags: boolean;
}

export const defaultSettings: ISettings = {
    numberOfAttributesPerLine: 1,
    positionAllAttributesOnFirstLine: false,
    putTheFirstAttributeOnTheFirstLine: false,
    removeUnusedAttributes: false,
    useSelfClosingTags: true
};

export class Settings {
    numberOfAttributesPerLine?: number;
    positionAllAttributesOnFirstLine?: boolean;
    putTheFirstAttributeOnTheFirstLine?: boolean;
    removeUnusedAttributes?: boolean;
    useSelfClosingTags?: boolean;

    constructor(numberOfAttributesPerLine?: number,
        positionAllAttributesOnFirstLine?: boolean,
        putTheFirstAttributeOnTheFirstLine?: boolean,
        removeUnusedAttributes?: boolean,
        useSelfClosingTags?: boolean) {
        this.numberOfAttributesPerLine = numberOfAttributesPerLine ?? defaultSettings.numberOfAttributesPerLine;
        this.positionAllAttributesOnFirstLine = positionAllAttributesOnFirstLine ?? defaultSettings.positionAllAttributesOnFirstLine;
        this.putTheFirstAttributeOnTheFirstLine = putTheFirstAttributeOnTheFirstLine ?? defaultSettings.putTheFirstAttributeOnTheFirstLine;
        this.removeUnusedAttributes = removeUnusedAttributes ?? defaultSettings.removeUnusedAttributes;
        this.useSelfClosingTags = useSelfClosingTags ?? defaultSettings.useSelfClosingTags;
    }
} 