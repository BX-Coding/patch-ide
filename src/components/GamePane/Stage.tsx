import React, { useEffect, useState, useRef } from 'react';
import DOMElementRenderer from '../../util/dom-element-renderer';
import { getEventXY } from '../../util/touch-utils';
import { PatchQuestion } from './PatchQuestion';
import { Box } from '@mui/material';
import usePatchStore from '../../store';

const Stage = () => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const patchStage = usePatchStore((state) => state.patchStage);
    const questionAsked = usePatchStore((state) => state.questionAsked);

    const [rect, setRect] = useState<null | DOMRect>(null);
    const boundingRef = useRef<null | HTMLDivElement>(null);
    const updateRect = () => {
        if (boundingRef.current) {
            setRect(boundingRef.current.getBoundingClientRect());
        }
    }

    const onMouseMove = (e: MouseEvent) => {
        if (!rect) return;

        const {x, y} = getEventXY(e);
        const mousePosition = [x - rect.left, y - rect.top];
        const coordinates = {
            x: mousePosition[0],
            y: mousePosition[1],
            canvasWidth: rect.width,
            canvasHeight: rect.height
        };
        patchVM.postIOData('mouse', coordinates);
    }
    const onMouseUp = (e: MouseEvent) => {
        if (!rect) return;

        const {x, y} = getEventXY(e);
        const data = {
            isDown: false,
            x: x - rect.left,
            y: y - rect.top,
            canvasWidth: rect.width,
            canvasHeight: rect.height,
        };
        patchVM.postIOData('mouse', data);
    }
    const onMouseDown = (e: MouseEvent) => {
        if (!rect) return;
        const {x, y} = getEventXY(e);
        const mousePosition = [x - rect.left, y - rect.top];
        const data = {
            isDown: true,
            x: mousePosition[0],
            y: mousePosition[1],
            canvasWidth: rect.width,
            canvasHeight: rect.height
        };
        patchVM.postIOData('mouse', data);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!rect) return;
        if (e.target !== document && e.target !== document.body) return;

        const key = (!e.key || e.key === 'Dead') ? e.keyCode : e.key;
        patchVM.postIOData('keyboard', {
            key: key,
            isDown: true
        });

        if (e.keyCode === 32 || // 32=space
            (e.keyCode >= 37 && e.keyCode <= 40)) { // 37, 38, 39, 40 are arrows
            e.preventDefault();
        }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
        if (!rect) return;
        const key = (!e.key || e.key === 'Dead') ? e.keyCode : e.key;
        patchVM.postIOData('keyboard', {
            key: key,
            isDown: false
        });

        // E.g., prevent scroll.
        if (e.target !== document && e.target !== document.body) {
            e.preventDefault();
        }
    }

    const attachMouseEvents = () => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousedown', onMouseDown);
    }

    const attachKeyboardEvents = () => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    useEffect(() => {
        if (!rect) {
            updateRect();
        }
        else if (patchStage.canvas) {
            attachMouseEvents();
            attachKeyboardEvents();
        }
    }, [patchStage.canvas, rect])

    return (
    <div>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'absolute', 
            zIndex: 1, 
            width: 600, 
            height: patchStage.height,
        }}>
            { questionAsked !== null && <PatchQuestion/>}
        </Box>
        <div ref={boundingRef} style={{position: 'relative'}}>
            {!!patchStage.canvas && <DOMElementRenderer
                // @ts-ignore
                domElement={patchStage.canvas}
            />}
        </div>
    </div>
    );
}

export default Stage