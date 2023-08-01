import { handleFileUpload, soundUpload } from 'scratch-file-uploader';
import usePatchStore from '../../../store';
import { Sound, SoundJson } from '../types';

export const handleUploadSound = (targetId: string) => {
    const patchVM = usePatchStore(state => state.patchVM);
    //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
    var input = document.createElement('input');
    input.type = 'file';
    // TODO: change this to audio file types instead of image types
    input.accept = 'audio/*';

    const result = new Promise<void>((resolve, reject) => {
        input.onchange = e => {
          handleFileUpload(e.target, (buffer, fileType, fileName, fileIndex, fileCount) => {
            soundUpload(buffer, fileType, patchVM.runtime.storage, async vmSound => {
              if (targetId == undefined || targetId == null) {
                await patchVM.addSound({...vmSound, name: fileName });
              } else {
                await patchVM.addSound({...vmSound, name: fileName }, targetId);
              }

              resolve();
            }, console.log);
          }, console.log);
        }

        input.onabort = () => {
          resolve();
        }
      }
    );

    input.click();

    return result;
  };

  export const handleAddSoundToEditingTarget = (sound: Sound | SoundJson, fromLibrary: boolean) => {
    const patchVM = usePatchStore(state => state.patchVM);
    const result = new Promise<void>((resolve, reject) => {
      patchVM.addSound(fromLibrary ? {...sound, md5: sound.md5ext} : sound).then(() => resolve());
    });

    return result;
  }