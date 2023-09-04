import { useRef } from "react";
import { useFilePicker } from "use-file-picker";

export const useAssetFileSelector = (extensions: string[]) => {
    const selectorResolveRef = useRef<(value: File | PromiseLike<File>) => void>();
    const selectorRejectRef = useRef<(reason?: any) => void>();
    const [openFileSelector] = useFilePicker({
        accept: extensions.join(", "),
        multiple: false,
        readFilesContent: false,
        onFilesSelected: ({ plainFiles }) => {
            const file = plainFiles[0];
            selectorResolveRef.current?.(file);
        },
        onFilesRejected: (data) => {
            selectorRejectRef.current?.(data);
        }
    });
    const openAssetFileSelector = (): Promise<File> => {
        const filesSelectedPromise = new Promise<File>((resolve, reject) => {
            selectorResolveRef.current = resolve;
            selectorRejectRef.current = reject;
        });
        openFileSelector();
        return filesSelectedPromise;
    }

    return openAssetFileSelector;
}
