import { Autocomplete, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Target, Thread } from "../../types";
import { useEditingTarget } from "../../../../hooks/useEditingTarget";
import usePatchStore from "../../../../store";
import { useEventList } from "./useEventList";

type TriggerEventSelectorProps = {
  thread: Thread;
};

export const TriggerEventSelector = ({ thread }: TriggerEventSelectorProps) => {
  const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
  const codeThreadId = usePatchStore((state) => state.codeThreadId);

  const [triggerEvent, setTriggerEvent] = useState(thread.triggerEvent);
  const [triggerEventOption, setTriggerEventOption] = useState(
    thread.triggerEventOption
  );
  const [editingTarget] = useEditingTarget() as [
    Target,
    (target: Target) => void
  ];

  // Forces updates displayed trigger event when switching between threads
  useEffect(() => {
    setTriggerEvent(thread.triggerEvent);
  }, [codeThreadId]);

  const handleEventChange = (
    _: React.ChangeEvent<{}>,
    newValue: { id: string }
  ) => {
    thread.updateThreadTriggerEvent(newValue.id);
    // This Sprite Clicked has an implicit option of "this sprite"
    if (newValue.id === "event_whenthisspriteclicked") {
      thread.updateThreadTriggerEventOption(editingTarget.id);
    } else {
      thread.updateThreadTriggerEventOption("");
    }
    setTriggerEvent(newValue.id);
    setProjectChanged(true);
  };

  const handleEventOptionChange = (
    _: React.ChangeEvent<{}>,
    newValue: { id: string }
  ) => {
    thread.updateThreadTriggerEventOption(newValue.id);
    setTriggerEventOption(newValue.id);
    setProjectChanged(true);
  };

  const handleEventOptionBroadcastChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    thread.updateThreadTriggerEventOption(event.target.value);
    setProjectChanged(true);
  };

  const [eventList, eventOptionsList] = useEventList(thread);
  const triggerEventLabel = eventList.find(
    (event) => event.id === triggerEvent
  );

  return (
    <>
      <Grid item xs>
        <Autocomplete
          disablePortal
          disableClearable
          id="event-thread-selection"
          options={eventList}
          defaultValue={triggerEventLabel}
          value={triggerEventLabel}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={handleEventChange}
          size="small"
          fullWidth
          sx={{ backgroundColor: "panel.main" }}
          componentsProps={{
            paper: {
              sx: {
                width: 400,
              },
            },
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Grid>
      <Grid item>
        {eventOptionsList && eventOptionsList.length > 0 && (
          <Autocomplete
            disablePortal
            disableClearable
            id="event-thread-option-selection"
            options={eventOptionsList}
            defaultValue={{
              id: thread.triggerEventOption,
              label: thread.triggerEventOption,
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleEventOptionChange}
            size="small"
            fullWidth
            sx={{ backgroundColor: "panel.main" }}
            renderInput={(params) => <TextField {...params} />}
          />
        )}
      </Grid>
      <Grid item>
        {thread.triggerEvent === "event_whenbroadcastreceived" && (
          <TextField
            id="event-thread-broadcost-option-text-input"
            onChange={handleEventOptionBroadcastChange}
            defaultValue={thread.triggerEventOption}
            variant="outlined"
            size="small"
          />
        )}
      </Grid>
    </>
  );
};
