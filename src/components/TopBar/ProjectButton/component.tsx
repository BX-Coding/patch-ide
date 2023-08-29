import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../lib/firebase";
import React from "react";
import { User } from "firebase/auth";
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useUser } from "../../../hooks/useUser";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { TextButton } from "../../PatchButton";

type ProjectGridProps = {
    onSelect: (projectId: string) => void
}

const ProjectGrid = ({ onSelect } : ProjectGridProps) => {
    const {userMeta, loading: userLoading, error: userError} = useUser();
    const projectId = useReadLocalStorage("patchProjectId");

    let untitledIndex = 0;
    if (userLoading) return <div>Loading...</div>;
    if (userError) return <div>{userError.message}</div>;

    return <Grid container spacing={2}>
        {userMeta?.projects.map(project => <Grid item xs={3} key={project.id}>
            <TextButton sx={{ height: "100px", width: "100%", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} variant={projectId === project.id ? "contained" : "outlined"} onClick={() => onSelect(project.id)} text={project.name || `Untitled${++untitledIndex}`} />
        </Grid>)}
    </Grid>
}

export const ProjectButton = () => {
    const [open, setOpen] = React.useState(false);
    const [_, setProjectId ] = useLocalStorage("patchProjectId", "new");


    const handleClose = () => {
        setOpen(false);
    }

    const onSelect = (projectId: string) => {
        setProjectId(projectId);
        location.reload();
    }

    const handleClick = () => {
        setOpen(true);
    }

    return (<>
        <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} variant="contained" onClick={handleClick} text="Projects" />
        <Dialog 
            open={open} 
            onClose={handleClose}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle sx={{
                backgroundColor: 'panel.dark',
                borderStyle: "solid", 
                borderWidth: "1px", 
                borderColor: "outlinedButtonBorder.main",
                borderRadius: "8px",
                borderBottomLeftRadius: "0px",
                borderBottomRightRadius: "0px",
                borderBottomStyle: "none",
            }}>Project Select</DialogTitle>
            <DialogContent sx={{
                backgroundColor: 'panel.dark',
                borderStyle: "solid", 
                borderWidth: "1px", 
                borderColor: "outlinedButtonBorder.main",
                borderRadius: "8px",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                borderTopStyle: "none",
            }}>
               <ProjectGrid onSelect={onSelect} />
            </DialogContent>
        </Dialog>
    </>);
}