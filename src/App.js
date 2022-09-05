import React from "react";
import {
  ConnectButton,
  SetViewerName,
  ShowViewerName,
} from "../src/components/connection";
import { Provider, useViewerConnection } from "@self.id/framework";
import Editor from "./components/editor";

function App() {
  const config = useViewerConnection();
  console.log("conenction---sas", config);
  return (
    <Provider client={{ ceramic: "testnet-clay" }}>
      <Editor />
      <ConnectButton config={config} />
      {config[0]?.selfID && <SetViewerName connection={config[0]} />}
      {config[0]?.selfID && <ShowViewerName />}
    </Provider>
  );
}

export default App;
