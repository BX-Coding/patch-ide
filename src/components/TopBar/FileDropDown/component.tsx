import { usePatchSerialization } from "../../../hooks/usePatchSerialization";
import { useProjectActions } from "../../../hooks/useProjectActions";
import usePatchStore from "../../../store";
import { useLocalStorage } from "usehooks-ts";
import { DropdownMenu } from "../../DropdownMenu";
import React from "react";
import { useAssetFileSelector } from "../../../hooks/useAssetFileSelector";

type FielDropDownProps = {
    cloudEnabled: boolean,
}

export const FileDropDown = ({ cloudEnabled }: FielDropDownProps) => {
    const saveAllThreads = usePatchStore((state) => state.saveAllThreads);
    const projectName = usePatchStore((state) => state.projectName);
    const { downloadProject, convertScratch3ToPatch } = usePatchSerialization();
    const { loadLocalProject } = useProjectActions();
    const [_, setProjectId ] = useLocalStorage("patchProjectId", "new");
    const { saveProject } = useProjectActions();
    const openFileInputSelector = useAssetFileSelector(['.ptch1, .sb3']);

    const handleSaveNow = async () => {
        await saveAllThreads();
        if (cloudEnabled) {
        saveProject(projectName);
        }
    };

    const handleSaveCopy = async () => {
        await saveAllThreads();
        if (cloudEnabled) {
        saveProject(projectName);
        }
    }

    const handleNew = () => {
        setProjectId("new");
        location.reload();
    }
    const handleDownload = async () => {
        await downloadProject();
    };

    const handleUpload = async () => {
        const file = await openFileInputSelector();
        if (!file) return;
        let projectBuffer = await file.arrayBuffer();
        if (file.name.endsWith(".sb3")) {
            projectBuffer = await convertScratch3ToPatch(projectBuffer);
        }
        loadLocalProject(projectBuffer);
    }

    const authenticatedOptions = [
        { label: "New", onClick: handleNew},
        { label: "Save Now", onClick: handleSaveNow},
        { label: "Save As A Copy", onClick: handleSaveCopy},
        { label: "Load From Your Computer", onClick: handleUpload},
        { label: "Save To Your Computer", onClick: handleDownload},
    ]

    const unathenticatedOptions = [
        { label: "New", onClick: handleNew},
        { label: "Load From Your Computer", onClick: handleUpload},
        { label: "Save To Your Computer", onClick: handleDownload},
    ]


    return (
        <DropdownMenu 
            type="text"
            text="File"
            sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }}
            options={cloudEnabled ? authenticatedOptions : unathenticatedOptions}
        />
    );
}
