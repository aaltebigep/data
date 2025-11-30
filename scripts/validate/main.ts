// SPDX-License-Identifier: 0BSD
// Copyright (c) 2025 AAL TEBİGEP, Sena

import { validateMembers } from "./members.ts";

const errors: Map<string, string> = new Map([
  ...await validateMembers(),
]);

if (errors.size) {
  for (const file of errors.keys()) {
    console.error(`${file}: ${errors.get(file)}`);
  }

  Deno.exit(1);
}

Deno.exit(0);
