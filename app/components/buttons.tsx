"use client";

import { Button } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
// import { useSelectedContext } from "../lib/providers";
import { ReactNode, useEffect } from "react";

export function DeleteButton({ id, action }: { id: string; action: Function }) {
  return (
    <Button
      shape="circle"
      icon={<DeleteTwoTone />}
      onClick={() => action(id)}
    />
  );
}

// export function EditButton({ id, action }: { id: string; action: Function }) {
//   const { selected, setSelected } = useSelectedContext();

//   useEffect(() => {
//     console.log(selected);
//   }, [selected]);

//   return (
//     <Button
//       shape="circle"
//       icon={<EditTwoTone />}
//       onClick={() => setSelected(id)}
//     />
//   );
// }

export function ClientButton({ children, ...rest }: { children: ReactNode }) {
  return <Button {...rest}>{children}</Button>;
}
