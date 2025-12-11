import Chat from "../screens/chat";
import Editor from "../screens/editor";
import Home from "../screens/home";
import Policy from "../screens/policy";

export const screens = {
  editor: Editor,
  home: Home,
  chat: Chat,
  policy: Policy,
} as const;

export type RouteName = keyof typeof screens;
export const routes = Object.keys(screens) as RouteName[];
