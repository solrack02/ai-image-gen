import Chat from "../screens/chat";
import Editor from "../screens/editor";
import Home from "../screens/home";
import Policy from "../screens/policy";
import Rig2D from "../screens/rig2D";

export const screens = {
  editor: Editor,
  rig2D: Rig2D,
  home: Home,
  chat: Chat,
  policy: Policy,
} as const;

export type RouteName = keyof typeof screens;
export const routes = Object.keys(screens) as RouteName[];
