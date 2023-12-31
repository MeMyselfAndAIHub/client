import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Notifications.module.css";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FAKE_TESTNOTIFCATIONS } from "@/utils/testData";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { DAILY_REMINDER_QUERIES } from "@/utils/queries";
import { useQuery } from "@apollo/client";

export default function Notifications() {
  const [showPopup, setShowPopup] = useState(false);

  const { address: account } = useAccount();
  const connector = new MetaMaskConnector();
  const { connect } = useConnect();

  const { data } = useQuery(DAILY_REMINDER_QUERIES, {
    variables: { userAddress: account },
  });

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
        <Navbar setShowPopup={setShowPopup} noSignUp={true} />

        <div className={styles.notifications}>
          <h3>Me, Myself & A.I | Notifications</h3>
          <div className={styles.notifcationBoxes}>
            {data && data.dailyReminders.length > 0 ? (
              //@ts-ignore
              data.dailyReminders.map((dailyReminder) => {
                return (
                  <div className={styles.notification}>
                    <h5>Know You Reminder!</h5>
                    <p>
                      Today is filled with endless possibilities, and I'm here
                      to help you stay organized and keep track of important
                      things. As your companion, I understand that sometimes
                      remembering things can be a bit challenging, and that's
                      completely okay. We're here to lend you a helping hand and
                      support you along the way.
                    </p>
                  </div>
                );
              })
            ) : (
              <p>
                No <b>Know You Reminders</b> Yet!
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
