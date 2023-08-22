import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../components/Firebase'
import { useEffect, useState } from 'react';
import { usePatchSerialization } from './usePatchSerialization';
import { VmState } from '../components/EditorPane/types';
import usePatchStore from '../store';
import { useAuthState } from 'react-firebase-hooks/auth';


export const useProjectActions = (project: string): [() => void, boolean, (uid: string) => void, boolean] => {
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

    const saveCloudProject = async (uid: string) => {
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
        projectObject.lastEdited = new Date();
        projectObject.owner = uid;
        console.warn("Saving project: ", projectObject);
        updateDoc(projectReference, projectObject).then(() => {setProjectSaving(false)});
    }

    const loadLocalProject = () => {
        loadSerializedProject(project);
    }

    const saveProject = saveCloudProject;
    const loadProject = loadCloudProject;

    return [loadProject, projectLoading ?? false, saveProject, projectSaving]
}