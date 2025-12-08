import { screens } from "./router";

export type RouteName = keyof typeof screens;
const routes = Object.keys(screens) as RouteName[];

export const initialState = {
  screens: {
    A0: {
      statics: {
        title: "Tela de Login",
      },
    },
  },
  system: {},
  router: {
    current: routes[0] as RouteName,
    routes,
  },
};
