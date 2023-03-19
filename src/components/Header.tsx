import { accountAtom, enterQueueAtom } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import { ethers } from "ethers";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Header() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
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
    <div className="fixed top-0 w-full z-30 clearNav md:bg-opacity-90 transition duration-300 ease-in-out">
      <div className="flex flex-col max-w-6xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between p-4">
          <Link
            href="/"
            className="text-lg font-semibold rounded-lg tracking-widest focus:outline-none focus:shadow-outline"
          >
            <div className="flex items-center justify-center">
              <img
                src="/images/tailgate-logo.png"
                alt="Google Logo"
                className="block object-contain h-16"
              ></img>
            </div>
          </Link>
          <button
            className="text-white cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none "
            type="button"
            aria-label="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#191919"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div
          className={
            "md:flex flex-grow items-center" +
            (navbarOpen ? " flex" : " hidden")
          }
        >
          <nav className="flex-col flex-grow ">
            <ul className="flex flex-grow justify-end flex-wrap items-center">
              <li>
                <Link
                  href="/"
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Install now
                </Link>
              </li>
              <li>
                <Link
                  className="inline-flex items-center px-4 py-2 mt-2 font-medium text-white transition duration-500 ease-in-out transform rounded-lg text-md md:mt-0 md:ml-4 bg-stone-800"
                  href="/"
                >
                  <span className="justify-center">Let's chat</span>
                  {/* <svg
                    className="w-3 h-3 fill-current text-gray-400 flex ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  > 
                    <path
                      d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                      fillRule="nonzero"
                    />
                  </svg> */}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
