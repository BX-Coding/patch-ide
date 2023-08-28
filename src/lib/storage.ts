import ScratchStorage, { AssetTypeMeta, DataFormat } from 'scratch-storage';
import { Asset } from '../components/EditorPane/types';
import { StorageReference, ref, getDownloadURL, FirebaseStorage } from 'firebase/storage';


/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class PatchFirebaseStorage extends ScratchStorage {
    constructor () {
        super();
    }

    addFirebaseStores (storage: FirebaseStorage) {
        this.addWebStore(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            storage,
            'scratch'
        );
    }
}

const patchStorage = new PatchFirebaseStorage();

export default patchStorage;