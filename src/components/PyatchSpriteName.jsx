import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import TextField from '@mui/material/TextField';


export function PyatchSpriteName(props) {
    const { activeSprite } = useContext(pyatchContext);
    const { pyatchEditor } = useContext(pyatchContext);

    const { sprites, setSprites } = useContext(pyatchContext);

    let spriteName = pyatchEditor.getSpriteName(props.spriteID);

    const updateName = (name) => {
        pyatchEditor.setSpriteName(name.target.value);
    }

    const active = {
        'pointerEvents': 'auto',
        'opacity': '1',
        'position': 'relative'
    };

    const inactive = {
        'pointerEvents': 'none',
        'opacity': '0',
        'position': 'absolute'
    };

    return(
        <div style={(activeSprite == props.spriteID) ? active : inactive}>
            <TextField 
                defaultValue={spriteName}
                onChange={updateName}
                fullWidth
                sx={{my: "1vh", input: { color: 'white'}, fieldset: { borderColor: "white" }}}
                size="small"
            />
        </div>
    );
}