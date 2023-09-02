import { Tooltip } from "@mui/material"
import React from "react";

type FeatureWrapperProps = {
    show: boolean,
    message?: string,
    children: React.ReactNode,
}
  
export function FeatureWrapper({ show, message="This feature is not yet available.", children }: FeatureWrapperProps) {
    return (
        <Tooltip arrow title={show ? message : ""}>
            <span>
                {children}
            </span>
        </Tooltip>
    );
}