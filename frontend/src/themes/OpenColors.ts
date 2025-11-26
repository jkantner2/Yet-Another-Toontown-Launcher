export const OpenColors = {
  darkGray: "#f8f9fa",
  gray: "#f1f3f5",
  lightGray: "#e9ecef",
  subSubSurface: "#ced4da",
  subsurface: "#adb5bd",
  brightGray: "#868e96",
  yellow: "#fcc419",
  orange: "#fd7e14",
  green: "#40c057",
  teal: "#20c997",
  cyan: "#22b8cf",
  blue: "#228be6",
  violet: "#6741d9",
  pink: "#d6336c",
  red: "#f03e3e",
} as const;

export type ColorName = keyof typeof OpenColors;
export type ColorHex = typeof OpenColors[ColorName];

