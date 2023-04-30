import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import DOMElementRenderer from '../util/dom-element-renderer.jsx';

const PyatchStage = () => {
    const { pyatchStage } = useContext(pyatchContext);
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