import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextButton } from '../../PatchButton';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../lib/firebase';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

type signInFormProps = {
  onEmailTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onPassTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const SignInForm = ({onEmailTextChange, onPassTextChange}: signInFormProps) => {
  return <>
    <DialogContentText>
      Please sign into your Beta account here
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="email"
      label="Email Address"
      type="email"
      fullWidth
      variant="outlined"
      onChange={onEmailTextChange}
    />
    <TextField
      margin="dense"
      id="pass"
      label="Password"
      type="password"
      fullWidth
      variant="outlined"
      onChange={onPassTextChange}
    />
  </>
};


export const SignInButton = () => {
  const [open, setOpen] = React.useState(false);
  const [emailText, setEmailText] = React.useState<string>('');
  const [passwordText, setPasswordText] = React.useState<string>('');
  const [user, loading, error] = useAuthState(auth);
  

  const onEmailTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailText(event.target.value);
  }

  const onPassTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordText(event.target.value);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, emailText, passwordText);
      handleClose();
    } catch (error) {
      toast.error(error as string);
    }
  }

  return (
    <div>
      <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} text="Sign In" variant="contained" onClick={handleClickOpen} />
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
          {loading ? <CircularProgress /> : <SignInForm onEmailTextChange={onEmailTextChange} onPassTextChange={onPassTextChange}/>}
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
          <Button onClick={handleSignIn} disabled={loading}>Sign In</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
