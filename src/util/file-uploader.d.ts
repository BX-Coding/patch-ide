declare module 'scratch-file-uploader' {
    import { ScratchStorage } from 'scratch-storage';
  
    type AssetType = ScratchStorage.AssetType;
  
    interface VMAsset {
      name: string | null;
      dataFormat: string;
      asset: ScratchStorage.Asset;
      md5: string;
      assetId: string;
    }
  
    function handleFileUpload(
      fileInput: EventTarget | null,
      onload: (
        fileData: ArrayBuffer | string,
        fileType: string,
        fileName: string,
        index: number,
        total: number
      ) => void,
      onerror: (event: ProgressEvent<FileReader>) => void
    ): void;
  
    function costumeUpload(
      fileData: ArrayBuffer | string,
      fileType: string,
      storage: ScratchStorage,
      handleCostume: (vmCostumes: any[]) => void,
      handleError?: (error: string) => void
    ): void;
  
    function soundUpload(
      fileData: ArrayBuffer | string,
      fileType: string,
      storage: ScratchStorage,
      handleSound: (vmSound: VMAsset) => void,
      handleError?: (error: string) => void
    ): void;
  
    function spriteUpload(
      fileData: ArrayBuffer,
      fileType: string,
      spriteName: string,
      storage: ScratchStorage,
      handleSprite: (spriteJson: string | Uint8Array) => void,
      handleError?: (error: string) => void
    ): void;
  }