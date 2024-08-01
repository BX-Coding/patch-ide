import { Sprite, Stage } from "../../vm/src";
import { Dictionary } from "./interfaces";
import Thread from "./thread";

export type BlockFunctionType = (thread: Thread, args: any) => any;

const effectNames = [
    "color",
    "fisheye",
    "whirl",
    "pixelate",
    "mosaic",
    "brightness",
    "ghost",
  ] as const;

const BlockFunctions: Dictionary<BlockFunctionType> = {
    motion_movesteps: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.move(args.STEPS);
        }
    },
    core_endthread: (thread) => {
        thread.endThread();
    },
    
    motion_gotoxy: (thread, args) => {
        thread.target instanceof Sprite && thread.target.goto(args.X, args.Y);
    },
    // motion_goto: (thread, args) => {
    //     thread.target instanceof Sprite && thread.target.goTo(args.name);
    // },
    motion_turnright: (thread, args) => {
        thread.target instanceof Sprite && (thread.target.direction += args.DEGREES);
    },
    motion_turnleft: (thread, args) => {
        thread.target instanceof Sprite && (thread.target.direction -= args.DEGREES);
    },
    motion_pointindirection: (thread, args) => {
        thread.target instanceof Sprite && (thread.target.direction = args.DIRECTION);
    },
    // motion_pointtowards: (thread, args) => {
    //     thread.target instanceof Sprite && thread.target.pointTowards(args.NAME);
    // },
    motion_glidesecstoxy: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.glide(args.SECS, args.X, args.Y)
        }
    },
    // motion_glideto: (thread, args) => {
    //     thread.target instanceof Sprite && thread.target.glide(args.SECONDS, args.NAME);
    // },
    motion_ifonedgebounce: (thread) => {
        thread.target instanceof Sprite && thread.target.ifOnEdgeBounce();
    },
    // motion_setrotationstyle: (thread, args) => {
    //     thread.target instanceof Sprite && thread.target.rotationStyle(args.STYLE);
    // },
    motion_changexby: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.x += args.DX as number;
        } 
    },
    motion_setx: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.x = args.X;
        } 
    },
    motion_changeyby: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.y += args.DY as number;
        } 
    },
    motion_sety: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.y = args.Y;
        } 
    },
    motion_xposition: (thread) => {
        if(thread.target instanceof Sprite){
            return thread.target.x
        } 
    },
    motion_yposition: (thread) => {
        if(thread.target instanceof Sprite){
            return thread.target.y
        } 
    },
    motion_direction: (thread) => {
        if(thread.target instanceof Sprite){
            return thread.target.direction
        } 
    },
    looks_say: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.say(args.MESSAGE);
        }
    },
    looks_sayforsecs: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.sayAndWait(args.MESSAGE, args.SECS);
        }
    },
    looks_think: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.think(args.MESSAGE);
        }
    },
    looks_thinkforsecs: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.thinkAndWait(args.MESSAGE, args.SECS);
        }
    },
    looks_show: (thread) => {
        if(thread.target instanceof Sprite){
            thread.target.visible = true
        }
    },
    looks_hide: (thread) => {
        if(thread.target instanceof Sprite){
            thread.target.visible = false
        }
    },
    looks_switchcostumeto: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.costume = args.NAME;
        }
    },
    looks_switchbackdropto: (thread, args) => {
        thread.target instanceof Stage && (thread.target.costume = args.NAME);
    },
    // looks_switchbackdroptoandwait: (thread, args) => {
    //     thread.target instanceof Stage && thread.target.setBackdropToAndWait(args.name);
    // },
    looks_nextcostume: (thread) => {
        thread.target instanceof Sprite && (thread.target.costume = "next costume");
    },
    looks_nextbackdrop: (thread) => {
        thread.target instanceof Stage && (thread.target.costume = "next costume");
    },
    looks_changeeffectby: (thread, args) => {
        thread.target instanceof Sprite && (thread.target.effects[effectNames[effectNames.indexOf(args.EFFECT)]] += (args.CHANGE as number));
    },
    // looks_seteffectto: (thread, args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.effects.setGraphicEffectTo(args.EFFECT, args.VALUE);
    //     } 
    // },
    looks_cleargraphiceffects: (thread) => {
        if(thread.target instanceof Sprite){
            thread.target.effects.clear();
        } 
    },
    looks_changesizeby: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.size += args.CHANGE;
        }
    },
    looks_setsizeto: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.size = args.SIZE;
        } 
    },
    // looks_gotofrontback: (thread, args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.setLayerTo(args.LAYER);
    //     } 
    // },
    // looks_goforwardbackwardlayers: (thread, args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.changeLayerBy(args.DIRECTION, args.CHANGE);
    //     } 
    // },
    // looks_size: (thread) => {
    //     if(thread.target instanceof Sprite){
    //         return thread.target.getSize()
    //     } 
    // },
    looks_costumenumbername: (thread, args) => {
        if(thread.target instanceof Sprite){
            return thread.target.costume;
        } 
    },
    looks_backdropnumbername: (thread, args) => {
        return thread.target instanceof Stage && thread.target.costumeNumber;
    },
    sound_play: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.playSoundUntilDone(args.soundName);
        } 
    },
    sound_playuntildone: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.playSoundUntilDone(args.soundName);
        } 
    },
    sound_stopallsounds: (thread) => {
        thread.target.stopAllSounds();
    },
    sound_seteffectto: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.addSound(args.EFFECT)
        } 
    },
    // sound_changeeffectby: (thread, args) => {
    //     thread.target instanceof Sprite && thread.target.changeSoundEffectBy(args.EFFECT, args.CHANGE);
    // },
    sound_cleareffects: (thread) => {
        if(thread.target instanceof Sprite){
            thread.target.audioEffects.clear()
        } 
    },
    sound_setvolumeto: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.audioEffects.volume = args.VOLUME
        } 
    },
    sound_changevolumeby: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.audioEffects.volume += args.CHANGE
        } 
    },
    sound_volume: (thread) => {
        return thread.target.audioEffects.volume;
    },
    event_broadcast: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.broadcast(args.MESSAGE);
        } 
    },
    event_broadcastandwait: (thread, args) => {
        if(thread.target instanceof Sprite){
            return thread.target.broadcastAndWait(args.NAME);
        } 
    },
    sensing_touchingobject: (thread, args) => {
        if(thread.target instanceof Sprite){
            return thread.target.touching(args.NAME);
        }
    },
    sensing_touchingcolor: (thread, args) => {
        if(thread.target instanceof Sprite){
            return thread.target.touching(args.COLOR);
        }
    },
    sensing_coloristouchingcolor: (thread, args) => {
        if(thread.target instanceof Sprite){
            return thread.target.colorTouching(args.COLOR1, args.COLOR2);
        }
    },
    // sensing_distanceto: (thread, args) => {
    //     // return thread.target.distanceTo(args.NAME);
    //     if(thread.target instanceof Sprite){
    //         return thread.target.distance
    //     }
    // },
    sensing_timer: (thread) => {
        return thread.target.timer;
    },
    sensing_resettimer: (thread) => {
        thread.target.restartTimer();
    },
    // sensing_of: (thread, args) => {
    //     return thread.target.getAttributeOf(args.OBJECT, args.PROPERTY);
    // },
    sensing_mousex: (thread) => {
        return thread.target.mouse.x
    },
    sensing_mousey: (thread) => {
        return thread.target.mouse.y;
    },
    sensing_mousedown: (thread) => {
        return thread.target.mouse.down;
    },
    sensing_keypressed: (thread, args) => {
        return thread.target.keyPressed(args.KEY);
    },
    // sensing_current: (thread, args) => {
    //     return thread.target.current(args.timeIncrement);
    // },
    // sensing_dayssince2000: (thread) => {
    //     return thread.target.daysSince2000();
    // },
    sensing_loudness: (thread) => {
        return thread.target.loudness;
    },
    // sensing_username: (thread) => {
    //     return thread.target.getUsername();
    // },
    sensing_askandwait: (thread, args) => {
        return thread.target.askAndWait(args.QUESTION);
    },

    // control_wait: (thread, args) => {
    //     thread.wait(args.SECS);
    // },
    control_stop: (thread, args) => {
        thread.stopThread()
    },
    control_create_clone_of: (thread, args) => {
        if(thread.target instanceof Sprite){
            thread.target.createClone()
        }
    },
    control_delete_this_clone: (thread) => {
        if(thread.target instanceof Sprite){
            thread.target.deleteThisClone();
        }
    },
    pen_clear: (thread) => {
         thread.target.clearPen();
    },
    pen_stamp: (thread) => {
        if( thread.target instanceof Sprite ){
            thread.target instanceof Sprite && thread.target.stamp();
        }
    },
    pen_pendown: (thread) => {
        if( thread.target instanceof Sprite ){
            thread.target.penDown = true
        }
    },
    pen_penup: (thread) => {
        if( thread.target instanceof Sprite ){
            thread.target.penDown = false
        }
    },
    pen_setpencolortocolor: (thread, args) => {
        if( thread.target instanceof Sprite ){
            thread.target.penColor = args.COLOR
        }
    },
    // pen_changepencolorparamby: (thread, args) => {
    //     thread.target instanceof Sprite && thread.target.changePenEffect(args.EFFECT, args.CHANGE);
    // },
    // pen_setpencolorparamto: (thread, args) => {
    //     thread.target instanceof Sprite && thread.target.setPenEffect(args.EFFECT, args.VALUE);
    // },
    pen_changepensizeby: (thread, args) => {
        if( thread.target instanceof Sprite ){
            thread.target.penSize += args.SIZE;
        }
    },
    pen_setpensizeto: (thread, args) => {
       if( thread.target instanceof Sprite ){
        thread.target.penSize == args.SIZE;
       }
    },

    // core_fetch: (thread, args) => {
    //     thread.target.fetch(args.url, args.method, args.headers, args.body);
    // }
};

export default BlockFunctions