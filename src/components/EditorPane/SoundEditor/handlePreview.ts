import usePatchStore from "../../../store";
import { initAudioContext } from "../../../store/soundEditorStore";

export const playByteArray = (byteArray: number[]) => {
    const context = usePatchStore(state => state.context);
    const setContext = usePatchStore(state => state.setContext);
    if (!context) {
        const newAudioContext = initAudioContext();
        if (!newAudioContext) {
            console.warn("Your browser does not support any AudioContext and cannot play back this audio.");
            return;
        }
        setContext(newAudioContext);
    }

    var arrayBuffer = new ArrayBuffer(byteArray.length);
    var bufferView = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteArray.length; i++) {
        bufferView[i] = byteArray[i];
    }

    context?.decodeAudioData(arrayBuffer, function (buffer) {
        play(context, buffer);
    });
}

// Play the loaded file
const play = (context: AudioContext, buffer: AudioBuffer) => {
    // Create a source node from the buffer
    var source = context.createBufferSource();
    source.buffer = buffer;
    // Connect to the final output node (the speakers)
    source.connect(context.destination);
    // Play immediately
    source.start(0);
}