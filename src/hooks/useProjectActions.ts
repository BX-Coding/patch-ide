import { doc, updateDoc, addDoc, getDoc, collection } from 'firebase/firestore';
import { auth, db } from '../components/Firebase'
import { useEffect, useState } from 'react';
import { usePatchSerialization } from './usePatchSerialization';
import { Project, VmState } from '../components/EditorPane/types';
import usePatchStore from '../store';
import { useAuthState } from 'react-firebase-hooks/auth';
// @ts-ignore
import defaultPatchProject from '../assets/defaultProject.ptch1';
import { useLocalStorage } from 'usehooks-ts';


export const useProjectActions = (project: string): [() => void, boolean, (uid: string, name: string, createNewProject: boolean) => void, boolean] => {
    const projectReference = doc(db, 'projects', project);
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectSaving, setProjectSaving] = useState(false);
    const isNewProject = usePatchStore(state => state.isNewProject);
    const setNewProject = usePatchStore(state => state.setNewProject);
    const [ _, setProjectId ] = useLocalStorage("patchProjectId", "");
    
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
            setNewProject(true);
            await loadSerializedProject(defaultPatchProject, false);
        }
        setProjectLoading(false);
    }

    const addProjectMeta = (uid: string, name: string, vmState: VmState) => {
        const projectObject = vmState as Project;
        projectObject.lastEdited = new Date();
        projectObject.owner = uid;
        projectObject.name = name;
        return projectObject;
    }

    const updateUserMeta = async (uid: string, projectId: string, projectName: string) => {
        const userMetaReference = doc(db, 'users', uid);
        const userMetaSnapshot = await getDoc(userMetaReference);
        if (userMetaSnapshot.exists()) {
            console.warn("User meta exists. Updating.");
            const userMeta = userMetaSnapshot.data();
            userMeta.projects.push({ name: projectName, id: projectId });
            await updateDoc(userMetaReference, userMeta);
        } else {
            console.warn("User meta does not exist. Exiting.");
        }
    }

    const createNewProject = async (uid: string, projectObject: Project) => {
        console.warn("Creating new project.");
        const docRef = await addDoc(collection(db, "projects"), projectObject);
        setProjectId(docRef.id);

        updateUserMeta(uid, docRef.id, projectObject.name)
    }

    const saveCloudProject = async (uid: string, name: string, newProject: boolean) => {
        if (!patchVM) {
            console.warn("The patchVM was null. Aborting.");
            return;
        }

        setProjectSaving(true);
        
        const projectObject = addProjectMeta(uid, name, await patchVM.serializeProject());
        
        console.warn("Saving project: ", projectObject);
        if (newProject) {
            createNewProject(uid, projectObject);
        } else {
            await updateDoc(projectReference, projectObject);
        }
        setNewProject(false);
        setProjectSaving(false);
    }

    const loadLocalProject = () => {
        loadSerializedProject(project, false);
    }

    const saveProject = saveCloudProject;
    const loadProject = loadCloudProject;

    return [loadProject, projectLoading ?? false, saveProject, projectSaving]
}