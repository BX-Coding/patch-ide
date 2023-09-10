import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Tooltip, Typography } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { tosText, privacyText } from '../../assets/legalTexts';

const TermsOfService = () => {
    return (<>
        <div dangerouslySetInnerHTML={{__html: tosText}}/>
    </>);
}

const PrivacyTerms = () => {
    return (<>
        <div dangerouslySetInnerHTML={{__html: privacyText}}/>
    </>);
}


export const LegalDialogueButton = () => {
    const [open, setOpen] = React.useState(false);
    const termsRef = React.useRef<HTMLDivElement>(null);
    const privacyRef = React.useRef<HTMLDivElement>(null);
    const creativeRef = React.useRef<HTMLDivElement>(null);
    
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };


  return (
    <div>
        <Tooltip title="Legal Disclaimers">
            <Button onClick={handleClickOpen}><QuestionMarkIcon/></Button>
        </Tooltip>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{
                    backgroundColor: 'panel.dark',
                    borderStyle: "solid", 
                    borderWidth: "1px", 
                    borderColor: "outlinedButtonBorder.main",
                    borderRadius: "8px",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                    borderBottomStyle: "none",
                }}>Legal</DialogTitle>
            <DialogContent sx={{
                    backgroundColor: 'panel.dark',
                    borderStyle: "solid", 
                    borderWidth: "1px", 
                    borderColor: "outlinedButtonBorder.main",
                    borderRadius: "0px",
                    borderTopStyle: "none",
                }}>
                    <Typography variant="h5" fontWeight="bold">TABLE OF CONTENTS</Typography>
                    <Box display='flex' flexDirection='column' >
                        <Button onClick={() => creativeRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>CREATIVE COMMONS ATTRIBUTION</Button>
                        <Button onClick={() => privacyRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>PRIVACY NOTICE</Button>
                        <Button onClick={() => termsRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>TERMS OF USE</Button>
                    </Box>
                    <br/>
                    <br/>
                    <span ref={creativeRef}>
                        <Typography variant="h5" fontWeight="bold">CREATIVE COMMONS ATTRIBUTION</Typography>
                        <Typography fontWeight="bold">ShareAlike 2.0 Generic (CC BY-SA 2.0)</Typography>
                    </span>
                    <Typography fontSize={14}>Patch is an adaptation of Scratch. Scratch is developed by the Lifelong Kindergarten Group at the MIT Media Lab. See <a href='http://scratch.mit.edu'>http://scratch.mit.edu</a>.</Typography>
                    <br/>
                    <br/>
                    <span ref={privacyRef}>
                        <Typography variant="h5" fontWeight="bold">PRIVACY NOTICE</Typography>
                        <PrivacyTerms/>
                    </span>
                    <br/>
                    <br/>
                    <span ref={termsRef}>
                        <TermsOfService/>
                    </span>
            </DialogContent>
        </Dialog>
    </div>
  );
}
