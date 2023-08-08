import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, IconProps } from '@mui/material';
import { boxStyle, typographyStyle } from './style';

type ItemCardProps = {
    title: string,
    selected: boolean,
    onClick: (title: string) => void,
    actionButtons?: JSX.Element[],
    width: number,
    height: number,
    children?: React.JSX.Element,
}

export function ItemCard({ title, selected, onClick, actionButtons, width, height, children }: ItemCardProps) {
    return (
    <Box onClick={() => { onClick(title) }} sx={boxStyle(selected, height, width)}>
        {children}
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