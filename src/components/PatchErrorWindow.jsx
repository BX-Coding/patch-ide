import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function PatchErrorWindow(){
    const { errorList } = useContext(pyatchContext);
    let errors = errorList;

    return(<Grid>{errors ?.map((error) => {
        return <OneError key={error.uid} errorOne={error.errName} prior={error.priorText} after={error.afterText} errCode={error.errCode} line={error.line} sprite={error.sprite}/>
    })}</Grid>);
}

function OneError(props){
    return(
        <>
            <Typography>{props.errorOne}<br/></Typography>
            <br/>
            <Grid>{props.prior.map((text,i)=>(
                <Typography key={i}>{text}</Typography>
            ))}</Grid>
            <Typography sx={{color: 'red'}}>{props.errCode}</Typography>
            <Grid>{props.after.map((text,i)=>(
                <Typography key={i}>{text}</Typography>
            ))}</Grid>
            <br/>
            <Typography>Line: {props.line}</Typography>
            <Typography>Sprite: {props.sprite}</Typography>
            <hr/>
        </>
    );
}