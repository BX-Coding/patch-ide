import { doc, updateDoc, addDoc, getDoc, collection } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'
import { useEffect, useState } from 'react';
import { usePatchSerialization } from './usePatchSerialization';
import usePatchStore from '../store';
import defaultPatchProject from '../assets/default-project.json';
import { useLocalStorage } from 'usehooks-ts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { PatchProject } from '../components/EditorPane/types';
import { RuntimeState } from '../engine/runtime';


export const useProjectActions = (defaultProjectId?: string) => {
    const projectReference = usePatchStore(state => state.projectReference);
    const setProjectReference = usePatchStore(state => state.setProjectReference);
    const isNewProject = usePatchStore(state => state.isNewProject);
    const setNewProject = usePatchStore(state => state.setNewProject);
    const setProjectName = usePatchStore((state) => state.setProjectName);
    const projectName = usePatchStore((state) => state.projectName);
    const [user, loading, error] = useAuthState(auth);
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectSaving, setProjectSaving] = useState(false);

    const [ _, setProjectId ] = useLocalStorage("patchProjectId", "new");
    
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
        let loadFailed = false;
        if (projectSnapshot.exists()) {
            console.warn("Project exists. Loading.");
            setNewProject(false);
            try {
                setProjectName(projectSnapshot.data().name);
                await loadSerializedProject(projectSnapshot.data() as RuntimeState);
            } catch (error) {
                console.error("Failed to load project: ", error);
                loadFailed = true;
            }
        } 
        if (!projectSnapshot.exists() || loadFailed) {
            console.warn("Project does not exist. Creating default project.");
            setNewProject(true);
            // TODO: debug this when new project is loaded.
            const vmStateJson = defaultPatchProject as RuntimeState;
            await loadSerializedProject(vmStateJson);
        }

        setProjectLoading(false);
    }

    const loadLocalProject = async (projectBuffer: ArrayBuffer) => {
        setProjectLoading(true);
        await loadSerializedProject(projectBuffer);
        setProjectLoading(false);
    }

    const addProjectMeta = (uid: string, name: string, vmState: RuntimeState) => {
        const projectObject = vmState as PatchProject;
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
            if (isNewProject && projectId != "new") {
                userMeta.projects.push({ name: projectName || "Untitled", id: projectId });
            } else {
                userMeta.projects.forEach(function(project: { id: string; name: string; }) {
                    if (project.id == projectId) {
                        project.name = projectName;
                    }
                });
            }
            console.log(userMeta.projects)
            await updateDoc(userMetaReference, userMeta);
        } else {
            console.warn("User meta does not exist. Exiting.");
        }
    }

    const createNewProject = async (uid: string, projectObject: PatchProject) => {
        console.warn("Creating new project.");
        const docRef = await addDoc(collection(db, "projects"), projectObject);
        setProjectReference(docRef);
        setProjectId(docRef.id);

        updateUserMeta(uid, docRef.id, projectObject.name)
    }

    const updateProject = async (projectObject: PatchProject) => {
        const projectReference = getProjectReference();
        if (!projectReference) {
            console.warn("Project reference was null. Aborting.");
            return;
        }
        await updateDoc(projectReference, projectObject);
    }

    const saveProjectAssets = () => {
        /*console.warn("Saving project assets.");
        
        const storage = patchVM.runtime.storage;
        const assets: Asset[] = patchVM.assets;
        const storePromise = assets.filter(asset => !asset.clean).map(async (asset) => {
            const response = await storage.store(asset.assetType, asset.dataFormat, asset.data, asset.assetId)
            console.warn("Saving asset: ", asset);
            
            if (response?.id) {
                console.warn("Asset stored: ", asset);
            } else {
                console.warn("Asset failed to store: ", asset);
                return Promise.reject();
            }
        });
        return Promise.all(storePromise);*/

        // TODO: implement this

        return;
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
        
        const projectObject = addProjectMeta(user.uid, name, patchVM.runtime.serialize());
        
        console.warn("Saving project: ", projectObject);
        if (isNewProject) {
            createNewProject(user.uid, projectObject);
        } else {
            updateProject(projectObject);
        }
        saveProjectAssets();
        setNewProject(false);
        setProjectSaving(false);
        let id: string= projectReference?.id ?? "";
        updateUserMeta(user.uid, id, projectName)

        // TODO: implement this
    }

    const saveProject = saveCloudProject;
    const loadProject = loadCloudProject;

    return {loadProject, projectLoading: projectLoading ?? false, saveProject, projectSaving, loadLocalProject}
}