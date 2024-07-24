import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Draggable from 'react-draggable';
import { Modal } from '@mui/base';
import { Backdrop, CardActions, CardContent, css } from '@mui/material';
import { useUser } from '../../hooks/useUser';
import { updateDoc } from 'firebase/firestore';
import { EditorTab } from '../../store/patchEditorStore';
import usePatchStore from '../../store';
import { useEffect } from 'react';
import { alignProperty } from '@mui/material/styles/cssUtils';


//steps for self guided tour
const steps = [
    {
        label: 'Welcome to Patch!',
        description: `I\’m Patch the Penguin and I can walk you through getting started to code amazing projects on Patch!`,
    },
    {
        label: 'Stage Area',
        description:
            'This is the stage area where all the action happens! Try clicking the flag to see the sample code run!',
    },
    {
        label: 'Stage Area',
        description: `That’s some crazy color changing! Click the stop sign to stop running your code.`,
    },
    {
        label: 'Editor Area',
        description: `The editor area allows us to add code. 
    Try deleting the default code and adding “move(10)”. Start typing the “m” 
    and you will notice autocomplete options appear.`,
    },
    {
        label: 'Errors',
        description:
            'What happens if you delete the last parentheses on the “move(10)” command? Patch is showing you an error by underlining the incorrect code.',
    },
    {
        label: 'Threads',
        description: `But what if you would like multiple scripts to run at once? Try threads. First save your current thread by clicking the “save thread” button.`,
    },
    {
        label: 'Threads',
        description:
            'Now click the “new thread” button to create a new thread for Patch the Penguin.',
    },
    {
        label: 'Threads',
        description: `At the top of the new thread change the starting condition from “When Flag Clicked” to “When Key Pressed”. Then choose the "UP ARROW" option.`,
    },
    {
        label: 'Threads',
        description:
            'Now add code to make Patch move up whenever the up arrow is pressed. Type “changeY(10)” in the editor. Click the flag to run your code.',
    },
    {
        label: 'Sprites',
        description: `Let’s give Patch a friend. In the sprite area click the plus button to add a sprite of your choice.`,
    },
    {
        label: 'Sounds',
        description: `Let’s make the new sprite make a sound. Click on the sounds tab. Click on the plus button to add a sound.`,
    },
    {
        label: 'Sounds',
        description: `Go back to the code editor to code the sound. Use the playSound function to play the sound you just added. Then run your project now to hear your sound.`,
    },
    {
        label: 'Save',
        description: `Great! Let’s save your project to keep your progress. Press the File -> Save button to save your project.`,
    },
    {
        label: 'That\'s All!',
        description:
            'That’s all for this tutorial. Have fun coding in Patch!',
    },
];


//steps for guided tour
const stepsHandHold = [
    {
        label: 'Welcome to Patch!',
        description: `I\’m Patch the Penguin and I can walk you through getting started to code amazing projects on Patch!`,
        tab: EditorTab.CODE,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        image: 0
    },
    {
        label: 'Stage Area',
        description:
            'This is the stage area where all the action happens! Clicking the flag makes the code run! The stop sign makes the code stop running.',
        tab: EditorTab.CODE,
        width: 600,
        height: 500,
        x: "calc(100% - 610px)",
        y: "50px",
        image: 1
    },
    {
        label: 'Editor Area',
        description: `The editor area allows us to add code. You will notice as you start typing autocomplete options appear.`,
        tab: EditorTab.CODE,
        width: "calc(100% - 700px)",
        height: "80%",
        x: "80px",
        y: "100px",
        image: 3
    },
    {
        label: 'Errors',
        description:
            'What happens if you have incorrect code? Patch will show you an error by underlining the incorrect code.',
        tab: EditorTab.CODE,
        width: "calc(100% - 700px)",
        height: "75px",
        x: "80px",
        y: "150px",
        image: 4
    },
    {
        label: 'Threads',
        description: `But what if you would like multiple scripts to run at once? Try threads. You can save you current thread by clicking the “save thread” button.`,
        tab: EditorTab.CODE,
        width: "200px",
        height: "60px",
        x: "calc(100% - 825px)",
        y: "100px",
        image: 5
    },
    {
        label: 'Threads',
        description:
            'The “new thread” button creates a new thread for the selected sprite.',
        tab: EditorTab.CODE,
        width: "200px",
        height: "60px",
        x: "calc(100% - 825px)",
        y: "100px",
        image: 6
    },
    {
        label: 'Threads',
        description: `You can also change the starting condition. At the top of the new thread for example, you can change the dropdown to say “When Flag Clicked” or “When Key Pressed”.`,
        tab: EditorTab.CODE,
        width: "calc(100% - 900px)",
        height: "60px",
        x: "80px",
        y: "100px",
        image: 7
    },
    {
        label: 'Sprites',
        description: `In the sprite area you can click the plus button to add a sprite of your choice.`,
        tab: EditorTab.CODE,
        width: 600,
        height: 400,
        x: "calc(100% - 610px)",
        y: "550px",
        image: 9
    },
    {
        label: 'Sounds',
        description: `You can also add sounds by clicking on the sounds tab. Click on the plus button to add a sound.`,
        tab: EditorTab.SOUNDS,
        width: 220,
        height: 60,
        x: "80px",
        y: "50px",
        image: 10
    },
    {
        label: 'Save',
        description: `Press the File -> Save button to save your project.`,
        tab: EditorTab.CODE,
        width: 140,
        height: 50,
        x: "75px",
        y: "5px",
        image: 12
    },
    {
        label: 'That\'s All!',
        description:
            'That’s all for this tutorial. Have fun coding in Patch!',
        tab: EditorTab.CODE,
        image: 0
    },
];


//images for each step
const associatedImage = (currStep: number) => {
    switch (currStep) {
        case 0:
            return (<img src={require("../../assets/PatchPenguin.png")} style={{ height: 150 }} />);
        case 1:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F1.gif?alt=media"} style={{ maxHeight: 150 }} />);
        case 2:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F2.gif?alt=media"} style={{ maxHeight: 150 }} />);
        case 3:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F3.gif?alt=media"} style={{ maxHeight: 125 }} />);
        case 4:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F4.gif?alt=media"} style={{ maxHeight: 125 }} />);
        case 5:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F5.gif?alt=media"} style={{ maxHeight: 125 }} />);
        case 6:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F6.gif?alt=media"} style={{ maxHeight: 150, maxWidth: 400 }} />);
        case 7:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F7(1).gif?alt=media"} style={{ maxHeight: 150, maxWidth: 400 }} />);
        case 8:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F8.gif?alt=media"} style={{ maxHeight: 125, maxWidth: 400 }} />);
        case 9:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F9.gif?alt=media"} style={{ maxHeight: 150, maxWidth: 400 }} />);
        case 10:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F10.gif?alt=media"} style={{ maxHeight: 150, maxWidth: 400 }} />);
        case 11:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F11.gif?alt=media"} style={{ maxHeight: 125, maxWidth: 400 }} />);
        case 12:
            return (<img src={"https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F12.gif?alt=media"} style={{ maxHeight: 150, maxWidth: 400 }} />);
        case 13:
            return (<img src={require("../../assets/PatchPenguin.png")} style={{ height: 150 }} />);


    }
}


//main function
export function Tutorial() {

    const [selfGuided, setSelfGuided] = React.useState(false);
    const [handHold, setHandHold] = React.useState(false);
    const [open, setOpen] = React.useState(true);
    const [activeStep, setActiveStep] = React.useState(0);
    const userRef = useUser().userReference;
    const userData = useUser().userMeta;
    const [show, setShow] = React.useState(true);

    const theme = useTheme();
    const [minimize, setMinimize] = React.useState(false);

    //Template for self guided tour
    function SelfGuidedTutorial() {
        const maxSteps = steps.length;

        return (
            show ?
                <Draggable>
                    <Box sx={{
                        height: minimize ? 30 : 200, position: "absolute", border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "5px", mb: "0", ml: "100px", bottom: minimize ? 15 : 150, width: minimize ? 400 : "auto"
                    }}>
                        <Paper
                            square
                            elevation={0}
                            sx={{
                                display: 'flex-row',
                                alignItems: 'center',
                                height: 30,
                                bgcolor: 'background.default',
                                pt: 2
                            }}
                        >
                            <Typography variant="h5" sx={{ float: 'left', pl: 2 }}>{steps[activeStep].label}</Typography>
                            <div style={{ float: 'right' }}>
                                {minimize ? <AddIcon fontSize="medium" sx={{ pr: 2 }} onClick={() => setMinimize(false)} /> : <><RemoveIcon fontSize="medium" sx={{ pr: 2 }} onClick={() => setMinimize(true)} /></>}
                                <CancelIcon fontSize="medium" sx={{ pr: 2 }} onClick={() => { setSelfGuided(false); handleSkip(); }} />
                            </div>
                        </Paper>
                        {minimize ? <></> :
                            <><Box sx={{
                                p: 2,
                                bgcolor: 'panel.dark',
                                color: 'white',
                                height: "auto",
                                maxWidth: 400
                            }}>
                                <Typography>{steps[activeStep].description}</Typography>
                                {associatedImage(activeStep)}
                            </Box><MobileStepper
                                    variant="text"
                                    steps={maxSteps}
                                    position="static"
                                    activeStep={activeStep}
                                    nextButton={<Button
                                        size="small"
                                        onClick={() => handleNextSelf(maxSteps)}
                                        disabled={activeStep === maxSteps}
                                    >
                                        {activeStep === maxSteps - 1 ? "Finish" : "Next"}
                                        {theme.direction === 'rtl' ? (
                                            <KeyboardArrowLeft />
                                        ) : (
                                            <KeyboardArrowRight />
                                        )}
                                    </Button>}
                                    backButton={<Button size="small" onClick={handleBackSelf} disabled={activeStep === 0}>
                                        {theme.direction === 'rtl' ? (
                                            <KeyboardArrowRight />
                                        ) : (
                                            <KeyboardArrowLeft />
                                        )}
                                        Back
                                    </Button>} /></>}
                    </Box></Draggable> : <></>
        );
    }

    //template for guided tour
    function HandHoldTutorial() {
        const setEditorTab = usePatchStore((state) => state.setEditorTab);
        useEffect(() => {
            setEditorTab(stepsHandHold[activeStep].tab);
        }, [activeStep]);
        return (show ? <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            onClick={() => { }}>
            <Box
                sx={{
                    width: stepsHandHold[activeStep].width,
                    height: stepsHandHold[activeStep].height,
                    borderRadius: 1,
                    bgcolor: "#FFFF00",
                    opacity: 0.25,
                    position: "absolute",
                    top: stepsHandHold[activeStep].y,
                    left: stepsHandHold[activeStep].x
                }}
            />

            <div style={{ backgroundColor: "black", maxWidth: 400, position: 'absolute', top: "60%", left: "5%" }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {stepsHandHold[activeStep].label}
                    </Typography>
                    <Typography variant="body2">
                        {stepsHandHold[activeStep].description}
                    </Typography>
                    {associatedImage(stepsHandHold[activeStep].image)}
                </CardContent>
                <CardActions>
                    <Button sx={{ margin: "auto" }} size="medium" onClick={() => handleNextSelf(stepsHandHold.length)}>{activeStep == stepsHandHold.length - 1 ? "Finish" : "Next"}</Button>
                </CardActions></div>
        </Backdrop> : <></>);

    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        color: "white",
        bgcolor: 'black',
        display: "flex-col",
        alignProperty: "center",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "5px",
        padding: "5px",

    };

    const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

    // const ModalContent = styled('div')(
    //     ({ theme }) => css`
    //         text-align: start;
    //         position: relative;
    //         display: flex;
    //         flex-direction: column;
    //         gap: 8px;
    //         overflow: hidden;
    //         padding: 24px;
    //     `,
    // );


    const handleNextSelf = async (maxSteps: number) => {
        if (activeStep == maxSteps - 1) {
            setShow(false);
            if (userRef != null) {
                updateDoc(userRef, {
                    newUser: false
                });
            }

        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBackSelf = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        setOpen(false);
        if (userRef != null) {
            updateDoc(userRef, {
                newUser: false
            });
        }
    }


    //main return
    return (<><Modal
        open={(userData == null || userData.newUser) && open}
        onClose={() => { setOpen(false) }}
        slots={{ backdrop: StyledBackdrop }}
    >
        <div>
            <Box sx={style}>
                <Typography sx={{ textAlign: "center" }}>Welcome to Patch! How would you like to learn?</Typography>
                <Button sx={{ width: "100%" }} onClick={() => { setOpen(false); setSelfGuided(true); }}>Try self guided tour</Button>
                <Button sx={{ width: "100%" }} onClick={() => { setOpen(false); setHandHold(true); }}>Walk me thorugh it</Button>
                <Button sx={{ width: "100%" }} onClick={handleSkip}>Skip</Button>
            </Box>
        </div>
    </Modal>
        {selfGuided ? <SelfGuidedTutorial /> : <></>}
        {handHold ? <HandHoldTutorial /> : <></>}
    </>);
}
