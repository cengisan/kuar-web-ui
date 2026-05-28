export type ThemeMode = "dark" | "light";

export interface ThemeColors {
  background: string;
  error: string;
  card: string;
  text: string;
  subtitle: string;
  border: string;
  button: string;
  buttonText: string;
  green: string;
  orange: string;
  yellow: string;
  blue: string;
  red: string;
}

export const themes: Record<ThemeMode, ThemeColors> = {
  dark: {
    background: "#111111",
    error: "#FF3B30",
    card: "#1A1A1A",
    text: "#FFFFFF",
    subtitle: "#CCCCCC",
    border: "rgba(255, 255, 255, 0.1)",
    button: "#292929",
    buttonText: "#FFFFFF",
    green: "#2D6330",
    orange: "#FFA500",
    yellow: "#FFD700",
    blue: "#28364F",
    red: "#FF4500",
  },
  light: {
    background: "#FFFFFF",
    error: "#FF3B30",
    card: "#FFFFFF",
    text: "#111111",
    subtitle: "#555555",
    border: "rgba(0, 0, 0, 0.1)",
    button: "#1A1A1A",
    buttonText: "#FFFFFF",
    green: "#4CAF50",
    orange: "#FFA500",
    yellow: "#FFD700",
    blue: "#5886BF",
    red: "#FF4500",
  },
};

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return themes[mode];
}
