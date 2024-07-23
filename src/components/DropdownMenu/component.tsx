import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'
import { TextButton, IconButton } from '../PatchButton'
import { HourglassBottom } from '@mui/icons-material'

type Option = {
  label: string,
  onClick: () => void,
}

type DropdownMenuProps = {
  type: "text" | "icon",
  icon?: JSX.Element,
  text?: string,
  options: Option[],
  sx?: any,
}

export const DropdownMenu = ({ type, icon, text, options, sx }: DropdownMenuProps) => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
  return (
    <div>
      <Button variant="contained" sx={sx} {...bindTrigger(popupState)}>
        {type === "text" ? text : icon}
      </Button>
      <Menu {...bindMenu(popupState)}>
        {options.map((option, index) => (<MenuItem key={index} sx={{
          borderTopStyle: index > 0 ? "solid": "none",
          borderTopWidth: "1px",
          borderTopColor: "outlinedButtonBorder.main",
        }} onClick={() => {
          option.onClick()
          popupState.close()
          }}>{option.label}</MenuItem>))}
      </Menu>
    </div>
  )
}