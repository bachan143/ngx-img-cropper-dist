export declare class Fraction extends Number {
    numerator: number;
    denominator: number;
}
export interface IImageExtended extends HTMLImageElement {
    exifdata: any;
    iptcdata: any;
}
export declare class Exif {
    debug: boolean;
    IptcFieldMap: any;
    Tags: any;
    TiffTags: any;
    GPSTags: any;
    StringValues: any;
    addEvent(element: EventTarget | any, event: string, handler: EventListener): void;
    imageHasData(img: IImageExtended): boolean;
    base64ToArrayBuffer(base64: string): ArrayBuffer;
    objectURLToBlob(url: string, callback: (blob: Blob) => void): void;
    getImageData(img: IImageExtended | Blob | File, callback: (img: IImageExtended) => void): void;
    findEXIFinJPEG(file: ArrayBuffer): any;
    findIPTCinJPEG(file: ArrayBuffer): any;
    readIPTCData(file: ArrayBuffer, startOffset: number, sectionLength: number): any;
    readTags(file: DataView, tiffStart: number, dirStart: number, strings: string[], bigEnd: boolean): any;
    readTagValue(file: any, entryOffset: number, tiffStart: number, dirStart: number, bigEnd: boolean): any;
    getStringFromDB(buffer: DataView, start: number, length: number): string;
    readEXIFData(file: DataView, start: number): any;
    private checkImageType;
    getData(img: IImageExtended | HTMLImageElement, callback: () => void): boolean;
    getTag(img: any, tag: string): any;
    getAllTags(img: any): any;
    pretty(img: IImageExtended): string;
    readFromBinaryFile(file: ArrayBuffer): any;
    log(...args: any[]): void;
}
//# sourceMappingURL=exif.d.ts.map