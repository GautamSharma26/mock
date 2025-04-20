import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: "light", // Default to Light Mode
    useSystemColorMode: false, // Avoid auto-switching to system theme
  };

const theme = extendTheme({ config });

export default theme;
