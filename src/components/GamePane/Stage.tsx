import React from 'react';
import DOMElementRenderer from '../../util/dom-element-renderer';
import { PatchQuestion } from './PatchQuestion';
import { Box } from '@mui/material';
import usePatchStore from '../../store';

const Stage = () => {
    const patchStage = usePatchStore((state) => state.patchStage);
    const questionAsked = usePatchStore((state) => state.questionAsked);

    return (
    <>
        {!!patchStage.canvas && <DOMElementRenderer
            // @ts-ignore
            domElement={patchStage.canvas}
        />}
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'absolute', 
            zIndex: 1, 
        }}>
            { questionAsked !== null && <PatchQuestion/>}
        </Box>
    </>
    );
}

export default Stage