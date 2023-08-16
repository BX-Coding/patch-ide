import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import patchPenguin from '../../assets/PatchPenguin.svg';

type SplashScreenProps = {
    renderCondition: boolean,
    children?: React.ReactNode,
}
const SplashScreen = ({ renderCondition, children }: SplashScreenProps) => {
    return <>
        {!renderCondition && <PatchAnimation/>}
        <div style={{display: renderCondition ? "block" : "none"}}>{children}</div>
    </>
}

const PatchAnimation = () => {
    const [loadingText, setLoadingText] = useState("Loading")
    const [loadingDots, setLoadingDots] = useState("")

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingDots(loadingDots => loadingDots.length < 3 ? loadingDots + "." : "");
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return(
        <Box sx={{width: "100vw", height: "100vh", display: "flex", margin: "-8px", justifyContent: "center", alignItems: "center", backgroundColor: "background.default", flexDirection: "column"}}>
            <img style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", height: "50%"}} src={patchPenguin}/>
            <Typography sx={{fontSize: "24pt", padding: "8px"}}>{`${loadingText}${loadingDots}`}</Typography>
        </Box>
    );
}

export default SplashScreen;