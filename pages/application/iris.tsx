import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import { ReminderBar } from "@/components/ReminderBar";
import { SetStateAction, useState } from "react";
import { IrisBar } from "@/components/IrisBar";
import { FeedMemory } from "@/components/iris/FeedMemory";
import { AskMemory } from "@/components/iris/AskMemory";

export default function Iris() {
  const [selectedOption, setSelectedOption] =
    useState<SetStateAction<string>>("feed memory");

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
        <IrisBar setOption={setSelectedOption} option={selectedOption} />

        {selectedOption == "feed memory" && <FeedMemory />}

        {selectedOption == "ask memory" && <AskMemory />}
      </main>
    </>
  );
}