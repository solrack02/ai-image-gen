import React from "react";
import { useData } from ".";
import Chat from "../screens/chat";
import Home from "../screens/home";

export const screens = {
  home: Home,
  chat: Chat,
  teste: Chat,
} as const;

export const ActiveScreen = () => {
  const currentRoute = useData((ct) => ct.router.current);

  const ScreenComponent = screens[currentRoute];
  return <ScreenComponent />;
};
