import { routes, RouteName } from "./screens";

export const initialState = {
  screens: {
    A0: {
      statics: {
        title: "Tela de Login",
      },
    },
  },
  system: {
    generation: {
      prompt: "",
      images: [] as string[],
    },
  },
  router: {
    current: routes[0] as RouteName,
    routes,
  },
};
