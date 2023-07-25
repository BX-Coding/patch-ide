import React from 'react';

import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export function PatchHorizontalButtons(props) {
    const { children, sx, spacing } = props;

    return (
        <Grid container direction="row" spacing={spacing ? spacing : "4px"} mb="4px" sx={sx}>
            {(Array.isArray(children) ? children : [children]).map((child, i) => {
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
    const { onClick, onClickArgs, variant, color, textColor, icon, sx, disabled } = props;
    return <Button disabled={disabled ? disabled : false } sx={{color: textColor ? textColor : '', ...sx}} variant={variant} onClick={onClickArgs ? () => {onClick(...onClickArgs)} : onClick} color={color}>{icon}</Button>
}

export function PatchAddButton(props) {
    const { onClick, onClickArgs, variant, sx, disabled } = props;
    return <PatchButton disabled={disabled} sx={sx} variant={variant ? variant : "contained"} onClick={onClick} onClickArgs={onClickArgs} color={'primary'} icon={PatchIconTypes.Add} />
}

export function PatchDeleteButton(props) {
    const { red, onClick, onClickArgs, variant, sx, disabled } = props;
    return <PatchButton disabled={disabled} sx={sx} variant={variant ? variant : "contained"} color={red ? 'error' : 'primary'} onClick={onClickArgs ? () => {onClick(...onClickArgs)} : onClick} icon={PatchIconTypes.Delete} />
}

export function PatchIconButton(props) {
    const { color, onClick, onClickArgs, variant, sx, icon, disabled } = props;
    return <PatchButton disabled={disabled} sx={sx} variant={variant ? variant : "contained"} color={color ? color : 'primary'} onClick={onClickArgs ? () => {onClick(...onClickArgs)} : onClick} icon={icon} />
}

export function PatchTextButton(props) {
    const { onClick, onClickArgs, variant, text, textColor, sx, disabled } = props;
    return <PatchButton disabled={disabled} sx={sx} variant={variant ? variant : "contained"} onClick={onClick} onClickArgs={onClickArgs} textColor={textColor ? textColor : ''} icon={text} />
}

export function ItemCard(props) {
    const { imageSrc, title, selected, onClick, actionButtons, width, height } = props;

    const imgHeight = height - 40;

    return (
        <Box onClick={() => { onClick(title) }} sx={{
            backgroundColor: selected ? 'primary.dark' : 'none',
            borderColor: 'primary.dark',
            borderStyle: 'solid',
            borderWidth: 3,
            borderRadius: 1,
            '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
            },
            width: width,
            height: height,
            justifyContent: 'center'
        }}>
                <img src={imageSrc} width={width} height={imgHeight}/>
            <Grid container direction="row">
                <Typography sx={{margin: "4px"}}>{title}</Typography>
                {actionButtons ? (actionButtons.map((button, i) => {
                    return (
                        <Grid item>{button}</Grid>
                    );
                })) : null}
            </Grid>
        </Box>
    );
}