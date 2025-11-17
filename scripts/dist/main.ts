import { join } from "@std/path";
import { DIST_DIR, indexEntities, provideSchemas } from "./common.ts";

const data = {
  "members": await indexEntities("members/"),
};

await Deno.writeTextFile(join(DIST_DIR, "index.json"), JSON.stringify(data));

await provideSchemas();

Deno.exit(0);
