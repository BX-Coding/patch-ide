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

const theme: Theme = createTheme(
{
    "palette": {
      "mode": "dark",
      "primary": {
        "main": "#1976d2",
        "light": "#42a5f5",
        "dark": "#1565c0"
      },
      "secondary": {
        "main": "#9c27b0",
        "light": "#ba68c8",
        "dark": "#7b1fa2"
      },
      "error": {
        "main": "#d32f2f",
        "light": "#ef5350",
        "dark": "#c62828",
        "contrastText": "#fff"
      },
      "warning": {
        "main": "#ed6c02",
        "light": "#ff9800",
        "dark": "#e65100",
        "contrastText": "#fff"
      },
      "info": {
        "main": "#0288d1",
        "light": "#03a9f4",
        "dark": "#01579b",
        "contrastText": "#fff"
      },
      "success": {
        "main": "#2e7d32",
        "light": "#4caf50",
        "dark": "#1b5e20",
        "contrastText": "rgba(0, 0, 0, 0.87)"
      },
      "text": {
        "primary": "#fff",
        "secondary": "rgba(255, 255, 255, 0.7)",
        "disabled": "rgba(255, 255, 255, 0.5)",
      },
      "background": {
        "paper": "#242424",
        "default": "#242424"
      },
      "panel": {
        "main": "rgba(0, 0, 0, 0.16)",
        "dark": "rgba(24, 24, 24, 0.96)",
        "contrastText": "#FFFFFF"
      },
      "outlinedButtonBorder": {
        "main": "rgba(255, 255, 255, 0.16)"
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
              "border": "1px solid #000"
            }
          }
        ]
      }
    }
  });

  export default theme;