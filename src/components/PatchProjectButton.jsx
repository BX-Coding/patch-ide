import * as React from 'react';
import Button from '@mui/material/Button';

export default function PatchProjectButton() {
  const handleClick = (event) => {
    console.log(event.currentTarget.id);
  };

  return (
    <div>
      <Button id = "project" variant="contained" onClick={handleClick}>Projects</Button>
    </div>
  );
  }