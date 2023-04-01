import React, { useContext } from 'react';
import pyatchContext from './pyatchContext';
import DOMElementRenderer from '../util/dom-element-renderer';

const PyatchGameScreen = () => {
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

export default PyatchGameScreen