// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2025 AAL TEBİGEP, Sena

import { ComponentType, createContext } from "preact";

interface PageType {
  page: ComponentType;
  setPage: (value: ComponentType) => void;
}

export const Page = createContext<PageType>({} as PageType);
