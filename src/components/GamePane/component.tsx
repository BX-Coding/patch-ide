import React from "react";
import { Box, Grid } from "@mui/material";
import { HorizontalButtons } from "../PatchButton";
import { StartButton, StopButton } from "./ControlButton";
import Stage from "./Stage";

export const GamePane = () => {
    return <>
        <Grid item container className="assetHolder" sx={{
            paddingTop: "8px",
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingBottom: "2px",
            borderBottomWidth: "1px",
            borderLeftWidth: "1px",
            borderColor: 'divider',
        }}>
            <HorizontalButtons>
                <StartButton />
                <StopButton />
            </HorizontalButtons>
        </Grid>
        <Box className="assetHolder" sx={{
            backgroundColor: 'panel.default',
            padding: "8px",
            minHeight: "calc(100% - 67px)",
            borderLeftWidth: "1px",
            borderColor: 'divider',
        }}>
            <Box className="canvasBox" sx={{
                backgroundColor: 'panel.default',
                borderColor: 'divider',
                borderRadius: "8px",
                overflow: "clip",
            }}>
                <Stage />
            </Box>
        </Box>
    </>;
}