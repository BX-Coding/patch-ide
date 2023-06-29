import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import patchPenguin from '../assets/PatchPenguin.svg';

function SplashScreen(props) {
    const [loadingText, setLoadingText] = useState("Loading")
    const [loadingDots, setLoadingDots] = useState("")

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingDots(loadingDots => loadingDots.length < 3 ? loadingDots + "." : "");
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return(
        <Box sx={{width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#282828", flexDirection: "column"}}>
            <img style={{dropShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", height: "50%"}} src={patchPenguin}/>
            <Typography sx={{fontSize: "24pt", padding: "8px"}}>{`${loadingText}${loadingDots}`}</Typography>
        </Box>
    );
}

export default SplashScreen;