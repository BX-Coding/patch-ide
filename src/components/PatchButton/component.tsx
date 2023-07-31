import React, { ReactNode } from 'react';

import Button from '@mui/material/Button'

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Grid, GridSpacing, GridSize } from '@mui/material';

type HorizontalButtonsProps = {
    children: ReactNode,
    sx?: any,
    spacing?: GridSpacing,
    mb?: GridSize
}

export const HorizontalButtons = ({ children, sx, spacing, mb }: HorizontalButtonsProps) => {
    return (
        <Grid container direction="row" spacing={spacing ? spacing : "4px"} mb={mb ? mb : "4px"} sx={sx}>
            {(Array.isArray(children) ? children : [children]).map((child, i) => {
                return <Grid item key={i}>{child}</Grid>
            })}
        </Grid>
    );
}


type PatchButtonProps = {
    onClick: () => void,
    onClickArgs?: any[],
    variant?: "text" | "outlined" | "contained",
    color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning",
    textColor?: string,
    icon: JSX.Element | string,
    sx?: any,
    disabled?: boolean
}

const PatchButton = ({ onClick, onClickArgs, variant, color, textColor, icon, sx, disabled }: PatchButtonProps) => {
    const onClickWithArgs = () => {
        if (onClickArgs) {
            // @ts-ignore
            onClick(...onClickArgs);
        } else {
            onClick();
        }
    }
    return <Button disabled={disabled ? disabled : false } sx={{color: textColor ? textColor : '', ...sx}} variant={variant} onClick={onClickWithArgs} color={color}>{icon}</Button>
}

type AddButtonProps = {
    onClick: () => void,
    onClickArgs?: any[],
    variant?: "text" | "outlined" | "contained",
    sx?: any,
    disabled?: boolean
}

export const AddButton = ({ onClick, onClickArgs, variant, sx, disabled }: AddButtonProps) => {
    return <PatchButton disabled={disabled} sx={sx} variant={variant ? variant : "contained"} onClick={onClick} onClickArgs={onClickArgs} color={'primary'} icon={<AddIcon />} />
}

type DeleteButtonProps = {
    red?: boolean,
    onClick: () => void,
    onClickArgs?: any[],
    variant?: "text" | "outlined" | "contained",
    sx?: any,
    disabled?: boolean
}

export const DeleteButton = ({ red, onClick, onClickArgs, variant, sx, disabled }: DeleteButtonProps) => {
    return <PatchButton disabled={disabled} sx={sx} variant={variant ? variant : "contained"} color={red ? 'error' : 'primary'} onClick={onClick} onClickArgs={onClickArgs} icon={<DeleteIcon />} />
}

type IconButtonProps = {
    color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning",
    onClick: () => void,
    onClickArgs?: any[],
    variant?: "text" | "outlined" | "contained",
    sx?: any,
    icon: JSX.Element,
    disabled?: boolean
}

export const IconButton = ({ color, onClick, onClickArgs, variant, sx, icon, disabled }: IconButtonProps) => {
    return <PatchButton disabled={disabled} sx={sx} variant={variant ? variant : "contained"} color={color ? color : 'primary'} onClick={onClick} onClickArgs={onClickArgs} icon={icon} />
}

type TextButtonProps = {
    onClick: () => void,
    onClickArgs?: any[],
    variant?: "text" | "outlined" | "contained",
    text: string,
    textColor?: string,
    sx?: any,
    disabled?: boolean
}

export const TextButton = ({ onClick, onClickArgs, variant, text, textColor, sx, disabled }: TextButtonProps) => {
    return <PatchButton disabled={disabled} sx={sx} variant={variant ? variant : "contained"} onClick={onClick} onClickArgs={onClickArgs} textColor={textColor ? textColor : ''} icon={text} />
}

