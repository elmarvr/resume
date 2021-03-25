import { theme } from "twin.macro";

const spacingToPx = (spacing: number) => {
  return parseInt(theme`spacing`[spacing].replace("rem", ""), 10) * 16;
};

export default spacingToPx;
