"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { type Persistor, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { AppStore, makeStore } from "../redux/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);
  const persistorRef = useRef<Persistor>(undefined);

  if (!storeRef.current) {
    const store = makeStore();
    storeRef.current = store;
    persistorRef.current = persistStore(store);
  }

  if (!storeRef.current || !persistorRef.current) return children;

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
}
