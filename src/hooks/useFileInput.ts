const useFileInput = (onChange: (e: React.ChangeEvent<HTMLInputElement>) => void | Promise<any>, onAbort: (e: UIEvent) => void) => {
    const openFileInput = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';

        const result = new Promise<void>((resolve, reject) => {
            // @ts-ignore
            input.onchange = onChange.then(resolve);
            input.onabort = (e: UIEvent) => {
                onAbort(e);
                resolve();
            };
        });
    
        input.click();
        return result;
    };
    return openFileInput;
}