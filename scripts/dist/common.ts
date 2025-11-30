import { walk } from "@std/fs/walk";
import { dirname, join, relative } from "@std/path";
import { copy } from "@std/fs";

export const DATA_DIR = join(import.meta.dirname!, "../../data/");
export const DIST_DIR = join(import.meta.dirname!, "../../dist/");

export async function provideSchemas(writeIndex: boolean = true) {
  const files = walk(DATA_DIR, {
    includeDirs: false,
    followSymlinks: true,
  });

  const schemas: { [key: string]: string } = {};

  for await (const entry of files) {
    if (entry.name.match(/^.*\.?schema\.json$/)) {
      const path = relative(DATA_DIR, entry.path);
      await Deno.mkdir(join(DIST_DIR, dirname(path)), { recursive: true });
      await copy(entry.path, join(DIST_DIR, path));
      schemas[path] = JSON.parse(await Deno.readTextFile(join(DIST_DIR, path)));
    }
  }

  if (writeIndex) {
    await Deno.writeTextFile(
      join(DIST_DIR, "/schemas.json"),
      JSON.stringify(schemas),
    );
  }
}

export async function indexEntities(
  relativePath: string,
  writeIndex: boolean = true,
  copyFiles: boolean = true,
): Promise<{ [key: string]: any }> {
  const index: { [key: string]: any } = {};
  const path = join(DATA_DIR, relativePath);

  if (writeIndex || copyFiles) {
    await Deno.mkdir(join(DIST_DIR, relativePath), { recursive: true });
  }

  for await (const entry of Deno.readDir(path)) {
    if (entry.isFile) continue;

    const entity: { [key: string]: any } = { otherFiles: [] };
    const files = walk(join(path, entry.name), {
      includeDirs: false,
      followSymlinks: true,
    });

    if (copyFiles) {
      await copy(
        join(path, entry.name),
        join(DIST_DIR, relativePath, entry.name),
      );
    }

    for await (const data of files) {
      if (data.name.match(/^.+\.json$/)) {
        entity[data.name.slice(0, -5)] = JSON.parse(
          await Deno.readTextFile(data.path),
        );
      } else {
        entity.otherFiles.push(data.name);
      }
    }

    index[entry.name] = entity;
  }

  if (writeIndex) {
    await Deno.writeTextFile(
      join(DIST_DIR, relativePath, "/index.json"),
      JSON.stringify(index),
    );
  }

  return index;
}

export async function indexCollection(
  relativePath: string,
  ignoredFiles?: Set<string>,
  writeIndex: boolean = true,
  copyFiles: boolean = true,
): Promise<{ [key: string]: any }> {
  const index: { [key: string]: string } = {};
  const files = walk(join(DATA_DIR, relativePath), {
    includeDirs: false,
    followSymlinks: true,
  });

  if (writeIndex || copyFiles) {
    await Deno.mkdir(join(DIST_DIR, relativePath), { recursive: true });
  }

  for await (const data of files) {
    if (ignoredFiles?.has(data.name)) continue;

    index[data.name.slice(0, -5)] = JSON.parse(
      await Deno.readTextFile(data.path),
    );

    if (copyFiles) {
      await copy(data.path, join(DIST_DIR, relativePath, data.name));
    }
  }

  if (writeIndex) {
    await Deno.writeTextFile(
      join(DIST_DIR, relativePath, "/index.json"),
      JSON.stringify(index),
    );
  }

  return index;
}
