/**
 * Bug Condition Exploration Tests
 *
 * These tests MUST FAIL on unfixed code to confirm the bugs exist.
 *
 * Bug 1: POST/DELETE /api/professionals/session returns 404 (route file doesn't exist)
 * Bug 2: Image hostnames used in the codebase are not in next.config.ts remotePatterns
 *
 * Run with: npx ts-node --project tsconfig.json src/__tests__/bug-exploration.ts
 */

import fs from "fs";
import path from "path";

// ─── Minimal test harness ────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ ${name}`);
    console.error(`    → ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toContain(item: unknown) {
      if (!Array.isArray(actual) || !actual.includes(item)) {
        throw new Error(`Expected array to contain ${JSON.stringify(item)}, but it did not.\nArray: ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected: unknown) {
      const a = JSON.stringify(actual);
      const e = JSON.stringify(expected);
      if (a !== e) {
        throw new Error(`Expected ${e}, got ${a}`);
      }
    },
  };
}

function describe(suiteName: string, fn: () => void) {
  console.log(`\n${suiteName}`);
  fn();
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Bug Condition 1 — Session Route (POST/DELETE /api/professionals/session)", () => {
  const routePath = path.join(
    process.cwd(),
    "src/app/api/professionals/session/route.ts"
  );

  test(
    "POST /api/professionals/session: route file src/app/api/professionals/session/route.ts must exist",
    () => {
      const routeExists = fs.existsSync(routePath);
      // WILL FAIL on unfixed code — route file does not exist
      expect(routeExists).toBe(true);
    }
  );

  test(
    "DELETE /api/professionals/session: same route file must export a DELETE handler",
    () => {
      const routeExists = fs.existsSync(routePath);
      // WILL FAIL on unfixed code — route file does not exist
      expect(routeExists).toBe(true);

      if (routeExists) {
        const content = fs.readFileSync(routePath, "utf-8");
        const hasDeleteExport =
          content.includes("export async function DELETE") ||
          content.includes("export function DELETE");
        expect(hasDeleteExport).toBe(true);
      }
    }
  );
});

describe("Bug Condition 2 — Image Hostnames Missing from next.config.ts remotePatterns", () => {
  // Load next.config.ts via require (compiled JS in .next, or via ts-node)
  // We read the file directly and parse the remotePatterns to avoid import issues.
  const configPath = path.join(process.cwd(), "next.config.ts");
  const configContent = fs.readFileSync(configPath, "utf-8");

  // Extract all hostname values from remotePatterns using a regex
  const hostnameMatches = configContent.matchAll(/hostname:\s*"([^"]+)"/g);
  const configuredHostnames = new Set<string>();
  for (const match of hostnameMatches) {
    configuredHostnames.add(match[1]);
  }

  // Hostnames found by scanning all Image src attributes and img: fields in the codebase.
  // These are the concrete hostnames that appear in tsx/ts files as image sources.
  const hostnamesUsedInCodebase: Array<{ hostname: string; foundIn: string }> = [
    // CourseGridSection.tsx — img: "https://riseuplabs.com/..."
    { hostname: "riseuplabs.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://img.freepik.com/..."
    { hostname: "img.freepik.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://encrypted-tbn0.gstatic.com/..."
    { hostname: "encrypted-tbn0.gstatic.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://media.licdn.com/..."
    { hostname: "media.licdn.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://media.gettyimages.com/..."
    { hostname: "media.gettyimages.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://0.academia-photos.com/..."
    { hostname: "0.academia-photos.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://static.vecteezy.com/..."
    { hostname: "static.vecteezy.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://i.ytimg.com/..."
    { hostname: "i.ytimg.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://img-c.udemycdn.com/..."
    { hostname: "img-c.udemycdn.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://columncontent.com/..."
    { hostname: "columncontent.com", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://noemamag.imgix.net/..."
    { hostname: "noemamag.imgix.net", foundIn: "src/components/CourseGridSection.tsx" },
    // CourseGridSection.tsx — img: "https://images.unsplash.com/..."
    { hostname: "images.unsplash.com", foundIn: "src/components/CourseGridSection.tsx" },
    // VideoSlider.tsx — thumb: "https://img.youtube.com/..."
    { hostname: "img.youtube.com", foundIn: "src/components/VideoSlider.tsx" },
  ];

  for (const { hostname, foundIn } of hostnamesUsedInCodebase) {
    test(
      `hostname "${hostname}" (used in ${foundIn}) must be in next.config.ts remotePatterns`,
      () => {
        const hostnamesArray = Array.from(configuredHostnames);
        // WILL FAIL for any hostname not yet in remotePatterns
        expect(hostnamesArray).toContain(hostname);
      }
    );
  }

  test("no image hostname used in the codebase should be missing from remotePatterns", () => {
    const missing = hostnamesUsedInCodebase
      .filter(({ hostname }) => !configuredHostnames.has(hostname))
      .map(({ hostname, foundIn }) => `${hostname} (${foundIn})`);

    // WILL FAIL if any hostnames are missing
    expect(missing).toEqual([]);
  });
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log("\n─────────────────────────────────────────────────────────────────");
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
  console.log("\nCounterexamples (bugs confirmed):");
  failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
}

if (failed > 0) {
  console.log(
    "\n✓ EXPECTED: Tests failed on unfixed code — bugs are confirmed to exist."
  );
  process.exit(1); // non-zero exit so CI/scripts can detect failure
} else {
  console.log("\n✓ All tests passed — bugs have been fixed.");
  process.exit(0);
}
