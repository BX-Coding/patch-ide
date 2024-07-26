import patchAssetStorage, { isSoundAssetType } from "../engine/storage/storage";
import safeUid from "../engine/util/safe-uid";
import { Costume, Sound } from "leopard";
import bmpConverter from "../util/bmp-converter";
import { AssetType } from "../engine/storage/storage";

/**
 * Extract the file name given a string of the form fileName + ext
 * @param {string} nameExt File name + extension (e.g. 'my_image.png')
 * @return {string} The name without the extension, or the full name if
 * there was no '.' in the string (e.g. 'my_image')
 */
const extractFileName = function (nameExt: string) {
    // There could be multiple dots, but get the stuff before the first .
    const nameParts = nameExt.split(".", 1); // we only care about the first .
    return nameParts[0];
};

/**
 * Handle a file upload given the input element that contains the file,
 * and a function to handle loading the file.
 * @param {Input} fileInput The <input/> element that contains the file being loaded
 * @param {Function} onload The function that handles loading the file
 * @param {Function} onerror The function that handles any error loading the file
 */
const handleFileUpload = function (
    fileInput: HTMLInputElement | null,
    onload: (
        fileData: ArrayBuffer,
        fileType: string,
        fileName: string,
        index: number,
        total: number
    ) => void,
    onerror: (event: ProgressEvent<FileReader>) => void
): void {
    if (!fileInput) {
        return;
    }
    const readFile = (i: number, files: FileList) => {
        if (i === files.length) {
            // Reset the file input value now that we have everything we need
            // so that the user can upload the same sound multiple times if
            // they choose
            // @ts-ignore
            fileInput.value = null;
            return;
        }
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
            const fileType = file.type;
            const fileName = extractFileName(file.name);
            onload(
                reader.result as ArrayBuffer,
                fileType,
                fileName,
                i,
                files.length
            );
            readFile(i + 1, files);
        };
        reader.onerror = onerror;
        reader.readAsArrayBuffer(file);
    };
    // @ts-ignore
    readFile(0, fileInput?.files);
};

/**
 * @typedef VMAsset
 * @property {string} name The user-readable name of this asset - This will
 * automatically get translated to a fresh name if this one already exists in the
 * scope of this vm asset (e.g. if a sound already exists with the same name for
 * the same target)
 * @property {string} dataFormat The data format of this asset, typically
 * the extension to be used for that particular asset, e.g. 'svg' for vector images
 * @property {string} md5 The md5 hash of the asset data, followed by '.'' and dataFormat
 * @property {string} The md5 hash of the asset data // TODO remove duplication....
 */

/**
 * Create an asset (costume, sound) with storage and return an object representation
 * of the asset to track in the VM.
 * @param {ScratchStorage} storage The storage to cache the asset in
 * @param {AssetType} assetType A ScratchStorage AssetType indicating what kind of
 * asset this is.
 * @param {string} dataFormat The format of this data (typically the file extension)
 * @param {UInt8Array} data The asset data buffer
 * @return {VMAsset} An object representing this asset and relevant information
 * which can be used to look up the data in storage
 */
export const createVMAsset = function (
    assetType: AssetType,
    data: ArrayBuffer,
    name: string
): Costume | Sound {
    const id = safeUid();
    const assetURL = patchAssetStorage.addAsset(
        id,
        data,
        assetType
    );

    if (isSoundAssetType(assetType)) {
        return new Sound(name, assetURL, id);
    } else {
        return new Costume(name, assetURL, undefined, id);
    }
};

/**
 * Handles loading a costume or a backdrop using the provided, context-relevant information.
 * @param {ArrayBuffer | string} fileData The costume data to load (this can be a base64 string
 * iff the image is a bitmap)
 * @param {string} fileType The MIME type of this file
 * @param {ScratchStorage} storage The ScratchStorage instance to cache the costume data
 * @param {Function} handleCostume The function to execute on the costume object returned after
 * caching this costume in storage - This function should be responsible for
 * adding the costume to the VM and handling other UI flow that should come after adding the costume
 * @param {Function} handleError The function to execute if there is an error parsing the costume
 */
const costumeUpload = function (
    fileData: ArrayBuffer,
    fileType: string,
    name: string,
    handleCostume: (vmCostumes: Costume[]) => void,
    handleError = () => { }
) {
    let assetType: AssetType | null = null;
    switch (fileType) {
        case "image/svg+xml": {
            // run svg bytes through scratch-svg-renderer's sanitization code
            //fileData = sanitizeSvg.sanitizeByteStream(fileData);

            assetType = "svg";
            break;
        }
        case "image/jpeg": {
            assetType = "jpeg";
            break;
        }
        case "image/bmp": {
            // Convert .bmp files to .png to compress them. .bmps are completely uncompressed,
            // and would otherwise take up a lot of storage space and take much longer to upload and download.
            bmpConverter(fileData)
                .then(dataUrl => fetch(dataUrl))
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => costumeUpload(arrayBuffer, "image/png", name, handleCostume, handleError));
            return; // Return early because we're triggering another proper costumeUpload
        }
        case "image/png": {
            assetType = "png";
            break;
        }
        default:
            // @ts-ignore
            handleError(`Encountered unexpected file type: ${fileType}`);
            return;
    }

    //const bitmapAdapter = new BitmapAdapter();
    const addCostumeFromBuffer = function (
        dataBuffer: ArrayBuffer,
        name: string
    ) {
        if (!assetType) {
            // @ts-ignore
            handleError("Encountered unexpected error while loading costume");
            return;
        }

        const vmCostume = createVMAsset(assetType, dataBuffer, name);
        handleCostume([vmCostume as Costume]);
    };

    //if (assetType == "VectorImage") {
    // Must pass in file data as a Uint8Array,
    // passing in an array buffer causes the sprite/costume
    // thumbnails to not display because the data URI for the costume
    // is invalid
    // @ts-ignore
    addCostumeFromBuffer(fileData, name);
    /*} else {
        // otherwise it's a bitmap
        bitmapAdapter
            .importBitmap(fileData, fileType)
            .then((buffer: Uint8Array) => addCostumeFromBuffer(buffer, name))
            .catch(handleError);
    }*/
};

/**
 * Handles loading a sound using the provided, context-relevant information.
 * @param {ArrayBuffer} fileData The sound data to load
 * @param {string} fileType The MIME type of this file; This function will exit
 * early if the fileType is unexpected.
 * @param {ScratchStorage} storage The ScratchStorage instance to cache the sound data
 * @param {Function} handleSound The function to execute on the sound object of type VMAsset
 * This function should be responsible for adding the sound to the VM
 * as well as handling other UI flow that should come after adding the sound
 * @param {Function} handleError The function to execute if there is an error parsing the sound
 */
const soundUpload = function (
    fileData: ArrayBuffer,
    fileType: string,
    name: string,
    handleSound: (vmSound: Sound) => void,
    handleError?: (error: string) => void
): void {
    const vmSound = createVMAsset(fileType, fileData, name) as Sound;

    handleSound(vmSound);
};

/*const spriteUpload = function (
    fileData: ArrayBuffer,
    fileType: string,
    spriteName: string,
    storage: ScratchStorage,
    handleSprite: (spriteJson: SpriteJson | Uint8Array) => void, 
    handleError = () => {}
    ): void {
    switch (fileType) {
    case '':
    case 'application/zip': { // We think this is a .sprite2 or .sprite3 file
        handleSprite(new Uint8Array(fileData));
        return;
    }
    case 'image/svg+xml':
    case 'image/png':
    case 'image/bmp':
    case 'image/jpeg':
    case 'image/gif': {
        // Make a sprite from an image by making it a costume first
        costumeUpload(fileData, fileType, storage, vmCostumes => {
            vmCostumes.forEach((costume, i) => {
                costume.name = `${spriteName}${i ? i + 1 : ''}`;
            });
            const newSprite = {
                name: spriteName,
                isStage: false,
                x: 0, // x/y will be randomized below
                y: 0,
                visible: true,
                size: 100,
                rotationStyle: 'all around',
                direction: 90,
                draggable: false,
                currentCostume: 0,
                blocks: {},
                variables: {},
                costumes: vmCostumes,
                sounds: [] // TODO are all of these necessary?
            };
            // randomizeSpritePosition(newSprite);
            handleSprite(newSprite);
        }, handleError);
        return;
    }
    default: {
        // @ts-ignore
        handleError(`Encountered unexpected file type: ${fileType}`);
        return;
    }
    }
};*/

export {
    handleFileUpload,
    costumeUpload,
    soundUpload,
    //spriteUpload
};
