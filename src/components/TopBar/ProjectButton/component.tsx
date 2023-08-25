import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase";
import React from "react";
import { User } from "firebase/auth";
import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useUser } from "../../../hooks/useUser";
import { useLocalStorage } from "usehooks-ts";
import { TextButton } from "../../PatchButton";

type ProjectGridProps = {
    onSelect: (projectId: string) => void
}

const ProjectGrid = ({ onSelect } : ProjectGridProps) => {
    const {userMeta, loading: userLoading, error: userError} = useUser();
    if (userLoading) return <div>Loading...</div>;
    if (userError) return <div>{userError.message}</div>;

    return <Grid container spacing={2}>
        {userMeta?.projects.map(project => <Grid item xs={12} key={project.id}>
            <button onClick={() => onSelect(project.id)}>{project.name}</button>
        </Grid>)}
    </Grid>
}

export const ProjectButton = () => {
    const [open, setOpen] = React.useState(false);
    const [_, setProjectId ] = useLocalStorage("patchProjectId", "N3JXaHgGXm4IpOMqAAk4");


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
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Project Select</DialogTitle>
            <DialogContent>
               <ProjectGrid onSelect={onSelect} />
            </DialogContent>
        </Dialog>
    </>);
}