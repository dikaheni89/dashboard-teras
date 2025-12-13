import fs from "fs";
import path from "path";

// src/config/getTokenFromFile.ts
export const getTokenFromFile = (): string => {
  if (typeof window !== "undefined") {
    return "";
  }

  try {
    const tokenPath =
      process.env.SPLP_TOKEN_FILE ||
      path.join(process.cwd(), ".data", "splp-token.json");

    if (!fs.existsSync(tokenPath)) {
      return "";
    }

    const tokenData = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    return tokenData.access_token || "";
  } catch (error) {
    console.error("Error reading token from file:", error);
    return "";
  }
};
