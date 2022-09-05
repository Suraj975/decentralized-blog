import React, { useState } from "react";
import { create } from "ipfs-http-client";

export const projectId = process.env.REACT_APP_INFURA_IPFS_ID;
export const projectSecret = process.env.REACT_APP_INFURA_IPFS_KEY;

export const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

export const useIpfs = () => {
  const [ipfs, setIpfs] = useState();

  React.useEffect(() => {
    const getIpfsInstance = async () => {
      const client = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      });
      setIpfs(client);
    };
    if (!ipfs) {
      getIpfsInstance();
    }
  }, []);

  return ipfs;
};
