import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextButton } from '../../PatchButton';
import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { usePasswordValidator } from './usePasswordValidator';
import { toast } from 'react-toastify';
import { auth } from '../../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export function SignUpButton() {
  const { validatePassword } = usePasswordValidator();

  const [open, setOpen] = React.useState(false);

  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignUp = () => {
    // Throw Error if name is not valid
    if (firstName.length < 1 || lastName.length < 1) {
      toast.error("Please enter a valid first and last name");
      return;
    }

    // Throw error if email is not valid
    if (!email.includes("@") || !email.includes(".") || email.length < 5) {
      toast.error("Please enter a valid email address");
      return;
    }

    const errors = validatePassword(password);
    if (errors.length > 0) {
      toast.error(errors.map(error => error.message).join("\n"));
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("Signed up successfully!");
        setOpen(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  }

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
            }}>Sign Up</DialogTitle>
        <DialogContent sx={{
                backgroundColor: 'panel.dark',
                borderStyle: "solid", 
                borderWidth: "1px", 
                borderColor: "outlinedButtonBorder.main",
                borderRadius: "0px",
                borderTopStyle: "none",
            }}>
          <Grid container spacing={2} sx={{marginTop: 0.1}}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                type="text"
                autoFocus
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                type="text"
                autoComplete="lname"
                onChange={(event) => setLastName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
          </Grid>
          
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}