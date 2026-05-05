import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { copyIfSafe, describeCopy } from "../src/lib/fs-safe.js";
import { sidecarFor } from "../src/lib/paths.js";

let tmp: string;
const SRC_NAME = "src.json";
const DST_NAME = "dst.json";

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cos-fssafe-"));
  fs.writeFileSync(path.join(tmp, SRC_NAME), JSON.stringify({ ok: true }));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("copyIfSafe — settings safety + sidecar logic", () => {
  it("missing source returns missing-source action", () => {
    const r = copyIfSafe(
      path.join(tmp, "nonexistent.json"),
      path.join(tmp, "out.json"),
      { mode: "always-sidecar" }
    );
    expect(r.action).toBe("missing-source");
  });

  it("always-sidecar: writes to sidecar even when dst doesn't exist", () => {
    const dst = path.join(tmp, "out", DST_NAME);
    const r = copyIfSafe(path.join(tmp, SRC_NAME), dst, {
      mode: "always-sidecar",
    });
    expect(r.action).toBe("wrote-sidecar");
    expect(fs.existsSync(sidecarFor(dst))).toBe(true);
    expect(fs.existsSync(dst)).toBe(false);
  });

  it("always-sidecar dry-run reports would-write-sidecar and writes nothing", () => {
    const dst = path.join(tmp, "out", DST_NAME);
    const r = copyIfSafe(path.join(tmp, SRC_NAME), dst, {
      mode: "always-sidecar",
      dryRun: true,
    });
    expect(r.action).toBe("would-write-sidecar");
    expect(fs.existsSync(sidecarFor(dst))).toBe(false);
    expect(fs.existsSync(dst)).toBe(false);
  });

  it("additive: writes directly when dst is empty", () => {
    const dst = path.join(tmp, "rules", "rule.md");
    fs.writeFileSync(path.join(tmp, SRC_NAME), "# rule");
    const r = copyIfSafe(path.join(tmp, SRC_NAME), dst, { mode: "additive" });
    expect(r.action).toBe("wrote");
    expect(fs.existsSync(dst)).toBe(true);
    expect(fs.existsSync(sidecarFor(dst))).toBe(false);
  });

  it("additive: falls back to sidecar when dst already exists", () => {
    const dst = path.join(tmp, "rules", "rule.md");
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, "existing user content");
    fs.writeFileSync(path.join(tmp, SRC_NAME), "operator stack content");
    const r = copyIfSafe(path.join(tmp, SRC_NAME), dst, { mode: "additive" });
    expect(r.action).toBe("wrote-sidecar");
    expect(fs.readFileSync(dst, "utf8")).toBe("existing user content");
    expect(fs.readFileSync(sidecarFor(dst), "utf8")).toBe("operator stack content");
  });

  it("additive dry-run with empty dst reports would-write", () => {
    const dst = path.join(tmp, "rules", "rule.md");
    const r = copyIfSafe(path.join(tmp, SRC_NAME), dst, {
      mode: "additive",
      dryRun: true,
    });
    expect(r.action).toBe("would-write");
    expect(fs.existsSync(dst)).toBe(false);
  });

  it("additive dry-run with existing dst reports would-write-sidecar", () => {
    const dst = path.join(tmp, "rules", "rule.md");
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, "existing");
    const r = copyIfSafe(path.join(tmp, SRC_NAME), dst, {
      mode: "additive",
      dryRun: true,
    });
    expect(r.action).toBe("would-write-sidecar");
    expect(fs.readFileSync(dst, "utf8")).toBe("existing");
    expect(fs.existsSync(sidecarFor(dst))).toBe(false);
  });

  it("chmod is applied to .sh hooks", () => {
    const dst = path.join(tmp, "hooks", "validate-commit-message.sh");
    fs.writeFileSync(path.join(tmp, SRC_NAME), "#!/usr/bin/env bash\necho hi\n");
    const r = copyIfSafe(path.join(tmp, SRC_NAME), dst, {
      mode: "additive",
      chmod: 0o755,
    });
    expect(r.action).toBe("wrote");
    const stat = fs.statSync(dst);
    // mode bitmask check — the high bits mean +x for owner
    expect(stat.mode & 0o100).toBe(0o100);
  });

  it("describeCopy returns a non-empty string for every action", () => {
    const actions = [
      { action: "missing-source", src: "/x" } as const,
      { action: "would-write", dst: "/x" } as const,
      { action: "wrote", dst: "/x" } as const,
      { action: "would-write-sidecar", dst: "/x.from-operator-stack" } as const,
      { action: "wrote-sidecar", dst: "/x.from-operator-stack" } as const,
    ];
    for (const a of actions) {
      const s = describeCopy(a);
      expect(s.length).toBeGreaterThan(0);
    }
  });
});
