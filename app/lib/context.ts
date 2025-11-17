import { ComponentType, createContext } from "preact";

export const Page = createContext<ComponentType>(() => null);
