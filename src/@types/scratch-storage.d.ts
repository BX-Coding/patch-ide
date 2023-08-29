import { FirebaseStorage, StorageReference } from "firebase/storage";
import { Asset, AssetType, DataFormat } from "../components/EditorPane/types";

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

        addWebStore(types: AssetType[], getFunction: (asset: Asset) => void, createFunction: (asset: Asset) => void, updateFunction: (asset: Asset) => void): void;
        createAsset(assetType: AssetType, dataFormat: DataFormat, data: ArrayBuffer, id: string, generateId: string): Asset;
        load(assetType: AssetType, assetId: string, dataFormat: DataFormat): Promise<Asset>;
        store(assetType: AssetType, dataFormat: DataFormat, data: ArrayBuffer, assetId: string): Promise<Object>;
        static get AssetType(): Record<string, AssetType>;
        get AssetType(): Record<string, AssetType>;
    }

    export abstract class Helper {
        constructor(parent: any);

        load(assetType: AssetType, assetId: string, dataFormat: DataFormat): Promise<Asset>;
    }
}