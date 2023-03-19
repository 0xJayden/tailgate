import "@/styles/globals.css";
import { atom, createStore, Provider } from "jotai";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";

export const store = createStore();

export const enterQueueAtom = atom(false);
export const accountAtom = atom("");
export const indexAtom = atom(99);
export const endAtom = atom(100);
store.set(enterQueueAtom, false);
store.set(accountAtom, "");
store.set(indexAtom, 999);
store.set(endAtom, 10);

const App: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default trpc.withTRPC(App);
