import { trpc } from "@/utils/trpc";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { accountAtom, endAtom, enterQueueAtom, indexAtom, store } from "./_app";

const Timer = () => {
  const [end, setEnd] = useAtom(endAtom);

  useEffect(() => {
    const x: any = setInterval(() => {
      if (end <= 0) return clearInterval(x);
      setEnd((prev) => (prev = prev - 1));
    }, 1000);

    return () => clearInterval(x);
  }, []);

  return <div>{end <= 0 ? "Time up" : end}</div>;
};

const Queue = () => {
  const [account, setAccount] = useAtom(accountAtom);
  const [index, setIndex] = useAtom(indexAtom);
  const [end, setEnd] = useAtom(endAtom);
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

  const renderUsers = () => {
    return query.data?.users.map((u) => (
      <div key={u.id}>
        <p className="text-white">{u.address}</p>
      </div>
    ));
  };

  useEffect(() => {
    const queryIndex = query.data?.users.findIndex(
      (u) => u.address === account
    );
    if (!queryIndex) return;
    setIndex(queryIndex);
  }, [query]);

  return (
    <div className=" absolute top-5 right-5 rounded-lg bg-[#333333] p-5">
      <h1>Your Position: {index}/1000</h1>
      <h1>Estimated Wait: {(index * 100) / 10} seconds</h1>
    </div>
  );
};

const Chat = () => {
  return (
    <div className="absolute bottom-5 p-2 right-5">
      <div className="w-[300px] h-[400px] flex justify-center relative rounded-lg bg-[#333333]">
        <input
          placeholder="What's up?"
          className="p-2 absolute bottom-3  w-[90%] bg-transparent border border-[#414141] rounded-lg"
        />
      </div>
    </div>
  );
};

export default function purchase() {
  const [end, setEnd] = useAtom(endAtom);
  const [index, setIndex] = useAtom(indexAtom);

  const router = useRouter();

  return (
    <div className="bg-[#212121] justify-between flex-col items-center h-screen p-24 flex">
      <Queue />
      {/* {index && index <= 3 && <Timer />} */}
      {index && index <= 3 && end > 0 && (
        <button className="text-white">Buy</button>
      )}
      <button className="text-white" onClick={() => router.back()}>
        Back
      </button>
      <Chat />
    </div>
  );
}
