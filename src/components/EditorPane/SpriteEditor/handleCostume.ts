import { Costume } from '../types';
import { handleFileUpload, costumeUpload } from '../../../util/file-uploader.js';
import { patchVM } from '../../provider/PatchProvider.jsx';

const handleNewCostume = async (costume: Costume | Costume[], fromCostumeLibrary: boolean, targetId: string) => {
    const costumes = Array.isArray(costume) ? costume : [costume];

    var returnval = await Promise.all(costumes.map(c => {
      if (fromCostumeLibrary) {
        return patchVM.addCostume(c.md5ext, c, targetId);
      } else {

        return patchVM.addCostume(c.md5, c, targetId);
      }
    }));

    return returnval;
}

export const handleUploadCostume = (targetId?: string) => {
    //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/svg+xml, image/bmp, image/gif';

    input.onchange = e => {
      handleFileUpload(e.target, (buffer: ArrayBuffer, fileType: string, fileName: string , fileIndex: number, fileCount: number) => {
        costumeUpload(buffer, fileType, patchVM.runtime.storage, async (vmCostumes: Costume[]) => {
          vmCostumes.forEach((costume, i) => {
            costume.name = `${fileName}${i ? i + 1 : ''}`;
          });

          if (targetId == undefined || targetId == null) {
            handleNewCostume(vmCostumes, false, patchVM.editingTarget.id);
          } else {
            handleNewCostume(vmCostumes, false, targetId);
          }

          // await handleNewCostume if you want to do anything here
        }, console.log);
      }, console.log);
    }

    input.click();
  };

  export const handleAddCostumesToEditingTarget = (costumes: Costume[], fromCostumeLibrary: boolean) => {
    handleNewCostume(costumes, fromCostumeLibrary, patchVM.editingTarget.id);
  }