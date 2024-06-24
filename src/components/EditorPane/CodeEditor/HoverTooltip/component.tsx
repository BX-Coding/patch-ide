import { Typography } from "@mui/material";
import React, { useState } from "react";

type HoverTooltipProps = {
  declare: string;
  descript: string;
  exampleCode: string;
  imgSrc: string;
};

export const HoverTooltip = (props: HoverTooltipProps) => {
  // Step 2: Initialize showImage state
  const [showImage, setShowImage] = useState(true);

  return (
    <div
      style={{
        width: 300,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "5px",
        padding: "5px",
      }}
    >
      <Typography variant="body1">{props.declare}</Typography>
      <Typography variant="body2">{props.descript}</Typography>
      <Typography variant="body2">Example: {props.exampleCode}</Typography>
      {/* Step 4: Conditionally render the img tag */}
      {props.imgSrc !== "" && showImage ? (
        <img
          src={props.imgSrc}
          alt="Patch Function"
          width={300}
          height={200}
          // Step 3: onError event handler
          onError={() => setShowImage(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
