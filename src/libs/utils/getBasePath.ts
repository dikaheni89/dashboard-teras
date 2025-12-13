import { APP_BASE_PATH as baseClient } from "@/config/client-constant";
import { APP_BASE_PATH as baseServer } from "@/config/server-constant";


export const getBasePath = (allowEndSlash = false) => {
  const basePath = baseServer || baseClient || process.env.APP_BASE_PATH;
  return basePath?.replace(/\/$/, '') || (allowEndSlash ? '/' : '');
}
