import { AssetType } from "./storage";

interface Asset {
    assetType: AssetType;
    refCount: number;
    url: string;
    id: string;
}

export default Asset;