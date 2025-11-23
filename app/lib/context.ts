import { ComponentType, createContext } from "preact";

interface PageType {
  page: ComponentType;
  setPage: (value: ComponentType) => void;
}

export const Page = createContext<PageType>({} as PageType);
