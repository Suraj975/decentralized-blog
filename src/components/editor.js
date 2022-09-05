import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useViewerRecord } from "@self.id/react";
import { useState } from "react";
import { useIpfs } from "../hooks/use-ipfs";
import { useClient } from "@self.id/framework";
import { ModelManager } from "@glazed/devtools";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { EthereumAuthProvider, SelfID } from "@self.id/web";
import React from "react";
export class UploadAdapter {
  loader;
  ipfs;
  constructor(loader, ipfs) {
    this.loader = loader;
    this.ipfs = ipfs;
    // console.log(this.readThis(loader.file));
  }

  upload() {
    return this.loader.file.then(async (data) => {
      const file = data;
      try {
        const added = await this.ipfs.add(file, {
          progress: (prog) => console.log(`received: ${prog}`),
        });
        const url = `https://decentralized-blog.infura-ipfs.io/ipfs/${added.path}`;
        console.log("url----", url);
        return { default: url };
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    });
  }
}

const Editor = (props) => {
  const ipfs = useIpfs();
  const record = useViewerRecord("basicProfile");
  const records = record?.content?.blog ?? "";
  const client = useClient();

  const getSchema = async () => {
    // console.log("Entry");
    //client.authenticate(EthereumAuthProvider);
    const addresses = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const authProvider = new EthereumAuthProvider(
      window.ethereum,
      addresses[0]
    );
    const ceramic = new CeramicClient();

    // await client.authenticate(authProvider);
    // const self = new SelfID({ client });
    await client?._ceramic?._context?.did.authenticate();
    ceramic.did = client?._ceramic?._context?.did;
    console.log("client", client);
    console.log("self", client);
    const manager = new ModelManager({ ceramic });
    const data = await manager.createSchema("MySchema", {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Reward",
      type: "object",
      properties: {
        title: { type: "string" },
        message: { type: "string" },
      },
      required: ["message", "title"],
    });
  };
  const [editorData, setEditorData] = useState("");
  console.log("editorData---", editorData);
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={records || editorData}
        onReady={(eventData) => {
          eventData.plugins.get("FileRepository").createUploadAdapter =
            function (loader) {
              return new UploadAdapter(loader, ipfs);
            };
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
        }}
      />
      <button
        disabled={!record.isMutable || record.isMutating}
        onClick={async () => {
          await record.merge({ blog: editorData });
        }}
      >
        Set Draft
      </button>
      <button onClick={getSchema}>Schmea</button>
    </div>
  );
};

export default Editor;

// const custom_config = {
//   extraPlugins: [MyCustomUploadAdapterPlugin],
//   toolbar: {
//     items: [
//       "heading",
//       "|",
//       "bold",
//       "italic",
//       "link",
//       "bulletedList",
//       "numberedList",
//       "|",
//       "blockQuote",
//       "insertTable",
//       "|",
//       "imageUpload",
//       "undo",
//       "redo",
//     ],
//   },
//   table: {
//     contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
//   },
// };

// const ceramic = new CeramicClient("https://testnet-clay-ceramic-node.com");
// const manager = new ModelManager({ ceramic });
// const getSchema = async () => {
//   console.log("Entry");
//   const data = await manager.createSchema("MySchema", {
//     $schema: "http://json-schema.org/draft-07/schema#",
//     title: "Reward",
//     type: "object",
//     properties: {
//       title: { type: "string" },
//       message: { type: "string" },
//     },
//     required: ["message", "title"],
//   });
//   console.log("Schema", data);
// };
// React.useEffect(() => {
//   getSchema();
// }, []);
