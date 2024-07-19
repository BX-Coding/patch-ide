//import ScratchStorage from "scratch-storage";
import { FirebaseStorage, ref } from "firebase/storage";
import { Asset, AssetType, DataFormat } from "../components/EditorPane/old-types";

export const SCRATCH_PATH = "scratch";
export const URL_SLASH = "%2F";
export const FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/";

/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
/*class PatchFirebaseStorage extends ScratchStorage {
  constructor() {
    super();
  }

  addFirebaseStorageStores(storage: FirebaseStorage) {
    const getFirebaseAssetUrl = (asset: Asset) =>
      `${FIREBASE_STORAGE_URL}${storage.app.options.storageBucket}/o/${SCRATCH_PATH}${URL_SLASH}${asset.assetId}.${asset.dataFormat}?alt=media`;
    const postFirebaseAssetUrl = (asset: Asset) =>
      `${FIREBASE_STORAGE_URL}${storage.app.options.storageBucket}/o/${SCRATCH_PATH}${URL_SLASH}${asset.assetId}.${asset.dataFormat}`;
    this.addWebStore(
      [
        this.AssetType.ImageVector,
        this.AssetType.ImageBitmap,
        this.AssetType.Sound,
      ],
      getFirebaseAssetUrl,
      postFirebaseAssetUrl,
      postFirebaseAssetUrl
    );
  }
}

const patchFirebaseStorage = new PatchFirebaseStorage();

export default patchFirebaseStorage;
*/