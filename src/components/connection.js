import React from "react";
import {
  useViewerConnection,
  EthereumAuthProvider,
  useViewerRecord,
  usePublicRecord,
} from "@self.id/framework";

export function ShowViewerName() {
  const record = useViewerRecord("basicProfile");

  const text = record.isLoading
    ? "Loading..."
    : record.content
    ? `Hello ${record.content.name || "stranger"}`
    : "No profile to load";
  return <p>{text}</p>;
}
///did:3:kjzl6cwe1jw147njqqney1e5so2aphgitpyx9rzmd795ait7mjhpnaysf887tv3
//sda
export function SetViewerName({ connection }) {
  const record = useViewerRecord("basicProfile");
  const record2 = usePublicRecord("basicProfile", connection?.selfID?.id);

  console.log("record=----", record);
  console.log("record2=----", record2);
  return (
    <button
      disabled={!record.isMutable || record.isMutating}
      onClick={async () => {
        await record.merge({ car: "Alice" });
      }}
    >
      Set name
    </button>
  );
}

export function ConnectButton({ config }) {
  const [connection, connect, disconnect] = config;
  return connection.status === "connected" ? (
    <button
      onClick={() => {
        disconnect();
      }}
    >
      Disconnect ({connection.selfID.id})
    </button>
  ) : typeof window !== "undefined" && window?.ethereum ? (
    <button
      disabled={connection.status === "connecting"}
      onClick={async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await connect(new EthereumAuthProvider(window.ethereum, accounts[0]));
      }}
    >
      Connect
    </button>
  ) : (
    <p>
      An injected Ethereum provider such as{" "}
      <a href="https://metamask.io/">MetaMask</a> is needed to authenticate.
    </p>
  );
}
