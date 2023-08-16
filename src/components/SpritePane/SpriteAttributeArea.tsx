import React from 'react';
import Typography from '@mui/material/Typography';
import usePatchStore from '../../store';


export function SpriteAttributePane() {
    const editingTargetX = usePatchStore((state) => state.editingTargetX);
    const editingTargetY = usePatchStore((state) => state.editingTargetY);
    const editingTargetSize = usePatchStore((state) => state.editingTargetSize);
    const editingTargetDirection = usePatchStore((state) => state.editingTargetDirection);

    return(
        <Typography variant="h5" fontWeight="light" align = "center" sx={{marginTop: "-8px"}}>X: {Math.round(editingTargetX)} Y: {Math.round(editingTargetY)} Size: {Math.round(editingTargetSize)} Direction: {Math.round(editingTargetDirection)} </Typography>
    );
}