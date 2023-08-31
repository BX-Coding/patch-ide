import ScratchStorage from 'scratch-storage';
// @ts-ignore
import {inlineSvgFonts} from 'scratch-svg-renderer';
import { Asset } from '../components/EditorPane/types';

// Contains 'font-family', but doesn't only contain 'font-family="none"'
const HAS_FONT_REGEXP = 'font-family(?!="none")';

const getCostumeUrl = (function () {
    let cachedAssetId: string;
    let cachedUrl: string;

    return function (asset?: Asset) {

        if (!asset) {
            return '';
        }

        if (cachedAssetId === asset.assetId) {
            return cachedUrl;
        }

        cachedAssetId = asset.assetId;

        // If the SVG refers to fonts, they must be inlined in order to display correctly in the img tag.
        // Avoid parsing the SVG when possible, since it's expensive.
        if (asset.assetType === ScratchStorage.AssetType.ImageVector) {
            // @ts-ignore
            const svgString = asset.decodeText();
            if (svgString.match(HAS_FONT_REGEXP)) {
                const svgText = inlineSvgFonts(svgString);
                cachedUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
            } else {
                // @ts-ignore
                cachedUrl = asset.encodeDataURI();
            }
        } else {
            // @ts-ignore
            cachedUrl = asset.encodeDataURI();
        }

        return cachedUrl;
    };
}());

export {
    getCostumeUrl as default,
    HAS_FONT_REGEXP
};
