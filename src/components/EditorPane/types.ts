export type Asset = {
    assetId: string,
    assetType: string,
}

export type Costume = {
    name: string,
    md5: string,
    md5ext: string,
    textLayerMD5: string,
    bitmapResolution: number,
    asset: Asset,
    dataFormat: string,
    rotationCenterX: number,
    rotationCenterY: number,
}