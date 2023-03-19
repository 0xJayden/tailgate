import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { accountAtom, enterQueueAtom } from "./_app";
import { trpc } from "../utils/trpc";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [web3, setWeb3] = useState<ethers.providers.Web3Provider>();
  const [account, setAccount] = useAtom(accountAtom);
  const [enterQueue, setEnterQueue] = useAtom(enterQueueAtom);
  const router = useRouter();

  const mutation = trpc.addUser.useMutation();

  const loadWeb3 = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setWeb3(provider);

    window.ethereum.on("accountsChanged", () => {
      setAccount("");
    });
  };

  const web3Handler = async () => {
    try {
      if (!web3) return;
      const accounts = await web3.send("eth_requestAccounts", []);
      console.log(accounts);
      setAccount(accounts[0]);
      mutation.mutate({ address: accounts[0] });
      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  useEffect(() => {
    loadWeb3();
  }, [account]);

  return (
    <>
      <Head>
        <title>Operation Tailgate</title>
        <meta name="description" content="Hackathon Project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#212121] justify-between flex-col items-center h-screen p-24 flex">
        <h1 className="text-[#e8e8e8] text-4xl font-bold">
          Operation Tailgate
        </h1>
        {!account ? (
          <button
            onClick={() => web3Handler()}
            className="rounded p-2 text-[#e8e8e8] bg-[#51abe1]"
          >
            Connect
          </button>
        ) : (
          <button
            className="rounded p-2 text-[#e8e8e8] bg-[#51abe1]"
            onClick={() => {
              setEnterQueue(true);
              router.push("/purchase");
            }}
          >
            Purchase
          </button>
        )}
      </main>
    </>
  );
}
