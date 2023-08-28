import ScratchStorage from 'scratch-storage';
import { FirebaseStorage, ref } from 'firebase/storage';


/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class PatchFirebaseStorage extends ScratchStorage {
    constructor () {
        super();
    }

    addFirebaseStorageStores (storage: FirebaseStorage) {
        this.addFirebaseStore(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            ref(storage, 'scratch'),
        );
    }
}

const patchStorage = new PatchFirebaseStorage();

export default patchStorage;