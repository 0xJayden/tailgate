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
import item from "@/assets/images/item.png";
import logo from "@/assets/images/logo.png";
import tglogo from "@/assets/images/tailgatelogo.png";

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
        <title>Tailgate</title>
        <meta name="description" content="Hackathon Project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#1E1E23] justify-center items-center w-full flex-col h-screen flex">
        <div className="absolute justify-between pr-5 top-0 flex sm:space-x-8 items-center bg-[#1E1E23] w-full">
          <Image className="sm:max-w-[300px] max-w-[200px]" src={logo} alt="" />
          <Image
            className="sm:max-w-[200px] max-w-[100px]"
            src={tglogo}
            alt=""
          />
        </div>
        <div className="flex-col w-full flex sm:flex-row sm:justify-between items-center justify-center max-w-[1100px] pt-20">
          <div className="">
            <Image
              className="sm:max-w-[500px] max-w-[300px]"
              src={item}
              alt=""
            />
          </div>
          <div className="sm:space-y-10 space-y-4 flex flex-col items-center sm:pr-20">
            <div className="text-center">
              <h1 className="font-bold text-6xl text-white">NFT Item #999</h1>
              <p className="text-[#e0e0e0]">By Nftlabs</p>
            </div>
            <div>
              <p className="text-[#e0e0e0]">Ask Price:</p>
              <p className="text-white">99 ETH</p>
            </div>
            <p className="text-white">Buy this NFT it's awesome!</p>
            <p className="p-2 border w-[120px] border-[#51abe1] rounded-lg text-[#e0e0e0]">
              1000 Editions
            </p>
            {!account ? (
              <button
                onClick={() => web3Handler()}
                className="rounded p-2 text-[#e8e8e8] bg-[#51abe1]"
              >
                Connect to Mint
              </button>
            ) : (
              <button
                className="rounded p-2 text-[#e8e8e8] bg-[#51abe1]"
                onClick={() => {
                  router.push("/purchase");
                }}
              >
                Mint
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
