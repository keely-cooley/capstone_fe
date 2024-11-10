import { useState, createContext } from "react";

export const themes = {
  light: {
    foreground: "#ffffff",
    background: "#111111",
  },
  dark: {
    foreground: "#ffffff",
    background: "#111111",
  },
};

export const MyThemeContext = createContext({ theme: themes.light });

export default function MyThemeProvider(props) {
  const [theme, setTheme] = useState(themes.light);

  const darkMode = theme.background === themes.dark.background;

  return (
    <MyThemeContext.Provider value={{ theme, setTheme, darkMode }}>
      {props.children}
    </MyThemeContext.Provider>
  );
}