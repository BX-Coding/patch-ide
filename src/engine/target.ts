import EventEmitter from "events"
import Costume from "./costume";
import { Sprite, Stage } from "../leopard";
import { Sound, Thread } from "../components/EditorPane/types";

export default class Target extends EventEmitter {
    direction: number = 0;
    size: number = 0;
    y: number = 0;
    x: number = 0;
    id?: string;
    name?: string;
    isStage: boolean = false;
    currentCostume: number = 0;
    costumes: Costume[] = [];
    threads?: { [key: string]: Thread };

    stage?: Stage;
    sprite?: Sprite;

    getThread?: (id: string) => Thread;
    addThread?: (id: string, trigger: string, script: string) => Promise<string>;
    isSprite?: () => boolean;
    
    getCurrentCostume?: () => Costume;
    getCostumeIndexByName?: (name: string) => number;
    setCostume?: (costumeIndex: number) => void;
    deleteCostume?: (costumeIndex: number) => void;
    getCostumes?: () => Costume[];

    deleteSound?: (soundIndex: number) => void;
    getSounds?: () => Sound[];

    constructor() {
        super();
    }
}