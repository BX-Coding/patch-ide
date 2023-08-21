import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../components/Firebase'
import { useEffect, useState } from 'react';
import { usePatchSerialization } from './usePatchSerialization';
import { VmState } from '../components/EditorPane/types';
import usePatchStore from '../store';


export const useProjectActions = (project: string): [() => void, boolean, () => void, boolean] => {
    const projectReference = doc(db, 'projects', project);
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectSaving, setProjectSaving] = useState(false);

    const { loadSerializedProject } = usePatchSerialization();
    const patchVM = usePatchStore(state => state.patchVM);
    
    const loadCloudProject = async () => {
        setProjectLoading(true);
        const projectSnapshot = await getDoc(projectReference);
        if (projectSnapshot.exists()) {
            loadSerializedProject(projectSnapshot.data() as VmState);
        } else {
            console.warn("Project does not exist. Aborting.");
        }
        setProjectLoading(false);
    }

    const saveCloudProject = async () => {
        if (!patchVM) {
            console.warn("The patchVM was null. Aborting.");
            return;
        }
        if (!projectReference) {
            console.warn("The projectReference was null. Aborting.");
            return;
        }

        setProjectSaving(true);
        
        const projectObject = await patchVM.serializeProject();
        updateDoc(projectReference, projectObject).then(() => {setProjectSaving(false)});
    }

    const loadLocalProject = () => {
        loadSerializedProject(project);
    }

    const saveProject = saveCloudProject;
    const loadProject = loadCloudProject;

    return [loadProject, projectLoading ?? false, saveProject, projectSaving]
}