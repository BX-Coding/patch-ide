import { Typography } from "@mui/material";
import React from "react";

type HoverTooltipProps = {
  declare: string;
  descript: string;
  exampleCode: string;
  imgSrc: string;
};
export const HoverTooltip = (props: HoverTooltipProps) => {
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
      <Typography variant="body2">{props.descript} </Typography>
      <Typography variant="body2">Example: {props.exampleCode}</Typography>
      {props.imgSrc !== "" ? (
        <img src={props.imgSrc} alt="" width={300} height={200} />
      ) : (
        <></>
      )}
    </div>
  );
};
export default HoverTooltip;
