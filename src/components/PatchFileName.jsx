import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function PatchFileButton() {

    const handleTextChange = event =>{
        console.log(event.target.value);
    };
    
    return (
        <div>
        <TextField
            hiddenLabel
            onChange = {handleTextChange}
            id="fileName"
            defaultValue="Untitled"
            variant="outlined"  
            size="small"
            fullWidth
            sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}
        />
        </div>
    );
  }