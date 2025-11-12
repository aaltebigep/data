import { join } from "@std/path";
import { walk } from "@std/fs/walk";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

export type Validator = (dataPath: string) => Promise<string | undefined>;

export const DATA_DIR = join(import.meta.dirname ?? "", "../../data/");

export function emptyValidator(): Promise<string | undefined> {
  return new Promise((resolve, _) => resolve(undefined));
}

export async function schemaValidator(
  relativeSchemaPath: string,
): Promise<(dataPath: string) => Promise<string | undefined>> {
  const schema = ajv.compile(
    JSON.parse(await Deno.readTextFile(join(DATA_DIR, relativeSchemaPath))),
  );

  return async (dataPath: string) => {
    const data = JSON.parse(await Deno.readTextFile(dataPath));
    if (!schema(data) && schema.errors.length > 0) {
      const e = schema.errors[0];
      return `${
        e.instancePath ? `"#${e.instancePath.slice(1)}" ` : ""
      }${e.message}`;
    }
  };
}

async function validateEntity(
  relativePath: string,
  validatorMap: Map<string, Validator>,
  required?: Set<string>,
): Promise<Map<string, string>> {
  const errors: Map<string, string> = new Map();

  const found: Set<string> = new Set([]);
  const files = walk(join(DATA_DIR, relativePath), {
    includeDirs: false,
    followSymlinks: true,
  });

  for await (const data of files) {
    found.add(data.name);
    const file = join(relativePath, data.name);

    const validate = validatorMap.get(data.name);
    if (!validate) {
      errors.set(file, `unknown data file "${data.name}"`);
    } else {
      const err = await validate(data.path);
      if (err) errors.set(file, err);
    }
  }

  const missing = required?.difference(found);
  if (missing?.size) {
    errors.set(
      relativePath,
      `missing required data file "${missing.values().next().value}"`,
    );
  }

  return errors;
}

export async function validateEntities(
  relativePath: string,
  validatorMap: Map<string, Validator>,
  requiredFiles?: Set<string>,
): Promise<Map<string, string>> {
  let errors: Map<string, string> = new Map();

  for await (const entry of Deno.readDir(join(DATA_DIR, relativePath))) {
    if (entry.isFile) continue;

    const file = join(relativePath, entry.name);
    errors = new Map([
      ...errors,
      ...await validateEntity(file, validatorMap, requiredFiles),
    ]);
  }

  return errors;
}

export async function validateCollection(
  relativePath: string,
  validator: (dataPath: string) => Promise<string | undefined>,
  ignoredFiles?: Set<string>,
): Promise<Map<string, string>> {
  const errors: Map<string, string> = new Map();

  const files = walk(join(DATA_DIR, relativePath), {
    includeDirs: false,
    followSymlinks: true,
  });

  for await (const data of files) {
    if (ignoredFiles?.has(data.name)) continue;

    const err = await validator(data.path);
    if (err) errors.set(join(relativePath, data.name), err);
  }

  return errors;
}
