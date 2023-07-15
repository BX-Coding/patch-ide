import { Box, Button, TextField, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useContext, useState } from "react";
import pyatchContext from "./provider/PyatchContext";

export function PatchQuestion(props) {
    const { onAnswer, questionAsked } = useContext(pyatchContext);
    const [inputFieldText, setInputFieldText] = useState("");
    
    const handleInputFieldChange = (event) => {
        setInputFieldText(event.target.value);
    }

    return<>
        <Box container sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            margin: 1,
            padding: 1,
            borderRadius: 1,
            boxShadow: 1,
            width: "70%",
        }}>
            {questionAsked && <Typography component="div" sx={{ margin: 1, color: "black", }}>
                {questionAsked}
            </Typography>
            }
            <Box container sx={{
                display: 'flex',
                flexDirection: 'row',
                width: 1,
            }}>
                <TextField 
                    size="small"
                    sx={{ 
                        fieldset: { borderColor: "primary.main" },
                        width: 1,
                    }}
                    onChange={handleInputFieldChange}
                />
                <Button onClick={onAnswer(inputFieldText)}><CheckCircleIcon/></Button>
            </Box>
        </Box>
        </>;
}