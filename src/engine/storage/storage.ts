import { Dictionary } from "../interfaces";
import Asset from "./asset";

class PatchStorage {
    protected assets: Dictionary<Asset> = {};

    loadAsset(assetId: string): string {
        const asset = this.assets[assetId];

        if (!asset) {
            console.warn("Trying to load nonexistent asset. Id: " + assetId);

            return "";
        }

        return asset.url;
    }

    addAsset(
        assetId: string,
        assetData: Blob | ArrayBuffer,
        assetType: "VectorImage" | "BitmapImage" | "Sound"
    ): string {
        if (this.assets[assetId]) {
            this.assets[assetId].refCount++;

            return this.assets[assetId].url;
        }

        const assetDataBlob =
            assetData instanceof Blob ? assetData : new Blob([assetData]);

        const asset: Asset = {
            assetType: assetType,
            id: assetId,
            refCount: 1,
            url: URL.createObjectURL(assetDataBlob),
        };

        this.assets[assetId] = asset;

        return asset.url;
    }

    unrefAsset(assetId: string): number {
        if (this.assets[assetId]) {
            const refCount = --this.assets[assetId].refCount;

            if (refCount <= 0) {
                URL.revokeObjectURL(this.assets[assetId].url);

                return 0;
            } else {
                return refCount;
            }
        }

        console.warn(
            "Trying to unref asset that doesn't exist. Id: " + assetId
        );
        return -1;
    }
}

const patchAssetStorage = new PatchStorage();

export default patchAssetStorage;