import React, { useContext, useState, useEffect, useCallback } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { sprites } from "../../assets/sprites";
import { sounds } from "../../assets/sounds";
import { backdrops } from "../../assets/backdrops";
import { Typography, Box, Grid } from "@mui/material";
import { HorizontalButtons, IconButton } from "../PatchButton";
import usePatchStore, { ModalSelectorType } from "../../store";
import { useAddSprite } from "../SpritePane/onAddSpriteHandler";
import { Asset, SoundJson, SpriteJson } from "../EditorPane/old-types";
import { useSoundHandlers } from "../../hooks/useSoundUploadHandlers";
import { ItemCard } from "../ItemCard";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useCostumeHandlers } from "../../hooks/useCostumeUploadHandlers";
import { getPatchAssetImageUrl } from "../../lib/patch-asset-image-fetch";
import { createVMAsset } from "../../lib/file-uploader";
import { Costume } from "leopard";

export const ModalSelector = () => {
  const modalSelectorType = usePatchStore((state) => state.modalSelectorType);
  const modalSelectorOpen = usePatchStore((state) => state.modalSelectorOpen);
  const hideModalSelector = usePatchStore((state) => state.hideModalSelector);
  const { handleAddSoundToEditingTarget } = useSoundHandlers();
  const { handleAddCostumesToEditingTarget } = useCostumeHandlers();
  const { onAddSprite } = useAddSprite();

  const onClick = (asset: SpriteJson | SoundJson) => {
    if (modalSelectorType === ModalSelectorType.SPRITE) {
      const sprite = asset as SpriteJson;
      onAddSprite(sprite);
    } else if (
      modalSelectorType === ModalSelectorType.COSTUME ||
      modalSelectorType === ModalSelectorType.BACKDROP
    ) {
      // TODO: finish this
      /*const sprite = asset as SpriteJson;
      const costumes = sprite.costumes.map((oldCostume) => {return createVMAsset()}) as Costume[];
      handleAddCostumesToEditingTarget(, true);*/
    } else if (modalSelectorType === ModalSelectorType.SOUND) {
      const sound = asset as SoundJson;
      handleAddSoundToEditingTarget(sound, true);
    }
    hideModalSelector();
  };

  let internalAssets: SpriteJson[] | SoundJson[] = sprites;
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
                  (asset as SoundJson).dataFormat == "adpcm"
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
                      <AssetImage sprite={asset as SpriteJson} />
                    )}
                    <Typography sx={{ fontSize: "12pt" }}>
                      {asset.name}
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
  sprite: SpriteJson;
};

const AssetImage = ({ sprite }: AssetImageProps) => {
  const assetUrl = getPatchAssetImageUrl(
    sprite.costumes[0].assetId,
    sprite.costumes[0].dataFormat
  );

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
