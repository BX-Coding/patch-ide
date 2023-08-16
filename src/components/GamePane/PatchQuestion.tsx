import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useContext, useState } from "react";
import usePatchStore from "../../store";

export function PatchQuestion() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const questionAsked = usePatchStore((state) => state.questionAsked);
    const [inputFieldText, setInputFieldText] = useState("");

    const onAnswer = (text: string) => () => {
        if (patchVM) {
            patchVM.runtime.emit("ANSWER", text);
        }
      }
    
    const handleInputFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputFieldText(event.target.value);
    }

    return <Box sx={{
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
            <Box sx={{
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
        </Box>;
}