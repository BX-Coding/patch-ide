import { useState } from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { python } from '@codemirror/lang-python';
import FlagIcon from '@mui/icons-material/Flag';
import DangerousIcon from '@mui/icons-material/Dangerous';
import Typography from '@mui/material/Typography';
import catImage from './scratchCat.png';
import './App.css'

function App() {

  return (
    <Grid container width={'100%'} spacing={2}>
      <Grid item xs={8}>
        <CodeMirror
          value="cat.move(10)"
          extensions={[python()]}
          theme={material}
          height="90vh"
        />
      </Grid>
      <Grid container item direction="column" xs={4} spacing={2}>
        <Grid container item spacing={2}>
          <Grid item>
            <Button variant="contained"><FlagIcon/></Button>
          </Grid>
          <Grid item>
            <Button variant="outlined"><DangerousIcon/></Button>
          </Grid>
        </Grid>
        <Grid container item xs={6}>
          <Grid item container justifyContent='center' alignItems={'center'} backgroundColor={'#E6E6E6'} borderColor={''} borderRadius={2} xs={12}>
            <Grid item>
              <img width={100} src={catImage}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={5}>
          <Grid item container justifyContent='center' alignItems={'center'} backgroundColor={'#2e3235'} borderColor={''} borderRadius={2} xs={12}>
            <Typography gutterBottom variant="h4" component="div">
              SPRITE AREA
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default App
