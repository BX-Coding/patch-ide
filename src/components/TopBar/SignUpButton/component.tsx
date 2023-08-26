import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextButton } from '../../PatchButton';

export function SignUpButton() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} text="Sign Up" variant="contained" onClick={handleClickOpen} />
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
            }}>Sign In</DialogTitle>
        <DialogContent sx={{
                backgroundColor: 'panel.dark',
                borderStyle: "solid", 
                borderWidth: "1px", 
                borderColor: "outlinedButtonBorder.main",
                borderRadius: "0px",
                borderTopStyle: "none",
            }}>
          <DialogContentText>
            We are not currently allowing public sign ups for Patch. If you would like to join the beta, please select the "Join Discord" option below and message in the "Join Beta" channel.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{
                backgroundColor: 'background.default',
                borderStyle: "solid", 
                borderWidth: "1px", 
                borderColor: "outlinedButtonBorder.main",
                borderRadius: "8px",
                borderTopStyle: "none",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
            }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Join Discord</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}