import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    panel: Palette['primary'];
    outlinedButtonBorder?: Palette['primary'];
  }
  interface PaletteOptions {
    panel: PaletteOptions['primary'];
    outlinedButtonBorder?: PaletteOptions['primary'];
  }
}

const theme: Theme = createTheme({
    "palette": {
      "mode": "light",
      "panel": {
        "main": "rgba(255, 255, 255, 0.08)"
      },
      "background": {
        "paper": "#DDDDDD",
        "default": "#DDDDDD"
      },
      "text": {
        "primary": "#000"
      }
    },
    "shape": {
      "borderRadius": 8
    },
    "components": {
      "MuiButton": {
        "defaultProps": {
          "disableElevation": true
        },
        "styleOverrides": {},
        "variants": [
          {
            "props": {
              "variant": "outlined"
            },
            "style": {
              "border": "1px solid #000",
            }
          }
        ]
      }
    }
  });

export default theme;