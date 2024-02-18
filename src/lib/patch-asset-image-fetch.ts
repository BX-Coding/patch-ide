import { getStorage } from "firebase/storage";
import { FIREBASE_STORAGE_URL, SCRATCH_PATH, URL_SLASH } from "./storage";

export const getPatchAssetImageUrl = (assetId: string, dataFormat: string) => {
  const storage = getStorage();
  return `${FIREBASE_STORAGE_URL}${storage.app.options.storageBucket}/o/${SCRATCH_PATH}${URL_SLASH}${assetId}.${dataFormat}?alt=media`;
};
