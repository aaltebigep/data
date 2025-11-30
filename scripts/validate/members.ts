// SPDX-License-Identifier: 0BSD
// Copyright (c) 2025 AAL TEBİGEP, Sena

import { emptyValidator, schemaValidator, validateEntities } from "./common.ts";

export async function validateMembers(): Promise<Map<string, string>> {
  return await validateEntities(
    "members/",
    new Map(Object.entries({
      "profile.json": await schemaValidator("members/profile.schema.json"),
      "avatar.png": emptyValidator,
    })),
    new Set([
      "profile.json",
    ]),
  );
}
