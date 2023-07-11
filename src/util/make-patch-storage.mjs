import ScratchStorage from 'scratch-storage';

const SCRATCH_ASSET_SERVER = 'https://cdn.assets.scratch.mit.edu/';
const SCRATCH_PROJECT_SERVER = 'https://cdn.projects.scratch.mit.edu/';

const PATCH_ASSET_SERVER = '/'

/**
 * @param {Asset} asset - calculate a URL for this asset.
 * @returns {string} a URL to download a project file.
 */
const getScratchProjectUrl = function (asset) {
    const assetIdParts = asset.assetId.split('.');
    const assetUrlParts = [SCRATCH_PROJECT_SERVER, 'internalapi/project/', assetIdParts[0], '/get/'];
    if (assetIdParts[1]) {
        assetUrlParts.push(assetIdParts[1]);
    }
    return assetUrlParts.join('');
};

/**
 * @param {Asset} asset - calculate a URL for this asset.
 * @returns {string} a URL to download a project asset (PNG, WAV, etc.)
 */
const getScratchAssetUrl = function (asset) {
    const assetUrlParts = [
        SCRATCH_ASSET_SERVER,
        'internalapi/asset/',
        asset.assetId,
        '.',
        asset.dataFormat,
        '/get/'
    ];
    return assetUrlParts.join('');
};

/**
 * @param {Asset} asset - calculate a URL for this asset.
 * @returns {string} a URL to download a project asset (PNG, WAV, etc.)
 */
const getPatchAssetUrl = function (asset) {
    const assetUrlParts = [
        PATCH_ASSET_SERVER,
        'asset/',
        asset.assetId,
        '.',
        asset.dataFormat
    ];
    return assetUrlParts.join('');
};

/**
 * Construct a new instance of ScratchStorage and provide it with default web sources.
 * @returns {ScratchStorage} - an instance of ScratchStorage, ready to be used for tests.
 */
const makePatchStorage = function () {
    const storage = new ScratchStorage();
    const AssetType = storage.AssetType;
    storage.addWebStore([AssetType.Project], getScratchProjectUrl);
    storage.addWebStore([AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound], getScratchAssetUrl);
    storage.addWebStore([AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound], getPatchAssetUrl);
    return storage;
};

export default makePatchStorage;
