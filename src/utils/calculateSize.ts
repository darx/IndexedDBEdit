export default function calculateSize (bytes: number) {
  const kb = 1024;

  if (Math.abs(bytes) < kb) return bytes + " B";

  const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let u = -1;
  do {
    bytes /= kb;
    ++u;
  } while (Math.abs(bytes) >= kb && u < units.length - 1);

  return bytes.toFixed(1) + " " + units[u];
};