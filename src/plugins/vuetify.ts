/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

const lightGreen = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    "surface-bright": "#FFFFFF",
    "surface-light": "#EEEEEE",
    "surface-variant": "#424242",
    "on-surface-variant": "#EEEEEE",
    primary: "#4CAF50",
    "primary-darken-1": "#388E3C",
    secondary: "#48A9A6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
  variables: {
    "border-color": "#000000",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.6,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.04,
    "hover-opacity": 0.04,
    "focus-opacity": 0.12,
    "selected-opacity": 0.08,
    "activated-opacity": 0.12,
    "pressed-opacity": 0.12,
    "dragged-opacity": 0.08,
    "theme-kbd": "#212529",
    "theme-on-kbd": "#FFFFFF",
    "theme-code": "#F5F5F5",
    "theme-on-code": "#000000",
  },
};

const darkGreen = {
  dark: true,
  colors: {
    background: "#121212",
    surface: "#1E1E1E",
    "surface-bright": "#2C2C2C",
    "surface-light": "#424242",
    "surface-variant": "#2A2A2A",
    "on-surface-variant": "#EEEEEE",
    primary: "#4CAF50",
    "primary-darken-1": "#388E3C",
    secondary: "#48A9A6",
    "secondary-darken-1": "#018786",
    error: "#CF6679",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
    onPrimary: "#FFFFFF",
    onBackground: "#FFFFFF",
    onSurface: "#FFFFFF",
  },
  variables: {
    "border-color": "#FFFFFF",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.6,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.1,
    "hover-opacity": 0.08,
    "focus-opacity": 0.12,
    "selected-opacity": 0.16,
    "activated-opacity": 0.12,
    "pressed-opacity": 0.16,
    "dragged-opacity": 0.08,
    "theme-kbd": "#FFFFFF",
    "theme-on-kbd": "#000000",
    "theme-code": "#2C2C2C",
    "theme-on-code": "#FFFFFF",
  },
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "lightGreen",
    themes: {
      darkGreen,
      lightGreen,
    },
  },
});
