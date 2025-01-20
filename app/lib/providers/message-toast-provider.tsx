"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Modal, Button, message } from "antd";
import { NoticeType } from "antd/es/message/interface";

// type SelectedContext = {
//   selected: string | null;
//   setSelected: React.Dispatch<React.SetStateAction<string | null>>;
// };

// const SelectedContext = createContext<SelectedContext | null>(null);

// export function SelectorProvider({ children }: { children: React.ReactNode }) {
//   const [selected, setSelected] = useState<string | null>(null);
//   return (
//     <SelectedContext.Provider
//       value={{
//         selected,
//         setSelected,
//       }}
//     >
//       {children}
//     </SelectedContext.Provider>
//   );
// }

// export function useSelectedContext() {
//   const context = useContext(SelectedContext);

//   if (!context) {
//     throw new Error(
//       "useSelectedContext must be used within a SelectedContextProvider"
//     );
//   }

//   return context;
// }

export type MessageFunction = (type: NoticeType, text: string) => void;

export const MessageContext = createContext<MessageFunction | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [toast, placement] = message.useMessage();

  const openToast: MessageFunction = (type, text) => {
    toast.open({
      type: type,
      content: text,
    });
  };

  return (
    <MessageContext.Provider value={openToast}>
      {placement}
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext() {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error(
      "useMessageContext must be used within a MessageContextProvider"
    );
  }

  return context;
}
