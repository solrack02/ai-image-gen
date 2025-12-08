import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { initialState } from "./initialState";

export const useData = create(immer(() => ({ ...initialState })));
export const setData = useData.setState;
export const getCtData = useData.getState;

export const goTo = (path: string) =>
  setData((ct) => void (ct.router.current = path));
