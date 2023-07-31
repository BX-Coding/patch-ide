import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { boxStyle, typographyStyle } from './style';

type ItemCardProps = {
    imageSrc: string,
    title: string,
    selected: boolean,
    onClick: (title: string) => void,
    actionButtons?: JSX.Element[],
    width: number,
    height: number,
}

export function ItemCard({ imageSrc, title, selected, onClick, actionButtons, width, height }: ItemCardProps) {
    const imgHeight = height - 40;

    return (
        <Box onClick={() => { onClick(title) }} sx={boxStyle(selected, height, width)}>
                <img src={imageSrc} width={width} height={imgHeight}/>
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