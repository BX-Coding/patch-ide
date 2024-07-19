interface Asset {
    assetType: "VectorImage" | "BitmapImage" | "Sound";
    refCount: number;
    url: string;
    id: string;
}

export default Asset;