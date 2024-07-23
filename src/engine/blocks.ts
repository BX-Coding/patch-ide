import { Sprite, Stage } from "leopard";
import { Dictionary } from "./interfaces";

export type BlockFunctionType = (target: Sprite | Stage, ...args: any[]) => any;

const BlockFunctions: Dictionary<BlockFunctionType> = {
    motion_movesteps: (target, STEPS: number) => {
        target instanceof Sprite && target.move(STEPS);
    }
}

export default BlockFunctions