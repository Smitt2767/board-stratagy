import { OS } from "../constants";

export const getOS = () => {
  if (navigator.userAgent.indexOf("Win") !== -1) return OS.WINDOWS;
  else if (navigator.userAgent.indexOf("Mac") !== -1) return OS.MAC;
  else if (navigator.userAgent.indexOf("Linux") !== -1) return OS.LINUX;
  else if (navigator.userAgent.indexOf("Android") !== -1) return OS.ANDROID;
  else return OS.IOS;
};
