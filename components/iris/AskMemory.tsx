import React, { useEffect, useState } from "react";
import styles from "../../styles/components/iris/AskMemory.module.css";
import { FAKE_RESPONSE } from "@/utils/testData";
import { Lit } from "@/helpers/lit";
import { LangChain } from "@/helpers/langchain";
import { useAccount, useConnect, useContractRead } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contractInfo";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export const AskMemory = () => {
  const [question, setQuestion] = useState<string>("");
  const [askproccess, setAskProcess] = useState<string>("");
  const [memoryResponse, setMemoryResponse] = useState("");

  const langchain = new LangChain();
  const lit = new Lit();

  const connector = new MetaMaskConnector();
  const { address: account } = useAccount();
  const { connect } = useConnect();

  const { data } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "get_user_w3memoryname_and_signing_key",
    args: [account && account.toLocaleLowerCase()],
  });

  // get current memory
  const getCurrentMemory = async () => {
    setAskProcess("1");

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

    setAskProcess("2");
    // all data needed gotten!
    const {
      userMemory: encryptedPreviousMemory,
      encryptedSymmetricKey,
      evmContractConditions,
    } = await previousMemoryResponse.json();

    // decrypt the previous memoryand store in state
    const { decryptedString: previousMemory } = await lit.decrypt(
      evmContractConditions,
      encryptedSymmetricKey,
      encryptedPreviousMemory
    );

    console.log(previousMemory);
    return previousMemory;
  };

  // ask memory question
  const Ask = async () => {
    const currentMemory = await getCurrentMemory();

    setAskProcess("3");
    const response = await langchain.askMemory(currentMemory, question);

    setMemoryResponse(response.text);
    setAskProcess("4");
  };

  useEffect(() => {
    connect({ connector });
  }, []);

  return (
    <div className={styles.askMemory}>
      <div className={styles.prompt}>
        <img src="/icons/iris.png" />
        <input
          placeholder="Ask me anything from your memory..."
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={async () => await Ask()}>Ask</button>
      </div>

      <div className={styles.response}>
        <p>{askproccess == "1" && "Checking Old Memory..."}</p>
        <p>{askproccess == "2" && "Still Looking..."}</p>
        <p>{askproccess == "3" && "Generating response..."}</p>
        {askproccess != "" && askproccess != "4" && (
          <div className={styles.loader}></div>
        )}
        <p>{askproccess == "4" && memoryResponse}</p>
      </div>
    </div>
  );
};
