import { Outlet } from "react-router-dom";
import { VJHeader } from "../VJHeader";

export const Layout = () => {
  return (
    <>
      <VJHeader />
      <Outlet />
    </>
  );
};
