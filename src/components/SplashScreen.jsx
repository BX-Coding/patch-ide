import { Box } from '@mui/material';
import patchPenguin from '../assets/patchPenguin.png';

function SplashScreen(props) {

    return(
        <Box sx={{width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#282828"}}>
            <img style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}} src={patchPenguin}/>
        </Box>
    );
}

export default SplashScreen;