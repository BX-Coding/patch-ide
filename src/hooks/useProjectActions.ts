import { doc, updateDoc, addDoc, getDoc, collection } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'
import { useEffect, useState } from 'react';
import { usePatchSerialization } from './usePatchSerialization';
import { Project, VmState } from '../components/EditorPane/types';
import usePatchStore from '../store';
// @ts-ignore
import defaultPatchProject from '../assets/defaultProject.ptch1';
import { useLocalStorage } from 'usehooks-ts';
import { useAuthState } from 'react-firebase-hooks/auth';


export const useProjectActions = (defaultProjectId?: string) => {
    const projectReference = usePatchStore(state => state.projectReference);
    const setProjectReference = usePatchStore(state => state.setProjectReference);
    const isNewProject = usePatchStore(state => state.isNewProject);
    const setNewProject = usePatchStore(state => state.setNewProject);
    const [user, loading, error] = useAuthState(auth);
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectSaving, setProjectSaving] = useState(false);

    const [ _, setProjectId ] = useLocalStorage("patchProjectId", "");
    
    const { loadSerializedProject } = usePatchSerialization();
    const patchVM = usePatchStore(state => state.patchVM);

    const getProjectReference = () => {
        if (projectReference) {
            return projectReference;
        }
        if (defaultProjectId) {
            const newProjectReference = doc(db, 'projects', defaultProjectId);
            setProjectReference(newProjectReference);
            return newProjectReference;
        }
    }
    
    const loadCloudProject = async () => {
        setProjectLoading(true);
        const projectReference = getProjectReference();
        if (!projectReference) {
            console.warn("Project reference was null. Aborting.");
            return;
        }
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
        setProjectReference(docRef);
        setProjectId(docRef.id);

        updateUserMeta(uid, docRef.id, projectObject.name)
    }

    const updateProject = async (projectObject: Project) => {
        const projectReference = getProjectReference();
        if (!projectReference) {
            console.warn("Project reference was null. Aborting.");
            return;
        }
        await updateDoc(projectReference, projectObject);
    }

    const saveCloudProject = async (name: string) => {
        if (!patchVM) {
            console.warn("The patchVM was null. Aborting.");
            return;
        }
        if (!user) {
            console.warn("The user was null. Aborting.");
            return;
        }

        setProjectSaving(true);
        
        const projectObject = addProjectMeta(user.uid, name, await patchVM.serializeProject());
        
        console.warn("Saving project: ", projectObject);
        if (isNewProject) {
            createNewProject(user.uid, projectObject);
        } else {
            updateProject(projectObject);
        }
        setNewProject(false);
        setProjectSaving(false);
    }

    const saveProject = saveCloudProject;
    const loadProject = loadCloudProject;

    return {loadProject, projectLoading: projectLoading ?? false, saveProject, projectSaving}
}