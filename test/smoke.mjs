import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("dist/index.html", "utf8");
const css = readFileSync("src/styles/global.css", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

assert.ok(pkg.dependencies.astro, "Astro dependency is required");
assert.ok(existsSync("public/images/mateo-reference.png"), "reference photo must be available");
assert.ok(existsSync("public/images/mat-hero.jpg"), "hero cleaning photo must be available");
assert.ok(existsSync("public/images/mat-roof.jpg"), "roof cleaning photo must be available");
assert.match(page, /mat-hero\.jpg/, "hero should use the new cleaning photo");
assert.match(page, /mat-roof\.jpg/, "proof section should use the second cleaning photo");
assert.match(page, /Tvättbjörne/i, "page should identify the cleaning company");
assert.match(page, /tak, fasad, altan, mark, mur och textil/i, "page should list the ad services");
assert.match(page, /Kostnadsfri offert/i, "page should include the lead CTA");
assert.match(page, /Erbjudande tak/i, "page should include the roof offer");
assert.match(page, /Erbjudande fasad/i, "page should include the facade offer");
assert.match(page, /För mig är kunden alltid kung/i, "page should include the ad quote");
assert.match(page, /info@tvattbjorne\.se/i, "page should include company email");
assert.match(page, /hero-grid/i, "page should use the hero grid layout");
assert.match(css, /@media\s*\(max-width:\s*980px\)/, "tablet layout must be defined");
assert.match(css, /#2f9d46/, "green accent from reference should be used");
assert.match(css, /#d47d22/, "orange accent from reference should be used");

console.log("✅ All smoke tests passed.");
