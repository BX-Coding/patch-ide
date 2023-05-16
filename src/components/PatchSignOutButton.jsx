import * as React from 'react';
import Button from '@mui/material/Button';

export default function PatchSignOutButton() {
  const handleClick = (event) => {
    console.log(event.currentTarget.id);
  };

  return (
    <div>
      <Button id="signOut" variant="contained" onClick={handleClick}>Sign Out</Button>
    </div>
  );
  }