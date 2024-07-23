import { Sprite, Stage } from "leopard";
import { Dictionary } from "./interfaces";
import Thread from "./thread";

export type BlockFunctionType = (thread: Thread, ...args: any[]) => any;

const BlockFunctions: Dictionary<BlockFunctionType> = {
    motion_movesteps: (thread, ...args) => {
        thread.target instanceof Sprite && thread.target.move(args[0].STEPS);
    },
    core_endthread: (thread) => {
        thread.endThread();
    }
}

export default BlockFunctions