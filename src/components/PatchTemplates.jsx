import React from 'react';

import Button from '@mui/material/Button'
import { Grid } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export function PatchHorizontalButtons(props) {
    const { children, sx } = props;

    return (
        <Grid container direction="row" spacing="4px" mb="4px" sx={sx}>
            {children.map((child, i) => {
                return <Grid item key={i}>{child}</Grid>
            })}
        </Grid>
    );
}

const PatchIconTypes = {
    Add: <AddIcon />,
    Delete: <DeleteIcon />
}

// TODO: make all buttons into 1 function that accepts an icon as an additional argument

function PatchButton(props) {
    const { onClick, onClickArgs, variant, color, icon } = props;
    return <Button variant={variant} onClick={onClickArgs ? () => {onClick(...onClickArgs)} : onClick} color={color}>{icon}</Button>
}

export function PatchAddButton(props) {
    const { onClick, onClickArgs, variant } = props;
    return <PatchButton variant={variant ? variant : "contained"} onClick={onClick} onClickArgs={onClickArgs} color={'primary'} icon={PatchIconTypes.Add} />
}

export function PatchDeleteButton(props) {
    const { red, onClick, onClickArgs, variant } = props;
    return <PatchButton variant={variant ? variant : "contained"} color={red ? 'error' : 'primary'} onClick={onClickArgs ? () => {onClick(...onClickArgs)} : onClick} icon={PatchIconTypes.Delete} />
}