export function getWebDeviceInfo(): {
  device_type: string;
  device_model: string;
  device_version: string;
} {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";

  let browserName = "Unknown Browser";
  let browserVersion = "";

  if (ua.includes("Firefox/")) {
    browserName = "Firefox";
    browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] ?? "";
  } else if (ua.includes("Edg/")) {
    browserName = "Edge";
    browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] ?? "";
  } else if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    browserName = "Chrome";
    browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] ?? "";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
    browserName = "Safari";
    browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] ?? "";
  }

  let osName = "Unknown OS";
  if (ua.includes("Windows")) osName = "Windows";
  else if (ua.includes("Mac OS X")) osName = "macOS";
  else if (ua.includes("Linux")) osName = "Linux";
  else if (ua.includes("Android")) osName = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) osName = "iOS";

  return {
    device_type: "WEB",
    device_model: browserName,
    device_version: `${osName} ${browserVersion}`.trim(),
  };
}
