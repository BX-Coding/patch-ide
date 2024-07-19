import usePatchStore from "../store";
import { costumeUpload, handleFileUpload } from "../lib/file-uploader";
import { useEditingTarget } from "./useEditingTarget";
import { Costume } from "leopard";

export const useCostumeHandlers = () => {
    const patchVM = usePatchStore(state => state.patchVM);
    const addCostume = usePatchStore(state => state.addCostume);
    const [editingTarget, setEditingTarget] = useEditingTarget();

    const handleNewCostume = async (costume: Costume | Costume[], fromCostumeLibrary: boolean, targetId: string) => {
        const costumes = Array.isArray(costume) ? costume : [costume];
    
        var returnval = await Promise.all(costumes.map(c => {
            // TODO: fix this?
            //return addCostume(fromCostumeLibrary ? c.md5ext : c.md5 ?? '', c, targetId);
            return addCostume(c.id ?? '', c, targetId);
        }));
    
        return returnval;
    }

    const handleUploadCostume = (targetId?: string) => {
        if (!editingTarget) {
            return;
        }
        //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg, image/svg+xml, image/bmp, image/gif';

        input.onchange = (e: any) => {
            handleFileUpload(e.target, (buffer: ArrayBuffer, fileType: string, fileName: string , fileIndex: number, fileCount: number) => {
                costumeUpload(buffer, fileType, async (vmCostumes: Costume[]) => {
                    vmCostumes.forEach((costume, i) => {
                        costume.name = `${fileName}${i ? i + 1 : ''}`;
                    });

                    if (targetId == undefined || targetId == null) {
                        handleNewCostume(vmCostumes, false, editingTarget.id);
                    } else {
                        handleNewCostume(vmCostumes, false, targetId);
                    }

                    // await handleNewCostume if you want to do anything here
                }, console.log);
            }, console.log);
        }

        input.click();
    };

    const handleAddCostumesToEditingTarget = (costumes: Costume[], fromCostumeLibrary: boolean) => {
        if (!editingTarget) {
            return;
        }
        handleNewCostume(costumes, fromCostumeLibrary, editingTarget.id);
    }

    return {
        handleUploadCostume,
        handleAddCostumesToEditingTarget,
    }
}