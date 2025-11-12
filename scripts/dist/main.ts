import { join } from "@std/path";
import { DIST_DIR, indexEntities } from "./common.ts";
import { exists } from "@std/fs";

if (await exists(DIST_DIR)) {
  await Deno.remove(DIST_DIR, { recursive: true });
}

const data = {
  "members": await indexEntities("members/"),
};

await Deno.writeTextFile(join(DIST_DIR, "index.json"), JSON.stringify(data));

Deno.exit(0);
