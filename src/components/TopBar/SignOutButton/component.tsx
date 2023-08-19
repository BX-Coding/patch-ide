import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextButton } from '../../PatchButton';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase';

export const SignOutButton = () => {
  const handleSignOut = () => {
    signOut(auth);
  }

  return <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} text="Sign Out" variant="contained" onClick={handleSignOut} />;
}
