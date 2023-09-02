import React from "react"
import getCostumeUrl from "../../util/get-costume-url"
import { Costume } from "../EditorPane/types"

type CostumeImageProps = {
    costume: Costume,
    className: string,
}

export const CostumeImage = ({ costume }: CostumeImageProps) => {
    return <div style={{
        backgroundImage: `url(${getCostumeUrl(costume.asset)})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100%",
        height: "100%",
    }} className={"imageContainer"} />
}