import React, { useContext, useEffect, useState } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import DOMElementRenderer from '../util/dom-element-renderer.jsx';
import { getEventXY } from '../util/touch-utils.js';

const PyatchStage = () => {
    const { pyatchStage, pyatchVM } = useContext(pyatchContext);
    const [rect, setRect] = useState(null);
    const updateRect = () => {
        setRect(pyatchStage.canvas.getBoundingClientRect());
    }

    const onMouseMove = (e) => {
        // TODO: Stop mystery function calling this with rect rect.width && height === 0
        if (rect && rect.width > 0) {
            const {x, y} = getEventXY(e);
            const mousePosition = [x - rect.left, y - rect.top];
            const coordinates = {
                x: mousePosition[0],
                y: mousePosition[1],
                canvasWidth: rect.width,
                canvasHeight: rect.height
            };
            // console.log(coordinates);
            pyatchVM.postIOData('mouse', coordinates);
        }
    }
    const onMouseUp = (e) => {
        if (rect && rect.width > 0) {
            const {x, y} = getEventXY(e);
            const data = {
                isDown: false,
                x: x - rect.left,
                y: y - rect.top,
                canvasWidth: rect.width,
                canvasHeight: rect.height,
            };
            // console.log(data);
            pyatchVM.postIOData('mouse', data);
        }
    }
    const onMouseDown = (e) => {
        if (rect && rect.width > 0) {
            updateRect();
            const {x, y} = getEventXY(e);
            const mousePosition = [x - rect.left, y - rect.top];
            const data = {
                isDown: true,
                x: mousePosition[0],
                y: mousePosition[1],
                canvasWidth: rect.width,
                canvasHeight: rect.height
            };
            console.log(data);
            pyatchVM.postIOData('mouse', data);
        }
    }

    const handleKeyDown = (e) => {
        if (rect && rect.width > 0) {
            // Don't capture keys intended for Blockly inputs.
            if (e.target !== document && e.target !== document.body) return;

            const key = (!e.key || e.key === 'Dead') ? e.keyCode : e.key;
            pyatchVM.postIOData('keyboard', {
                key: key,
                isDown: true
            });

            // Prevent space/arrow key from scrolling the page.
            if (e.keyCode === 32 || // 32=space
                (e.keyCode >= 37 && e.keyCode <= 40)) { // 37, 38, 39, 40 are arrows
                e.preventDefault();
            }
        }
    }

    const handleKeyUp = (e) => {
        if (rect && rect.width > 0) {
            // Always capture up events,
            // even those that have switched to other targets.
            const key = (!e.key || e.key === 'Dead') ? e.keyCode : e.key;
            pyatchVM.postIOData('keyboard', {
                key: key,
                isDown: false
            });

            // E.g., prevent scroll.
            if (e.target !== document && e.target !== document.body) {
                e.preventDefault();
            }
        }
    }

    const attachMouseEvents = (canvas) => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousedown', onMouseDown);
    }

    const attachKeyboardEvents = () => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    useEffect(() => {
        if (pyatchStage.canvas) {
            console.log("attaching");
            attachMouseEvents(pyatchStage.canvas);
            attachKeyboardEvents();
            updateRect();
        }
    }, [pyatchStage.canvas])

    return (
        !!pyatchStage.canvas && <DOMElementRenderer
            domElement={pyatchStage.canvas}
            style={{
                height: pyatchStage.height,
                width: pyatchStage.width
            }}
        />
    );
}

export default PyatchStage