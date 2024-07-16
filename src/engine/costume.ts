export default class Costume {
    assetId: string;
    name: string;
    md5?: string;
    md5ext: string;
    textLayerMD5?: string;
    bitmapResolution: number;
    asset?: Asset;
    dataFormat: string;
    rotationCenterX: number;
    rotationCenterY: number;
}