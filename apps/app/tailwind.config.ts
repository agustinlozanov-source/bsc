import type { Config } from "tailwindcss";
import bscPreset from "@bsc/ui/tailwind-preset";

const config: Config = {
  presets: [bscPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    // Escanea los componentes compartidos de @bsc/ui
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
