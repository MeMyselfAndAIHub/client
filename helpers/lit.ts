import { hexStringToArrayBuffer } from "@/utils/helpers";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

//@ts-ignore
const client = new LitJsSdk.LitNodeClient();
const chain = "mumbai";

export class Lit {
  //@ts-ignore
  private litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encrypt(stringToEncrypt: string, evmContractConditions: any[]) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    // get auth sig
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain,
    });

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      stringToEncrypt
    );

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      evmContractConditions,
      symmetricKey,
      authSig,
      chain,
    });

    // retrurn all the data to be stored as json
    return {
      encryptedString: Buffer.from(
        await encryptedString.arrayBuffer()
      ).toString("hex"),
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async decrypt(
    evmContractConditions: any[],
    encryptedSymmetricKey: string,
    encryptedString: string
  ) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain,
    });

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      evmContractConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });

    const decryptedString = await LitJsSdk.decryptString(
      new Blob([hexStringToArrayBuffer(encryptedString)]),
      symmetricKey
    );

    return { decryptedString };
  }
}
