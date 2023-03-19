import { trpc } from "@/utils/trpc";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { accountAtom, endAtom, enterQueueAtom, indexAtom, store } from "./_app";
import img1 from "@/assets/images/bruce-lee.jpg";
import img2 from "@/assets/images/cash-cash.jpg";
import img3 from "@/assets/images/de-lorean.jpg";
import img4 from "@/assets/images/manny.jpg";
import img5 from "@/assets/images/nft.png";
import logo from "@/assets/images/logo.png";

const Timer = () => {
  const [end, setEnd] = useAtom(endAtom);
  const [account, setAccount] = useAtom(accountAtom);
  const [minted, setMinted] = useState(false);

  const mutation = trpc.removeUser.useMutation();

  const router = useRouter();

  const mint = () => {
    setMinted(true);
    const x = setInterval(() => {
      mutation.mutate({ address: account });
      setAccount("");
      setEnd(200);
      setMinted(false);
      clearInterval(x);
      router.push("/");
    }, 2000);
  };

  const leave = () => {
    mutation.mutate({ address: account });
    setAccount("");
    router.push("/");
  };

  useEffect(() => {
    const x: any = setInterval(() => {
      if (end <= 0) return clearInterval(x);
      setEnd((prev) => (prev = prev - 1));
    }, 1000);

    return () => clearInterval(x);
  }, []);

  if (minted)
    return (
      <div className="text-white flex flex-col z-20 justify-center backdrop-brightness-50 backdrop-blur p-2 absolute left-0 right-0 bottom-0 top-0 text-center">
        <p className="text-white text-3xl font-bold">Congrats on the mint!</p>
        <p className="text-[#e0e0e0]">Exiting queue...</p>
      </div>
    );

  return (
    <div className="text-white flex flex-col z-20 justify-center backdrop-brightness-50 backdrop-blur p-2 absolute left-0 right-0 bottom-0 top-0 text-center">
      <div className="space-y-8 flex flex-col items-center">
        <div>
          <p className="text-5xl">You're in & ready to mint!</p>
          <p className=" pt-2 text-[#e0e0e0]">You better hurry...</p>
        </div>
        <div>
          <p className="font-bold text-2xl">
            {end <= 0 ? "Time up" : end + " s"}
          </p>
          <p className=" text-[#e0e0e0]">Remaining</p>
        </div>
        <div className="flex flex-col space-y-4 items-center w-1/4">
          <button
            onClick={() => mint()}
            className="p-2 shadow-xl px-6 sm:px-0 sm:w-[50%] rounded-lg bg-[#21ace6] text-white"
          >
            Mint
          </button>
          <button onClick={() => leave()}>Leave</button>
        </div>
      </div>
    </div>
  );
};

const Queue = () => {
  const [account, setAccount] = useAtom(accountAtom);
  const [index, setIndex] = useAtom(indexAtom);
  const [end, setEnd] = useAtom(endAtom);
  const [width, setWidth] = useState(100);

  const query = trpc.getUsers.useQuery();

  const router = useRouter();

  const mutation = trpc.removeUser.useMutation();
  store.sub(endAtom, () => {
    if (end <= 0) {
      mutation.mutate({ address: account });
      setAccount("");
      router.push("/");
    }
  });

  useEffect(() => {
    if (!account) {
      mutation.mutate({ address: account });
      router.push("/");
    }

    const queryIndex = query.data?.users.findIndex(
      (u) => u.address === account
    );
    if (!queryIndex) return;
    setIndex(queryIndex);
  }, [query]);

  return (
    <div className=" absolute items-center justify-between flex bottom-5 sm:bottom-10 w-[95%] rounded-lg bg-[#212121] p-2 sm:p-5">
      <div className="sm:space-x-20 z-10 space-x-8 flex">
        <div>
          <h1 className="font-bold text-center text-white sm:text-3xl">
            {query.data?.users.findIndex((u) => u.address === account)}/1000
          </h1>
          <h1 className="text-[#e0e0e0] text-sm text-center tracking-wider sm:text-base">
            POSITION
          </h1>
        </div>
        <div>
          <h1 className="font-bold text-center text-white sm:text-3xl">
            {query.data &&
              (query.data?.users.findIndex((u) => u.address === account) *
                100) /
                10}{" "}
            s
          </h1>
          <h1 className="text-[#e0e0e0] text-center tracking-wider text-sm sm:text-base">
            ESTIMATED WAIT
          </h1>
        </div>
      </div>
      <div className="z-10">
        <p className="text-[#e0e0e0] hidden sm:inline text-sm sm:text-base">
          Wallet: {account}
        </p>
        <p className="text-[#e0e0e0] sm:hidden text-sm sm:text-base">
          Wallet: {account.substring(0, 6)}...
        </p>
        <p className="text-[#e0e0e0] text-end text-xs sm:text-base">
          Powered by <span className="font-bold">Tailgate</span>
        </p>
      </div>
      {width > 0 && (
        <div
          style={{
            width:
              query.data &&
              (
                100 - query.data?.users.findIndex((u) => u.address === account)
              ).toString() + "%",
          }}
          className={`absolute bg-[#21ace6] opacity-90 top-0 bottom-0 left-0 rounded-lg`}
        ></div>
      )}
    </div>
  );
};

const Chat = () => {
  const [account, setAccount] = useAtom(accountAtom);
  const [message, setMessage] = useState("");

  const mutation = trpc.sendMessage.useMutation();

  const query = trpc.getMessages.useQuery(undefined, { refetchInterval: 2000 });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const send = () => {
    if (message === "") return;

    mutation.mutate({ message, address: account });
    setMessage("");
  };

  useEffect(scrollToBottom, [query]);

  return (
    <>
      <div className="absolute bottom-[90px] sm:w-[30%] sm:right-9 w-[95%] backdrop-brightness-[20%] sm:bottom-[150px] h-[300px] sm:h-[400px] pb-3 rounded-lg overflow-scroll">
        <div className="sm:w-[300px] p-2 space-y-[3px] flex flex-col justify-end pb-10 relative">
          {query.data?.messages.map((m) => (
            <div
              className="w-full text-white flex space-x-2 p-1 rounded"
              key={m.id}
            >
              <p className="font-bold">{m.userAddress?.substring(0, 5)}...:</p>
              <p>{m.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <input
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === "Enter") return;

          if (e.key === "Enter") {
            e.preventDefault();
            send();
          }
        }}
        onChange={(e) => setMessage(e.target.value)}
        value={message ? message : ""}
        placeholder="What's up?"
        className="p-2 fixed outline-none text-white bottom-[100px] backdrop-blur sm:bottom-[158px] w-[92%] sm:w-[29%] bg-transparent sm:right-10 border border-[#414141] rounded-full"
      />
    </>
  );
};

const Content = () => {
  const data = [
    {
      image: <Image className="h-full object-cover w-full" src={img1} alt="" />,
      id: 1,
    },
    {
      image: <Image className="h-full object-cover w-full" src={img2} alt="" />,
      id: 2,
    },
    {
      image: <Image className="h-full object-cover w-full" src={img3} alt="" />,
      id: 3,
    },
    {
      image: <Image className="h-full object-cover w-full" src={img4} alt="" />,
      id: 4,
    },
    {
      image: <Image className="h-full object-cover w-full" src={img5} alt="" />,
      id: 5,
    },
  ];

  return (
    <div className="w-full pt-12 sm:pt-20 space-y-4">
      {data.map((i) => (
        <div key={i.id} className="h-[800px] w-auto rounded-lg overflow-hidden">
          {i.image}
        </div>
      ))}
    </div>
  );
};

export default function purchase() {
  const [end, setEnd] = useAtom(endAtom);
  const [index, setIndex] = useAtom(indexAtom);
  const [account, setAccount] = useAtom(accountAtom);

  const router = useRouter();

  return (
    <div className="bg-[#1e1e22] overflow-scroll justify-between flex-col items-center h-screen p-5 flex">
      <div className="absolute justify-between pr-5 top-0 flex sm:space-x-8 items-center bg-[#1E1E23] w-full">
        <Image className="sm:max-w-[300px] max-w-[200px]" src={logo} alt="" />
        <h1 className="font-bold sm:text-3xl text-xl text-white">Tailgate</h1>
      </div>
      <Content />
      <Queue />
      <Chat />
      {index && index <= 4 && <Timer />}
    </div>
  );
}
