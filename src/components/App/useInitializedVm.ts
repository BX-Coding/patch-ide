import { useEffect } from 'react';
// @ts-ignore
import defaultPatchProject from '../../assets/defaultProject.ptch1';
import { loadSerializedProject, hasLocalStorageProject, loadFromLocalStorage } from '../../util/patch-serialization';
// @ts-ignore
import VirtualMachine from 'pyatch-vm';
// @ts-ignore
import Renderer from 'scratch-render';
// @ts-ignore
import AudioEngine from 'scratch-audio';
// @ts-ignore
import ScratchSVGRenderer from 'scratch-svg-renderer';
import makeTestStorage from "../../util/make-test-storage";
import usePatchStore from '../../store';


const useInitializedVm = () => {
    const setPatchReady = usePatchStore(state => state.setPatchReady);
    const patchStage = usePatchStore(state => state.patchStage);
    const setPatchVM = usePatchStore(state => state.setPatchVM);
    const setQuestionAsked = usePatchStore(state => state.setQuestionAsked);
    const setVmLoaded = usePatchStore(state => state.setVmLoaded);

    const initializePatchProject = async () => {
        if (hasLocalStorageProject()) {
            await loadFromLocalStorage();
        } else {
            await loadSerializedProject(defaultPatchProject);
        }
    }
    useEffect(() => {
        function asyncEffect() {
          setPatchReady(false);
    
          const scratchRenderer = new Renderer(patchStage.canvas);
    
          const patchVM = new VirtualMachine();
          patchVM.attachStorage(makeTestStorage());
          patchVM.attachRenderer(scratchRenderer);
          patchVM.attachAudioEngine(new AudioEngine());
          patchVM.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());
          
          patchVM.runtime.draw();
          patchVM.start();
    
          initializePatchProject();
    
          patchVM.on("VM READY", () => {
            setVmLoaded(true);
          });
    
          patchVM.runtime.on("QUESTION", onQuestionAsked);
          setPatchVM(patchVM);

        }
        asyncEffect();
    
      }, []);
    
      // -------- Global Functions --------
    
    const onQuestionAsked = (question: string | null) => {
        setQuestionAsked(question);
    }
}

export default useInitializedVm;