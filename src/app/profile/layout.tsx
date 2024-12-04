// wrap suspense around the component

import React, { ReactNode } from "react";
import { Suspense } from "react";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const Layout = ({ children }: Props) => {
  return <Suspense>{children}</Suspense>;
};

export default Layout;
