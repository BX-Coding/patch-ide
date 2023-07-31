import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import usePatchStore from '../../store';


export function SpriteAttributePane() {
    const editingTargetX = usePatchStore((state) => state.editingTargetX);
    const editingTargetY = usePatchStore((state) => state.editingTargetY);
    const editingTargetSize = usePatchStore((state) => state.editingTargetSize);
    const editingTargetDirection = usePatchStore((state) => state.editingTargetDirection);

    return(
        <Typography variant="h5" align = "center">X: {Math.round(editingTargetX)} Y: {Math.round(editingTargetY)} Size: {Math.round(editingTargetSize)} Direction: {Math.round(editingTargetDirection)} </Typography>
    );
}