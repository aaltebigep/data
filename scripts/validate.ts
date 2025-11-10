import { join, relative } from "@std/path";
import { walk } from "@std/fs/walk";

import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv();
addFormats(ajv);

const typeDir = join(import.meta.dirname ?? "", "../types/");
const dataDir = join(import.meta.dirname ?? "", "../data/");

const compile = async (name: string) =>
  ajv.compile(JSON.parse(await Deno.readTextFile(join(typeDir, name))));
const schemas: { [key: string]: any } = {
  "profile.json": await compile("profile.json"),
};
const knownFiles = [
  "avatar.png",
];

const errors: { [key: string]: string } = {};
const inputs = walk(dataDir, {
  includeDirs: false,
  followSymlinks: true,
});

for await (const entry of inputs) {
  const file = relative(dataDir, entry.path);

  if (!entry.name.match(/.*\.json/)) {
    if (!knownFiles.includes(entry.name)) {
      errors[file] = `Unknown file "${entry.name}"`;
    }
    continue;
  }

  const schema = schemas[entry.name];
  if (!schema) {
    errors[file] = `Unknown data type "${entry.name}"`;
    continue;
  }

  const data = JSON.parse(await Deno.readTextFile(entry.path));
  if (!schema(data)) {
    for (const err of schema.errors) {
      errors[file] = `${
        err.instancePath ? `"${err.instancePath.slice(1)}" ` : ""
      }${err.message}`;
    }
    continue;
  }
}

if (Object.keys(errors).length) {
  for (const file in errors) {
    console.error(`${file}: ${errors[file]}`);
  }
  Deno.exit(1);
}

Deno.exit(0);
