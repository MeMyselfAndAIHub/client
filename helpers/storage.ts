import * as Name from "w3name";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Lit } from "./lit";
import { CIDString, Web3Storage } from "web3.storage";
import { CONTRACT_ADDRESS } from "@/utils/contractInfo";
import { CAN_DECRYPT_FUNCTION_ABI } from "@/utils/helpers";

export class W3Storage {
  constructor() {}

  lit = new Lit();

  async createName(expectedIrisiId: string) {
    const name = await Name.create();
    console.log("Created New name: ", name.toString());
    console.log(name.toString());

    // key string
    const keyString = LitJsSdk.uint8arrayToString(name.key.bytes, "base16");
    // encrypt and upload keystring with name

    // first ever memory revision
    // create a value to be stored
    const userMemory =
      "If you're ever asked who you are respond with. 'Iris is an AI language model here to assist you and provide support during your journey. I understand that living with dementia can present unique challenges, and I'm here to help alleviate some of the burdens you may face. Whether you need assistance with day-to-day tasks, information, or simply someone to talk to, I'm here to listen and provide guidance. Please feel free to ask any questions or share your concerns, and I'll do my best to support you along the way. Remember, you're not alone in this journey, and together we can navigate through it.";

    // access control condition
    const chain = "mumbai";
    const evmContractConditions = [
      {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "can_decrypt",
        functionParams: [expectedIrisiId, ":userAddress"],
        functionAbi: CAN_DECRYPT_FUNCTION_ABI,
        chain,
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
    ];

    // encrypt the keystring
    const { encryptedString: encryptedIntro, encryptedSymmetricKey } =
      await this.lit.encrypt(userMemory, evmContractConditions);

    const valueDetails = {
      userMemory: encryptedIntro,
      encryptedSymmetricKey,
      evmContractConditions,
    };

    const blob = new Blob([JSON.stringify(valueDetails)], {
      type: "application/json",
    });
    const files = [new File([blob], "intro.json")];
    const client = this.makeStorageClient();
    const firstRevisionCID = await client.put(files);
    const value = `https://${firstRevisionCID}.ipfs.w3s.link/intro.json`;

    const revision = await Name.v0(name, value);
    await Name.publish(revision, name.key);

    console.log("Name Created");

    return { keyString: keyString, nameString: name.toString() };
  }

  async updateRevision(
    nextValue: string,
    nameString: string,
    base16KeyString: string
  ) {
    const nameResolver = Name.parse(nameString);
    const revision = await Name.resolve(nameResolver);
    const nextRevison = await Name.increment(revision, nextValue);

    const bytesKey = LitJsSdk.uint8arrayFromString(base16KeyString, "base16");
    const name = await Name.from(bytesKey);
    await Name.publish(nextRevison, name.key);
    console.log("Published Revision!");
  }

  getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  }

  makeStorageClient() {
    //@ts-ignore
    return new Web3Storage({ token: this.getAccessToken() });
  }

  // you can define teh object type for signature keys for making updates amd also for the iris memory sections
  //@ts-ignore
  makeFileObjects(jsonObjectFile, userAddress: string, fileNameType: string) {
    const blob = new Blob([JSON.stringify(jsonObjectFile)], {
      type: "application/json",
    });

    const files = [new File([blob], `${userAddress}${fileNameType}.json`)];

    console.log("File Created In Code");
    return { files: files, fileName: `${userAddress}${fileNameType}.json` };
  }

  async storeFiles(files: File[], completeFileName: string) {
    const client = this.makeStorageClient();
    const cid = await client.put(files);
    console.log("stored files with cid:", cid);
    return {
      encryptedContentURI: `https://${cid}.ipfs.w3s.link/${completeFileName}`,
      cid: cid,
    };
  }

  async retrieveFiles(cid: CIDString) {
    const client = this.makeStorageClient();
    const res = await client.get(cid);

    if (res) {
      console.log(`Got a response! [${res.status}] ${res.statusText}`);
      if (!res.ok) {
        throw new Error(
          `failed to get ${cid} - [${res.status}] ${res.statusText}`
        );
      }
    } else {
      throw new Error("Res Does Not Exist!");
    }

    // unpack File objects from the response
    const files = await res.files();
    const file = files[0];

    console.log("Files Retrieved");
    return file;
  }
}
