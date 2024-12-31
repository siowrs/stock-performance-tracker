"use client";
import "@ant-design/v5-patch-for-react-19";

export default function AntdReact19Patch({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
