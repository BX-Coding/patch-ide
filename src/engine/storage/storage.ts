import { Dictionary } from "../interfaces";
import Asset from "./asset";

export type AssetType = "png" | "bmp" | "svg" | "jpeg" | "wav" | "mp3" | "ogg" | "flac" | "acc";

export function isSoundAssetType(assetType: AssetType) {
    return assetType == "wav" || assetType == "mp3" || assetType == "ogg" || assetType == "flac" || assetType == "acc";
}

export function isImageAssetType(assetType: AssetType) {
    return assetType == "png" || assetType == "bmp" || assetType == "svg" || assetType == "jpeg";
}

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

    getAssetType(assetId: string): AssetType | null {
        return this.assets[assetId] ? this.assets[assetId].assetType : null;
    }

    addAsset(
        assetId: string,
        assetData: Blob | ArrayBuffer,
        assetType: AssetType
    ): string {
        if (this.assets[assetId]) {
            this.assets[assetId].refCount++;

            return this.assets[assetId].url;
        }

        const assetDataBlob =
            assetData instanceof Blob ? assetData : new Blob([assetData], assetType == "svg" ? {type: "image/svg+xml"} : undefined);

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

    get assetIds(): string[] {
        return Object.keys(this.assets);
    }
}

const patchAssetStorage = new PatchStorage();

export default patchAssetStorage;