import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { initialState } from "./initialState";

export const useData = create(immer(() => ({ ...initialState })));
export const setData = useData.setState;
export const getCtData = useData.getState;
