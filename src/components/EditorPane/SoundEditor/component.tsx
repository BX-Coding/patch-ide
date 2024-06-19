import { Box, Grid, Menu, MenuItem } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  AddButton,
  DeleteButton,
  HorizontalButtons,
  IconButton,
} from "../../PatchButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ItemCard } from "../../ItemCard";
import usePatchStore, { ModalSelectorType } from "../../../store";
import { useSoundHandlers } from "../../../hooks/useSoundUploadHandlers";
import { useAudioPlayback } from "./useAudioPlayback";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useEditingTarget } from "../../../hooks/useEditingTarget";
import { Target } from "../types";
import { DropdownMenu } from "../../DropdownMenu";
import AddIcon from "@mui/icons-material/Add";

export function SoundEditor() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <SoundInspector />
      </Grid>
    </Grid>
  );
}

function AddSoundButton() {
  const showModalSelector = usePatchStore((state) => state.showModalSelector);
  const { handleUploadSound } = useSoundHandlers();

  const [editingTarget] = useEditingTarget() as [
    Target,
    (target: Target) => void
  ];

  const handleBuiltIn = () => {
    showModalSelector(ModalSelectorType.SOUND);
  };

  const handleFromUpload = () => {
    handleUploadSound(editingTarget.id);
  };

  return (
    <DropdownMenu
      type="icon"
      icon={<AddIcon />}
      options={[
        { label: "From Built-In", onClick: handleBuiltIn },
        { label: "From Upload", onClick: handleFromUpload },
      ]}
    />
  );
}

type SoundDetailsProps = {
  width: string;
  height: string;
};

function SoundDetails({ width, height }: SoundDetailsProps) {
  return (
    <Grid
      container
      direction="row"
      spacing={2}
      sx={{
        width: width,
        height: height,
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          maxWidth: width,
          maxHeight: height,
        }}
      >
        <img
          src={"https://cdn-icons-png.flaticon.com/512/3601/3601680.png"}
          width={"auto"}
          height={"100%"}
        />
      </Grid>
    </Grid>
  );
}

function SoundInspector() {
  const patchVM = usePatchStore((state) => state.patchVM);
  const selectedSoundIndex = usePatchStore((state) => state.selectedSoundIndex);
  const setSelectedSoundIndex = usePatchStore(
    (state) => state.setSelectedSoundIndex
  );
  const sounds = usePatchStore((state) => state.sounds);
  const setSounds = usePatchStore((state) => state.setSounds);
  const playByteArray = useAudioPlayback();

  const [editingTarget, setEditingTarget] = useEditingTarget() as [
    Target,
    (target: Target) => void
  ];

  const handleClick = (index: number, soundName: string) => () => {
    setSelectedSoundIndex(index);
  };

  useEffect(() => {
    setSelectedSoundIndex(0);
    setSounds(editingTarget.getSounds());
  }, [editingTarget, patchVM]);

  const handleDeleteClick = () => {
    editingTarget.deleteSound(selectedSoundIndex);
    let newSounds = editingTarget.getSounds();
    setSelectedSoundIndex(Math.max(0, selectedSoundIndex - 1));
    setSounds([...newSounds]);
  };

  const handlePlayClick = () => {
    const sound = sounds[selectedSoundIndex];

    if (sound?.asset?.data) {
      playByteArray(sound.asset.data);
    }
  };

  return (
    <Grid
      container
      direction="column"
      className="assetHolder"
      sx={{
        backgroundColor: "panel.main",
        minHeight: "calc(100% + 40px)",
        marginBottom: "0px",
      }}
    >
      <Grid item xs>
        <HorizontalButtons
          sx={{
            marginLeft: "4px",
            marginTop: "4px",
          }}
        >
          <AddSoundButton />
          <DeleteButton
            red={true}
            variant={"contained"}
            onClick={handleDeleteClick}
            onClickArgs={[]}
            disabled={sounds.length < 1}
          />
          <IconButton
            icon={<PlayArrowIcon />}
            disabled={
              sounds.length < 1 || sounds[selectedSoundIndex]?.rate === 22050
            }
            onClick={handlePlayClick}
          />
        </HorizontalButtons>
      </Grid>
      <Grid item xs>
        <SoundDetails width={"100%"} height={"calc(100vh - 460px)"} />
      </Grid>
      <Grid
        item
        xs
        sx={{
          borderTopWidth: "1px",
          borderTopStyle: "solid",
          borderTopColor: "divider",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            height: "280px",
            position: "relative",
            bottom: 0,
          }}
        >
          <Grid
            container
            direction="row"
            spacing={1}
            sx={{
              margin: "0px",
              backgroundColor: "panel.main",
              padding: "4px",
              width: "100%",
              minHeight: "100%",
            }}
          >
            {sounds.map((sound, i) => (
              <Grid item key={i}>
                <ItemCard
                  title={sound.name}
                  selected={i === selectedSoundIndex}
                  onClick={handleClick(i, sound.name)}
                  key={sound.name}
                  width={120}
                  height={120}
                >
                  <VolumeUpIcon />
                </ItemCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
