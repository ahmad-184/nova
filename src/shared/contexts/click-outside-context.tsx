import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useOnClickOutside } from "usehooks-ts";

type Registry = {
  register: (ref: React.RefObject<HTMLElement>) => void;
};

const ClickOutsideContext = createContext<Registry | null>(null);

interface ProviderProps {
  onClickOutside: () => void;
  children: ReactNode;
}

export function ClickOutsideProvider({
  onClickOutside,
  children,
}: ProviderProps) {
  const refs = useRef<React.RefObject<HTMLElement>[]>([]);

  const register = useCallback((ref: React.RefObject<HTMLElement>) => {
    refs.current.push(ref);
  }, []);

  useOnClickOutside(refs.current, onClickOutside);

  return (
    <ClickOutsideContext.Provider value={{ register }}>
      {children}
    </ClickOutsideContext.Provider>
  );
}

export function useRegisterClickOutside<T>() {
  const ctx = useContext(ClickOutsideContext);
  if (!ctx) {
    throw new Error("useRegisterClickOutside must be inside a Provider");
  }

  const localRef = useRef<T | null>(null);

  useEffect(() => {
    ctx.register(localRef as React.RefObject<HTMLElement>);
  }, [ctx]);

  return localRef;
}
