import * as path from "@std/path";
import { walk } from "@std/fs/walk";

import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv();
addFormats(ajv);

const addType = async (name: string) =>
  ajv.addSchema(
    JSON.parse(
      await Deno.readTextFile(
        path.join(import.meta.dirname, `../types/${name}`),
      ),
    ),
    name,
  );

await addType("profile.json");

let errors = {};

const files = walk(path.join(import.meta.dirname, "../data"), {
  includeDirs: false,
  followSymlinks: true,
});

for await (const entry of files) {
  if (!entry.name.match(/.*\.json/)) {
    console.log(`Media: ${entry.name}`);
    continue;
  }

  const schema = ajv.getSchema(
    `http://aaltebigep.github.io/data/types/${entry.name}`,
  );

  if (!schema) {
    errors[entry.path] = `Unknown data type \`${entry.name}'`;
  }

  console.log(
    ajv.getSchema("http://aaltebigep.github.io/data/types/profile.json"),
  );
}

console.log(errors);
