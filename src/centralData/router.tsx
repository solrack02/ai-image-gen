import React from "react";
import { useData } from ".";
import { screens } from "./screens";

export const ActiveScreen = () => {
  const currentRoute = useData((ct) => ct.router.current);

  const ScreenComponent = screens[currentRoute];
  return <ScreenComponent />;
};
