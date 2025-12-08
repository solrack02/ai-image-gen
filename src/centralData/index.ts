import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { initialState, RouteName } from "./initialState";

type AppState = typeof initialState;

const cloneInitialState = (): AppState =>
  JSON.parse(JSON.stringify(initialState)) as AppState;

export const useData = create<AppState>()(immer(() => cloneInitialState()));
export const setData = useData.setState;
export const getCtData = useData.getState;

export const goTo = (path: RouteName) =>
  setData((ct) => void (ct.router.current = path));
