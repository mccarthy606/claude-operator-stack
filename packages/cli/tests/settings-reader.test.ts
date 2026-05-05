import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { readSettings } from "../src/lib/settings-reader.js";

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cos-settings-"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("readSettings", () => {
  it("returns missing when settings.json absent", () => {
    const r = readSettings(tmp);
    expect(r.kind).toBe("missing");
  });

  it("returns ok with parsed object when file is valid", () => {
    fs.writeFileSync(
      path.join(tmp, "settings.json"),
      JSON.stringify({ env: { X: "1" } })
    );
    const r = readSettings(tmp);
    expect(r.kind).toBe("ok");
    if (r.kind === "ok") expect(r.settings.env).toEqual({ X: "1" });
  });

  it("returns unparsable when JSON is malformed", () => {
    fs.writeFileSync(path.join(tmp, "settings.json"), "{ not json");
    const r = readSettings(tmp);
    expect(r.kind).toBe("unparsable");
  });

  it("returns unparsable when file is JSON-valid but not an object", () => {
    fs.writeFileSync(path.join(tmp, "settings.json"), "[]");
    const r = readSettings(tmp);
    expect(r.kind).toBe("unparsable");
  });

  it("returns unparsable when file is null", () => {
    fs.writeFileSync(path.join(tmp, "settings.json"), "null");
    const r = readSettings(tmp);
    expect(r.kind).toBe("unparsable");
  });
});
