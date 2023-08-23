import { doc, updateDoc, addDoc, getDoc, collection } from 'firebase/firestore';
import { auth, db } from '../components/Firebase'
import { useEffect, useState } from 'react';
import { usePatchSerialization } from './usePatchSerialization';
import { VmState } from '../components/EditorPane/types';
import usePatchStore from '../store';
import { useAuthState } from 'react-firebase-hooks/auth';
// @ts-ignore
import defaultPatchProject from '../assets/defaultProject.ptch1';
import { useLocalStorage } from 'usehooks-ts';


export const useProjectActions = (project: string): [() => void, boolean, (uid: string, createNewProject: boolean) => void, boolean] => {
    const projectReference = doc(db, 'projects', project);
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectSaving, setProjectSaving] = useState(false);
    const [isNewProject, setNewProject] = useState<boolean>(true);
    const [ _, setProjectId ] = useLocalStorage("patchProjectId", "N3JXaHgGXm4IpOMqAAk4");

    const { loadSerializedProject } = usePatchSerialization();
    const patchVM = usePatchStore(state => state.patchVM);
    
    const loadCloudProject = async () => {
        setProjectLoading(true);
        const projectSnapshot = await getDoc(projectReference);
        if (projectSnapshot.exists()) {
            console.warn("Project exists. Loading.");
            setNewProject(false);
            await loadSerializedProject(projectSnapshot.data() as VmState, true);
        } else {
            console.warn("Project does not exist. Creating default project.");
            await loadSerializedProject(defaultPatchProject, false);
        }
        setProjectLoading(false);
    }

    const saveCloudProject = async (uid: string, createNewProject: boolean) => {
        if (!patchVM) {
            console.warn("The patchVM was null. Aborting.");
            return;
        }

        setProjectSaving(true);
        
        const projectObject = await patchVM.serializeProject();
        projectObject.lastEdited = new Date();
        projectObject.owner = uid;
        console.warn("Saving project: ", projectObject);
        if (isNewProject || createNewProject) {
            console.warn("Creating new project.");
            const docRef = await addDoc(collection(db, "projects"), projectObject);
            setProjectId(docRef.id);
            setNewProject(true);
        } else {
            await updateDoc(projectReference, projectObject);
        }
        setProjectSaving(false);
    }

    const loadLocalProject = () => {
        loadSerializedProject(project, false);
    }

    const saveProject = saveCloudProject;
    const loadProject = loadCloudProject;

    return [loadProject, projectLoading ?? false, saveProject, projectSaving]
}