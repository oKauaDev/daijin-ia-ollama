import * as os from "os";

export default function getVpsIp() {
  const interfaces = os.networkInterfaces();

  let ip = "0.0.0.0";

  Object.keys(interfaces).forEach((interfaceName) => {
    const addresses = interfaces[interfaceName];
    if (addresses) {
      addresses.forEach((address) => {
        if (address.family === "IPv4" && !address.internal) {
          ip = address.address;
        }
      });
    }
  });

  return ip;
}
