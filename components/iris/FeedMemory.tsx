import React, { useEffect, useState } from "react";
import styles from "../../styles/components/iris/FeedMemory.module.css";
import { FAKE_RESPONSE } from "@/utils/testData";
import { Lit } from "@/helpers/lit";
import { W3Storage } from "@/helpers/storage";
import {
  CAN_DECRYPT_FUNCTION_ABI,
  FEED_IRIS_PROCESSES,
  MEMORY_FILE_TYPE,
} from "@/utils/helpers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contractInfo";
import { useAccount, useConnect, useContractRead } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Router, useRouter } from "next/router";

export const FeedMemory = () => {
  const [usersPreviousMemory, setUsersPreviousMemory] = useState<string>("");
  const [newMemoryInput, setNewMemoryInput] = useState<string>("");
  const [feedProcess, setFeedProcess] = useState<string>("");

  const router = useRouter();
  const lit = new Lit();
  const w3Storage = new W3Storage();

  const connector = new MetaMaskConnector();
  const { address: account } = useAccount();
  const { connect } = useConnect();

  console.log("ACCOUNT", account);

  // get user w3 memory name and signing key
  const { data } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "get_user_w3memoryname_and_signing_key",
    args: [account && account.toLocaleLowerCase()],
  });

  // get user accct details
  const { data: accountDetails } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "get_account_details",
    args: [account && account.toLocaleLowerCase()],
  });

  console.log("Memory Name and Signing Key CID: ", data);

  // get previous memory
  const getPreviousMemory = async () => {
    setFeedProcess("1");
    // get the w3name and attach the uri link to it
    //@ts-ignore
    const w3NameLink = `https://name.web3.storage/name/${data && data[0]}`;
    // make a fetch request to get the pointer value to the previous memory
    const w3NameLinkResponse = await fetch(w3NameLink);
    if (!w3NameLinkResponse.ok) {
      throw new Error("w3NameLinkResponse Not Ok!");
    }
    const w3NameLinkData = await w3NameLinkResponse.json();

    const previousMemoryLink = await w3NameLinkData.value;

    console.log("Previous Mmeory Link", previousMemoryLink);

    // we make a fetch request to the memory link which contains the memory and info we need to decrypt the memory
    const previousMemoryResponse = await fetch(previousMemoryLink);
    if (!previousMemoryResponse.ok) {
      throw new Error("w3NameLinkResponse Not Ok!");
    }

    setFeedProcess("2");
    // all data needed gotten!
    const {
      userMemory: encryptedPreviousMemory,
      encryptedSymmetricKey,
      evmContractConditions,
    } = await previousMemoryResponse.json();

    // decrypt the previous memorya nd store in state
    const { decryptedString: previousMemory } = await lit.decrypt(
      evmContractConditions,
      encryptedSymmetricKey,
      encryptedPreviousMemory
    );
    setUsersPreviousMemory(previousMemory);

    console.log(previousMemory);
    return previousMemory;
  };

  // update memory
  const UpdateMemory = async () => {
    const previousMemory = await getPreviousMemory();

    setFeedProcess("3");
    // combine memories
    const combinedMemory = previousMemory + " " + newMemoryInput;

    // access control conditions
    const chain = "mumbai";
    const evmContractConditions = [
      {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "can_decrypt",

        functionParams: [
          //@ts-ignore
          accountDetails && accountDetails.iris_id.toString(),
          ":userAddress",
        ],
        functionAbi: CAN_DECRYPT_FUNCTION_ABI,
        chain,
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
    ];

    // encrypt combined memory
    const { encryptedString, encryptedSymmetricKey } = await lit.encrypt(
      combinedMemory,
      evmContractConditions
    );

    // create a new memory uri containing the combined memory
    const packagedMemory = {
      userMemory: encryptedString,
      encryptedSymmetricKey,
      evmContractConditions,
    };

    // upload the memory uri to ipfs

    const { files, fileName } = w3Storage.makeFileObjects(
      packagedMemory,
      //@ts-ignore
      account,
      MEMORY_FILE_TYPE
    );

    setFeedProcess("4");
    const { encryptedContentURI: newMemoryLink, cid } =
      await w3Storage.storeFiles(files, fileName);

    console.log("Combined Mmeory Created With CID", cid);

    // get signing key for updating revision

    const signingKeyLink = `https://${
      //@ts-ignore
      data && data[1]
    }.ipfs.dweb.link/${account}SigningKey.json`;
    const signingKeyResponse = await fetch(signingKeyLink);
    if (!signingKeyResponse.ok) {
      throw new Error("signingKeyResponse response was not OK");
    }
    const {
      encryptedW3SigningKeyString,
      encryptedSymmetricKey: signingKeyEncryptedSymmetricKey,
      evmContractConditions: signingKeyEvmContractConditions,
    } = await signingKeyResponse.json();

    console.log("Decrypting revision update key....");
    // decrypt the signing key
    const { decryptedString: base16KeyString } = await lit.decrypt(
      signingKeyEvmContractConditions,
      signingKeyEncryptedSymmetricKey,
      encryptedW3SigningKeyString
    );

    setFeedProcess("5");
    console.log("Updating Revision....");
    // update the revison to the w3name
    await w3Storage.updateRevision(
      newMemoryLink,
      //@ts-ignore
      data && data[0],
      base16KeyString
    );
    setFeedProcess("6");
    setTimeout(() => {
      router.reload();
    }, 2000);
  };

  useEffect(() => {
    connect({ connector });
  }, []);

  return (
    <div className={styles.feedMemory}>
      <div className={styles.prompt}>
        <img src="/icons/iris.png" />
        <p>I'm Listening...</p>
      </div>

      <textarea
        className={styles.inputMemory}
        placeholder="Write here..."
        onChange={(e) => setNewMemoryInput(e.target.value)}
      />

      <div className={styles.store}>
        <button onClick={async () => await UpdateMemory()}>Store</button>
        {feedProcess != "" && <div className={styles.loader}></div>}
        {feedProcess != "" && <p>{FEED_IRIS_PROCESSES[feedProcess]}</p>}
      </div>
    </div>
  );
};
