import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import DOMElementRenderer from '../util/dom-element-renderer';

const PyatchStage = () => {
    const { pyatchStage } = useContext(pyatchContext);
    return (
        <DOMElementRenderer
            domElement={pyatchStage.canvas}
            style={{
                height: stageDimensions.height,
                width: stageDimensions.width
            }}
        />
    );
}

export default PyatchStage