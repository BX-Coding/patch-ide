import React, { useContext, useState, useEffect, useCallback } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { sprites } from "../../assets/sprites";
import { sounds } from "../../assets/sounds";
import { backdrops } from "../../assets/backdrops";
import { Typography, Box, Grid } from "@mui/material";
import { HorizontalButtons, IconButton } from "../PatchButton";
import usePatchStore, { ModalSelectorType } from "../../store";
import { useAddSprite } from "../SpritePane/onAddSpriteHandler";
import { useSoundHandlers } from "../../hooks/useSoundUploadHandlers";
import { ItemCard } from "../ItemCard";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useCostumeHandlers } from "../../hooks/useCostumeUploadHandlers";
import { getPatchAssetImageUrl } from "../../lib/patch-asset-image-fetch";
import { createVMAsset } from "../../lib/file-uploader";
import { Costume } from "leopard";
import patchAssetStorage from "../../engine/storage/storage";
import { CostumeJson, loadFromAssetJson, SoundJson, SpriteJson } from "../EditorPane/types";

export const ModalSelector = () => {
  const modalSelectorType = usePatchStore((state) => state.modalSelectorType);
  const modalSelectorOpen = usePatchStore((state) => state.modalSelectorOpen);
  const hideModalSelector = usePatchStore((state) => state.hideModalSelector);
  const { handleAddSoundToEditingTarget } = useSoundHandlers();
  const { handleAddCostumesToEditingTarget } = useCostumeHandlers();
  const { onAddSprite } = useAddSprite();

  const onClick = (asset: CostumeJson | SpriteJson | SoundJson) => {
    if (modalSelectorType === ModalSelectorType.SPRITE) {
      const sprite = asset as SpriteJson;
      onAddSprite(sprite);
    } else if (
      modalSelectorType === ModalSelectorType.COSTUME ||
      modalSelectorType === ModalSelectorType.BACKDROP
    ) {
      const costume = asset as CostumeJson;
      handleAddCostumesToEditingTarget([loadFromAssetJson(costume) as Costume], true);
    } else if (modalSelectorType === ModalSelectorType.SOUND) {
      const sound = asset as SoundJson;
      handleAddSoundToEditingTarget(sound, true);
    }
    hideModalSelector();
  };

  let internalAssets: CostumeJson[] | SpriteJson[] | SoundJson[] = sprites;
  if (modalSelectorType === ModalSelectorType.COSTUME) {
    internalAssets = sprites.filter((sprite) => sprite.costumes.length > 1);
  } else if (modalSelectorType === ModalSelectorType.BACKDROP) {
    internalAssets = backdrops;
  } else if (modalSelectorType === ModalSelectorType.SOUND) {
    internalAssets = sounds;
  }

  return (
    <Box
      className="costumeSelectorHolder"
      sx={{
        display: modalSelectorOpen ? "block" : "none",
        backgroundColor: "panel.dark",
      }}
    >
      <center>
        <HorizontalButtons
          sx={{
            justifyContent: "center",
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: "divider",
          }}
        >
          <Typography fontSize="18pt" marginBottom="8px">
            Choose a {modalSelectorType}
          </Typography>
          <IconButton
            color="error"
            variant="text"
            icon={<CancelIcon />}
            onClick={() => hideModalSelector()}
          />
        </HorizontalButtons>
        <Box sx={{ height: "4px" }} />
        <Grid container justifyContent="center" spacing={0.5}>
          {internalAssets.map((asset, i) => (
            <Grid
              item
              key={i}
              sx={{
                display:
                  modalSelectorType === ModalSelectorType.SOUND &&
                  (asset as SoundJson).format == "adpcm"
                    ? "none"
                    : "block",
              }}
            >
              {
                <ItemCard
                  title={""}
                  selected={false}
                  onClick={() => onClick(asset)}
                  width={84}
                  height={84}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {modalSelectorType === ModalSelectorType.SOUND ? (
                      <VolumeUpIcon />
                    ) : (
                      <AssetImage sprite={asset as CostumeJson} />
                    )}
                    <Typography sx={{ fontSize: "12pt" }}>
                      {/* @ts-ignore */
                      Object.hasOwn(asset, "name") ? asset.name : asset.id}
                    </Typography>
                  </div>
                </ItemCard>
              }
            </Grid>
          ))}
        </Grid>
      </center>
    </Box>
  );
};

type AssetImageProps = {
  sprite: CostumeJson;
};

const AssetImage = ({ sprite }: AssetImageProps) => {
  const assetUrl = patchAssetStorage.loadAsset(sprite.id);

  return (
    <div
      style={{
        width: "60px",
        height: "60px",
        backgroundImage: `url(${assetUrl})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );
};
