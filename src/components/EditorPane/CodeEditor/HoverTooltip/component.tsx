import { Typography } from "@mui/material";
import React from "react";

type HoverTooltipProps = {
    declare: string,
    descript: string,
    exampleCode: string,
    imgSrc: string
};
export const HoverTooltip = (props:HoverTooltipProps) => {

  return (
    <div style={{ width: 300 }}>
        <Typography variant="body1">{props.declare}</Typography>
        <Typography variant="body2">{props.descript} </Typography>
        <Typography variant="body2">Exmaple: {props.exampleCode}</Typography>
        <img src={props.imgSrc} alt="" width={300}/>
    </div>
  );
};
export default HoverTooltip;
