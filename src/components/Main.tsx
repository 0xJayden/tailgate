import { accountAtom, enterQueueAtom } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import { ethers } from "ethers";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Main() {
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
    <section className="text-gray-600 body-font">
      <div className="max-w-7xl mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 md:ml-24 pt-6 flex flex-col md:items-start md:text-left mb-40 items-center text-center">
          <h1 className="mb-5 sm:text-8xl text-5xl items-center Avenir xl:w-2/2 text-gray-900">
            Welcome to Tailgate, where the <a className="bg-[#D2F25C]">pre-party is the party</a>
          </h1>
          <p className="mb-4 xl:w-3/4 text-gray-600 text-lg">
            Tailgate helps NFT marketplaces put their customers and brand first 
          </p>
          <div className="flex justify-center">
            {/* <a
              className="inline-flex items-center px-5 py-3 mt-2 font-medium text-white transition duration-500 ease-in-out transform bg-transparent border rounded-lg bg-gray-900"
              href="https://github.com/r1/nine4-2/"
            > Purchase
            </a> */}
            <a
                  className="inline-flex items-center px-4 py-2 mt-2 font-medium text-white transition duration-500 ease-in-out transform rounded-lg text-md md:mt-0 bg-red-400"
                  onClick={() => web3Handler()}
                >
                  <span className="justify-center">View demo</span>
                  <svg
                    className="w-3 h-3 fill-current text-white-400 flex ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                      fillRule="nonzero"
                    />
                  </svg>
                </a>
            {/* {!account ? (<a
                  className="inline-flex items-center px-4 py-2 mt-2 font-medium text-white transition duration-500 ease-in-out transform rounded-lg text-md md:mt-0 bg-red-400"
                  onClick={() => web3Handler()}
                >
                  <span className="justify-center">Connect</span>
                  <svg
                    className="w-3 h-3 fill-current text-white-400 flex ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                      fillRule="nonzero"
                    />
                  </svg>
                </a>
                ) : (
                  <a
                  className="inline-flex items-center px-4 py-2 mt-2 font-medium text-white transition duration-500 ease-in-out transform rounded-lg text-md md:mt-0 bg-blue-400"
                  onClick={() => {
                    setEnterQueue(true);
                    router.push("/purchase");
                  }}
                >
                  <span className="justify-center">Purchase</span>
                  <svg
                    className="w-3 h-3 fill-current text-white-400 flex ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                      fillRule="nonzero"
                    />
                  </svg>
                </a>)} */}
          </div>
        </div>
        {/* <div className="xl:mr-44 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-48 md:pl-10">
          <img
            className="w-80 md:ml-1 ml-24"
            alt="iPhone-12"
            src="/images/iPhone-12-Mockup.png"
          ></img>
        </div> */}
      </div>
      <section className="mx-auto">
        <div className="container px-5 mx-auto lg:px-24 ">
          <div className="flex flex-col w-full mb-4 text-left lg:text-center">
            <h1 className="mb-8 text-2xl Avenir font-semibold text-black">
              Top-tier NFT marketplaces who have expressed interest
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-16 mb-16 text-center lg:grid-cols-4">
            <div className="flex items-center justify-center">
              <img
                src="/images/ethercity-logo.png"
                alt="Google Logo"
                className="block object-contain h-16 greyC"
              ></img>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/images/Shopify-Logo.svg"
                alt="Shopify Logo"
                className="block object-contain h-16 greyC"
              ></img>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/images/Cloudflare-Logo.svg"
                alt="Cloudflare Logo"
                className="block object-contain h-16 greyC"
              ></img>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/images/PayPal-Logo.png"
                alt="Paypal Logo"
                className="block object-contain h-16 greyC"
              ></img>
            </div>
          </div>
        </div>
      </section>
      <div className="grr max-w-7xl pt-20 mx-auto text-center">
        <h1 className="mb-8 text-6xl Avenir font-semibold text-gray-900">
          Less code, less effort.
        </h1>
        <h1 className="mb-8 text-2xl Avenir font-semibold text-gray-600 text-center">
          Minify your CSS with Tailwind's built in PostCSS support.
        </h1>
        <div className="container flex flex-col items-center justify-center mx-auto rounded-lg ">
          <img
            className="object-cover object-center w-3/4 mb-10 g327 border rounded-lg shadow-md"
            alt="Placeholder Image"
            src="./images/placeholder.png"
          ></img>
        </div>
      </div>
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="py-24 md:py-36">
            <h1 className="mb-5 text-6xl Avenir font-semibold text-gray-900">
              Subscribe to our newsletter
            </h1>
            <h1 className="mb-9 text-2xl font-semibold text-gray-600">
              Enter your email address and get our newsletters straight away.
            </h1>
            <input
              placeholder="jack@example.com"
              name="email"
              type="email"
              autoComplete="email"
              className="border border-gray-600 w-1/4 pr-2 pl-2 py-3 mt-2 rounded-md text-gray-800 font-semibold hover:border-gray-900"
            ></input>{" "}
            <a
              className="inline-flex items-center px-14 py-3 mt-2 ml-2 font-medium text-white transition duration-500 ease-in-out transform bg-transparent border rounded-lg bg-gray-900"
              href="/"
            >
              <span className="justify-center">Subscribe</span>
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
