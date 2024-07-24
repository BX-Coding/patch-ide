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
    },
    
    motion_gotoxy: (thread, ...args) => {
        thread.target instanceof Sprite && thread.target.goto(args[0].x, args[0].y);
    },
    // motion_goto: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.goTo(args[0].name);
    // },
    // motion_turnright: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.turnRight(args[0].degrees);
    // },
    // motion_turnleft: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.turnLeft(args[0].degrees);
    // },
    // motion_pointindirection: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.pointInDirection(args[0].degrees);
    // },
    // motion_pointtowards: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.pointTowards(args[0].name);
    // },
    motion_glidesecstoxy: (thread, ...args) => {
        thread.target instanceof Sprite && thread.target.glide(args[0].seconds, args[0].x, args[0].y);
    },
    // motion_glideto: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.glide(args[0].seconds, args[0].name);
    // },
    motion_ifonedgebounce: (thread) => {
        thread.target instanceof Sprite && thread.target.ifOnEdgeBounce();
    },
    // motion_setrotationstyle: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.rotationStyle(args[0].style);
    // },
    motion_changexby: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.x += args[0].x;
        } 
    },
    motion_setx: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.x = args[0].x;
        } 
    },
    motion_changeyby: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.y += args[0].y;
        } 
    },
    motion_sety: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.y = args[0].y;
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
    looks_say: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.say(args[0].message);
        }
    },
    looks_sayforsecs: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.sayAndWait(args[0].message, args[0].secs);
        }
    },
    looks_think: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.think(args[0].message);
        }
    },
    looks_thinkforsecs: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.thinkAndWait(args[0].message, args[0].secs);
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
    // looks_switchcostumeto: (thread, ...args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.setCostumeTo(args[0].name);
    //     }
    // },
    // looks_switchbackdropto: (thread, ...args) => {
    //     thread.target instanceof Stage && thread.target.setBackdropTo(args[0].name);
    // },
    // looks_switchbackdroptoandwait: (thread, ...args) => {
    //     thread.target instanceof Stage && thread.target.setBackdropToAndWait(args[0].name);
    // },
    // looks_nextcostume: (thread) => {
    //     thread.target instanceof Sprite && thread.target.nextCostume();
    // },
    // looks_nextbackdrop: (thread) => {
    //     thread.target instanceof Stage && thread.target.nextBackdrop();
    // },
    // looks_changeeffectby: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.changeGraphicEffectBy(args[0].effect, args[0].change);
    // },
    // looks_seteffectto: (thread, ...args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.effects.setGraphicEffectTo(args[0].effect, args[0].value);
    //     } 
    // },
    looks_cleargraphiceffects: (thread) => {
        if(thread.target instanceof Sprite){
            thread.target.effects.clear();
        } 
    },
    // looks_changesizeby: (thread, ...args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.changeSizeBy(args[0].change);
    //     } 
    // },
    // looks_setsizeto: (thread, ...args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.setSizeTo(args[0].size);
    //     } 
    // },
    // looks_gotofrontback: (thread, ...args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.setLayerTo(args[0].layer);
    //     } 
    // },
    // looks_goforwardbackwardlayers: (thread, ...args) => {
    //     if(thread.target instanceof Sprite){
    //         thread.target.changeLayerBy(args[0].direction, args[0].change);
    //     } 
    // },
    // looks_size: (thread) => {
    //     if(thread.target instanceof Sprite){
    //         return thread.target.getSize()
    //     } 
    // },
    looks_costumenumbername: (thread,...args) => {
        if(thread.target instanceof Sprite){
            return thread.target.costume;
        } 
    },
    // looks_backdropnumbername: (thread) => {
    //     return thread.target instanceof Stage && thread.target.();
    // },
    sound_play: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.playSoundUntilDone(args[0].soundName);
        } 
    },
    sound_playuntildone: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.playSoundUntilDone(args[0].soundName);
        } 
    },
    sound_stopallsounds: (thread) => {
        thread.target.stopAllSounds();
    },
    sound_seteffectto: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.addSound(args[0].effect)
        } 
    },
    // sound_changeeffectby: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.changeSoundEffectBy(args[0].effect, args[0].change);
    // },
    sound_cleareffects: (thread) => {
        if(thread.target instanceof Sprite){
            thread.target.audioEffects.clear()
        } 
    },
    sound_setvolumeto: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.audioEffects.volume = args[0].volume
        } 
    },
    sound_changevolumeby: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.audioEffects.volume += args[0].change
        } 
    },
    sound_volume: (thread) => {
        return thread.target.audioEffects.volume;
    },
    event_broadcast: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            thread.target.broadcast(args[0].message);
        } 
    },
    event_broadcastandwait: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            return thread.target.broadcastAndWait(args[0].name);
        } 
    },
    sensing_touchingobject: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            return thread.target.touching(args[0].name);
        }
    },
    sensing_touchingcolor: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            return thread.target.touching(args[0].color);
        }
    },
    sensing_coloristouchingcolor: (thread, ...args) => {
        if(thread.target instanceof Sprite){
            return thread.target.colorTouching(args[0].color1, args[0].color2);
        }
    },
    // sensing_distanceto: (thread, ...args) => {
    //     // return thread.target.distanceTo(args[0].name);
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
    // sensing_of: (thread, ...args) => {
    //     return thread.target.getAttributeOf(args[0].object, args[0].property);
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
    sensing_keypressed: (thread, ...args) => {
        return thread.target.keyPressed(args[0].key);
    },
    // sensing_current: (thread, ...args) => {
    //     return thread.target.current(args[0].timeIncrement);
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
    sensing_askandwait: (thread, ...args) => {
        return thread.target.askAndWait(args[0].question);
    },

    // control_wait: (thread, ...args) => {
    //     thread.wait(args[0].seconds);
    // },
    control_stop: (thread, ...args) => {
        thread.stopThread()
    },
    control_create_clone_of: (thread, ...args) => {
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
    pen_setpencolortocolor: (thread, ...args) => {
        if( thread.target instanceof Sprite ){
            thread.target.penColor = args[0].color
        }
    },
    // pen_changepencolorparamby: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.changePenEffect(args[0].effect, args[0].change);
    // },
    // pen_setpencolorparamto: (thread, ...args) => {
    //     thread.target instanceof Sprite && thread.target.setPenEffect(args[0].effect, args[0].value);
    // },
    pen_changepensizeby: (thread, ...args) => {
        if( thread.target instanceof Sprite ){
            thread.target.penSize += args[0].size;
        }
    },
    pen_setpensizeto: (thread, ...args) => {
       if( thread.target instanceof Sprite ){
        thread.target.penSize == args[0].size;
       }
    },

    // core_fetch: (thread, ...args) => {
    //     thread.target.fetch(args[0].url, args[0].method, args[0].headers, args[0].body);
    // }
};

export default BlockFunctions