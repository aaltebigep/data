import { join } from "@std/path";
import {
  DATA_DIR,
  emptyValidator,
  schemaValidator,
  validateEntities,
} from "./common.ts";

export const MEMBERS_DIR = join(DATA_DIR, "members/");

export async function validateMembers(): Promise<Map<string, string>> {
  return await validateEntities(
    MEMBERS_DIR,
    new Map(Object.entries({
      "profile.json": await schemaValidator("members/profile.schema.json"),
      "avatar.png": emptyValidator,
    })),
    new Set([
      "profile.json",
    ]),
  );
}
