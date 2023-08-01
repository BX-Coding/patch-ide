import React, { useState } from 'react';
import { Box, Typography, Grid, IconProps } from '@mui/material';
import { boxStyle, typographyStyle } from './style';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

type ItemCardProps = {
    title: string,
    selected: boolean,
    onClick: (title: string) => void,
    actionButtons?: JSX.Element[],
    width: number,
    height: number,
    children?: React.ReactNode | Promise<React.ReactNode>,
}

export function ItemCard({ title, selected, onClick, actionButtons, width, height, children }: ItemCardProps) {
    const [imageElement, setImageElement] = useState<JSX.Element>(<HourglassBottomIcon/>);
    if (children instanceof Promise) {
        children.then((element) => {
            setImageElement(element as JSX.Element);
        });
    }

    return (
    <Box onClick={() => { onClick(title) }} sx={boxStyle(selected, height, width)}>
        {imageElement}
        <Grid container direction="row">
            <Typography sx={typographyStyle}>{title}</Typography>
            {actionButtons ? (actionButtons.map((button, i) => {
                return (
                    <Grid item>{button}</Grid>
                );
            })) : null}
        </Grid>
    </Box>
    );
}