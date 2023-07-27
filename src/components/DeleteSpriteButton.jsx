import React, { useContext } from 'react';
import patchContext from './provider/PatchContext.js';

import { DeleteButton } from './PatchButtons.jsx';

export function DeleteSpriteButton(props) {
    const { targetIds, editingTargetId, onDeleteSprite } = useContext(patchContext);

    return (
        <DeleteButton red={true} disabled={targetIds[0] == editingTargetId} onClick={() => { onDeleteSprite(editingTargetId); }} />
    );
}