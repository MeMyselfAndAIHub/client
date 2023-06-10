import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { FAKE_TAGS_DATA } from "@/utils/testData";
import {
  CAN_DECRYPT_FUNCTION_ABI,
  FEED_IRIS_PROCESSES,
  IMPORTANCE_ARRAY,
  IMPORTANCE_LEVELS,
  MEMORY_FILE_TYPE,
  ROUTINE_IMPORTANCE,
} from "@/utils/helpers";
import styles from "../../styles/components/Tags.module.css";
import { Lit } from "@/helpers/lit";
import { W3Storage } from "@/helpers/storage";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contractInfo";
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { TAG_QUERIES } from "@/utils/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

export default function Tags() {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [usersPreviousMemory, setUsersPreviousMemory] = useState<string>("");
  const [newMemoryInput, setNewMemoryInput] = useState<string>("");

  const [tagName, setTagName] = useState<string>("");
  const [selectedImportance, setSelectedImportance] = useState<number>();
  const [tagSummary, setTagSummary] = useState<string>();
  const [feedProcess, setFeedProcess] = useState<string>("");

  const router = useRouter();

  // Functions
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const { address: account } = useAccount();
  const connector = new MetaMaskConnector();
  const { connect } = useConnect();

  const { data } = useQuery(TAG_QUERIES, {
    variables: { deleted: false, userAddress: account },
  });

  const lit = new Lit();
  const w3Storage = new W3Storage();

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "create_tag",
    args: [
      account,
      {
        name: tagName,
        summary: tagSummary,
        importance: selectedImportance,
      },
    ],
  });
  const { write: create } = useContractWrite(config);

  // get user accct details
  const { data: accountDetails } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "get_account_details",
    args: [account && account.toLocaleLowerCase()],
  });

  // get user w3 memory name and signing key
  const { data: memoryData } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "get_user_w3memoryname_and_signing_key",
    args: [account && account.toLocaleLowerCase()],
  });

  // get previous memory
  const getPreviousMemory = async () => {
    setFeedProcess("1");
    // get the w3name and attach the uri link to it
    const w3NameLink = `https://name.web3.storage/name/${
      //@ts-ignore
      memoryData && memoryData[0]
    }`;
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

    // decrypt the previous memoryand store in state
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
      memoryData && memoryData[1]
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
      memoryData && memoryData[0],
      base16KeyString
    );
    setFeedProcess("6");
    // setTimeout(() => {
    //   router.reload();
    // }, 2000);
  };

  const submitTag = async () => {
    await UpdateMemory();
    create?.();
    setFeedProcess("");
  };

  console.log(data);

  useEffect(() => {
    connect({ connector });
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/* @ts-ignore */}
        <Navbar noSignUp={true} />

        {/* tag page */}
        <div className={styles.tagsContainer}>
          <div className={showPopup ? styles.titleBlur : styles.title}>
            <h3>Event Tags</h3>
            <button onClick={handleOpenPopup}>Add</button>
          </div>

          <div className={showPopup ? styles.tagsBoxesBlur : styles.tagsBoxes}>
            {data && data.tags.length > 0 ? (
              //@ts-ignore
              data.tags.map((tag) => {
                return (
                  <div
                    className={styles.tagsBox}
                    style={{
                      //@ts-ignore
                      backgroundColor: ROUTINE_IMPORTANCE[tag.importance],
                    }}
                  >
                    <h3>{tag.name}</h3>
                    <p>{tag.summary}</p>
                  </div>
                );
              })
            ) : (
              <p>No Tags Created Yet!</p>
            )}
          </div>

          {showPopup && (
            <div className={styles.popup}>
              <div className={styles.createTitle}>
                <p>Create Event Tag</p>
                <img src="/icons/cancel.png" onClick={handleClosePopup} />
              </div>

              <h5>Tag Name</h5>
              <input
                className={styles.tagDescriptionInput}
                onChange={(e) => setTagName(e.target.value)}
              />

              <h5>Tag Summary</h5>
              <input
                className={styles.tagSummaryInput}
                onChange={(e) => setTagSummary(e.target.value)}
              />

              <h5>Tag Event Details</h5>
              <textarea
                className={styles.tagEventDetails}
                onChange={(e) => setNewMemoryInput(e.target.value)}
              />

              <div className={styles.createImportance}>
                <h5>Importance</h5>
                <h6>
                  Selected Importance : {/* @ts-ignore */}
                  <span>{IMPORTANCE_LEVELS[selectedImportance]}</span>
                </h6>

                <div className={styles.importanceColors}>
                  {/* IM HERRREEE */}
                  {IMPORTANCE_ARRAY.map((importance, index) => {
                    return (
                      <div
                        style={{
                          //@ts-ignore
                          backgroundColor: ROUTINE_IMPORTANCE[importance],
                        }}
                        className={styles.importanceColor}
                        onClick={() => setSelectedImportance(importance)}
                      ></div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.loading}>
                <button
                  disabled={!create}
                  onClick={async () => await submitTag()}
                >
                  Create
                </button>
                {feedProcess != "" && <div className={styles.loader}></div>}
                <p>{feedProcess != "" && FEED_IRIS_PROCESSES[feedProcess]}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
