import React from 'react';

import { Grid } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import { Target, Thread } from '../../types';
import usePatchStore from '../../../../store';
import { HorizontalButtons, DeleteButton, IconButton } from '../../../PatchButton';
import { useEditingTarget } from '../../../../hooks/useEditingTarget';
import { TriggerEventSelector } from './TriggerEventSelector';
import { useRuntimeDiagnostics } from '../../../../hooks/useRuntimeDiagnostics';


type ThreadEditorProps = {
    thread: Thread,
    deletable: boolean,
}


export const ThreadBar = ({ thread, deletable }: ThreadEditorProps) => {
  

    return (
        <Grid container direction="row" spacing={"1px"} mb={"4px"}>
            <TriggerEventSelector thread={thread} />
            <Grid item sx={{ width: deletable ? 266 : 200, padding: 0 }}>
                <HorizontalButtons spacing={"2px"} sx={{maxHeight: 40}}>
                    <FormatButton thread={thread}/>
                    <SaveThreadButton thread={thread}/>
                    {deletable && <DeleteThreadButton thread={thread} />}
                    <AddThreadButton />
                </HorizontalButtons>
            </Grid>
        </Grid>
    );
}

const FormatButton = ({ thread }: { thread: Thread }) => {
    const updateThread = usePatchStore((state) => state.updateThread);
    const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
    const { invalidateDiagnostics } = useRuntimeDiagnostics(
        thread.id
      );
    
      const transport = usePatchStore((state) => state.transportRef);
      const handleFormat = () => {
          const formatRequest = {
            internalID: 1,
            request: {
              jsonrpc: "2.0" as const,
              id: 1,
              method: "textDocument/formatting",
              params: {
                textDocument: {
                  uri: "file:///index.js",
                },
                options: {
                  tabSize: 4,
                  insertSpaces: true,
                },
              },
            }
          };
        if (transport) {
          transport.sendData(formatRequest)
          .then((event) => {
            if (event != null) {
              const response = JSON.parse(JSON.stringify(event[0]));
              handleCodeChange(response.newText);
            }
          });
        }
      }
    
      const handleCodeChange = (newScript: string) => {
        updateThread(thread.id, newScript);
        setProjectChanged(true);
        invalidateDiagnostics(thread.id);
      };
    
    return <IconButton onClick={handleFormat} icon={<FormatIndentIncreaseIcon />} sx={{ height: 40 }} />
}

const AddThreadButton = () => {
    const addThread = usePatchStore((state) => state.addThread);
    const [editingTarget] = useEditingTarget() as [Target, (target: Target) => void];

    const handleAdd = () => {
        addThread(editingTarget);
    }
    return <IconButton onClick={handleAdd} icon={<PostAddIcon />} sx={{ height: 40 }} />
}

const DeleteThreadButton = ({ thread }: { thread: Thread }) => {
    const deleteThread = usePatchStore((state) => state.deleteThread);
    
    const handleDelete = () => {
        deleteThread(thread.id);
    }
    return <DeleteButton onClick={handleDelete} sx={{height: 40}} />
}

const SaveThreadButton = ({ thread }: { thread: Thread }) => {
    const saveThread = usePatchStore((state) => state.saveThread);
    const threadSaved = usePatchStore((state) => state.threads[thread.id].saved);

    const handleSave = () => {
        saveThread(thread.id);
    }
    return <IconButton color="success" onClick={handleSave} disabled={threadSaved} sx={{ height: 40 }} icon={<SaveIcon />} />
}