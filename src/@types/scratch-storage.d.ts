import { FirebaseStorage } from "firebase/storage";
import { Asset } from "../components/EditorPane/types";

enum DataFormat {
    SVG = "svg",
    PNG = "png",
    WAV = "wav",
    JSON = "json",
}

type AssetTypeMeta = {
    contentType: string,
    name: string,
    runtimeFormat: DataFormat,
    immutable: boolean,
}

type Store = {
    types: string[],
    get: (asset: Asset) => string,
    create: (asset: Asset) => void,
    update: (asset: Asset) => void,
}

declare module "scratch-storage" {
    export default class ScratchStorage {
        assetHost: string;
        stores: Store[];

        addWebStore(types: AssetTypeMeta[], firebaseStorage: FirebaseStorage, path?: string): void;
        createAsset(assetType: AssetTypeMeta, dataFormat: DataFormat, data: ArrayBuffer, id: string, generateId: string): Asset;
        load(assetType: AssetTypeMeta, assetId: string, dataFormat: DataFormat): Promise<Asset>;
        store(assetType: AssetTypeMeta, dataFormat: DataFormat, data: ArrayBuffer, assetId: string): Promise<Object>;
        get AssetType(): Record<string, AssetType>;
    }

    export abstract class Helper {
        constructor(parent: any);

        load(assetType: AssetTypeMeta, assetId: string, dataFormat: DataFormat): Promise<Asset>;
    }
}