import React from "react"
import getCostumeUrl from "../../util/get-costume-url"
import { Costume } from "../EditorPane/types"

type CostumeImageProps = {
    costume: Costume,
    className: string,
}

export const CostumeImage = ({ costume, className }: CostumeImageProps) => {
    return <img src={getCostumeUrl(costume.asset)} className={className} />
}