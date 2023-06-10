import React, { useEffect } from "react";
import styles from "../styles/components/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ADDRESS_ZERO } from "@/utils/helpers";

//@ts-ignore
export const Navbar = ({ setShowPopup, noSignUp }) => {
  const connector = new MetaMaskConnector();
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  function activatePopUp() {
    setShowPopup(true);
  }
  useEffect(() => {
    let connected = localStorage.getItem("connected");
    console.log("CNCTD", connected);
    if (connected != ADDRESS_ZERO) connect({ connector });
  }, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.texts}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/icons/navbarIcon.png"
            height="55"
            width="60"
            alt="ai-brain"
          />
        </Link>

        {isConnected && (
          <Link href="/application" className={styles.navText}>
            Reminders
          </Link>
        )}

        {isConnected && (
          <Link href="/application/iris" className={styles.navText}>
            Chat Iris
          </Link>
        )}

        {isConnected && (
          <Link href="/application/tags" className={styles.navText}>
            #Tags
          </Link>
        )}

        {isConnected && (
          <Link href="/notifications" className={styles.navText}>
            Notifications
          </Link>
        )}
      </div>

      <div className={styles.buttons}>
        {isConnected && (
          <Link href="/application" className={styles.navButtonsOne}>
            Launch App
          </Link>
        )}

        {isConnected && !noSignUp && (
          <button className={styles.navButtonsTwo} onClick={activatePopUp}>
            Sign Up
          </button>
        )}

        {!isConnected && (
          <button className={styles.navButtonsTwo}>Connect</button>
        )}
      </div>
    </div>
  );
};
