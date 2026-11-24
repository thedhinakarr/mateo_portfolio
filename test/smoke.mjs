import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("dist/index.html", "utf8");
const css = readFileSync("src/styles/global.css", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

assert.ok(pkg.dependencies.astro, "Astro dependency is required");
assert.ok(existsSync("public/images/mateo-reference.png"), "reference photo must be available");
assert.ok(existsSync("public/images/mat-hero.jpg"), "hero cleaning photo must be available");
assert.ok(existsSync("public/images/mat-roof.jpg"), "roof cleaning photo must be available");
assert.ok(existsSync("public/images/raccoon-480.jpg"), "optimized brand mascot must be available");
assert.match(page, /mat-hero\.jpg/, "hero should use the new cleaning photo");
assert.match(page, /mat-roof\.jpg/, "proof section should use the second cleaning photo");
assert.match(page, /raccoon-480\.jpg/, "page should use the optimized brand mascot");
assert.match(page, /Tvättbjörnen/i, "page should identify the cleaning company");
assert.match(page, /Mateo Jönsson/i, "page should identify Mateo");
assert.match(page, /Kostnadsfri offert/i, "page should include the lead CTA");
assert.match(page, /Erbjudande tak/i, "page should include the roof offer");
assert.match(page, /Erbjudande fasad/i, "page should include the facade offer");
assert.match(page, /4 900,-/, "page should include the roof offer price");
assert.match(page, /3 900,-/, "page should include the facade offer price");
assert.match(page, /Utbildad och certifierad/i, "page should communicate Mateo's qualifications");
assert.match(page, /Hållbarhet i praktiken/i, "page should include the sustainability section");
assert.match(page, /Rätt metod\. Längre livslängd<br>för ytan\./i, "sustainability heading should break before för ytan");
assert.match(page, /För mig är kunden alltid kung/i, "page should include the ad quote");
assert.match(page, /mateojonsson@outlook\.com/i, "page should include the company email");
assert.match(page, /Tydliga priser, tydliga resultat/i, "page should use the revised offer heading");
const gallery = page.match(/<section\b[^>]*\bid="arbetsbilder"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? "";
const photos = [...gallery.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
assert.equal(photos.length, 11, "gallery should contain the eleven selected work photos");
const sources = photos.map(tag => {
  assert.match(tag, /alt="[^"]+"/, "each work photo needs a description");
  assert.match(tag, /srcset="[^"]+ 320w[^"]+"/, "each photo needs responsive sizes");
  const src = tag.match(/\bsrc="([^"]+\.webp)"/)?.[1];
  assert.ok(src && existsSync(`dist${src}`), "each photo must have a built WebP asset");
  return src;
});
assert.equal(new Set(sources).size, photos.length, "work photos should be unique");
for (const id of ["utomhustjanster", "fasadtvatt", "stadning", "bilvard"]) {
  assert.ok(page.includes(`href="#${id}"`) && page.includes(`<h3 id="${id}">`), `service link must lead to the ${id} heading`);
}
assert.match(page, /Behöver du hjälp med andra jobb runt huset\? Tveka inte att fråga\./i, "page should use the revised service note");
assert.match(page, /så återkommer jag med nästa steg/i, "page should use first-person contact copy");
assert.match(page, /Metoderna är hållbara/i, "page should use the revised sustainability wording");
assert.match(page, /Om mig/i, "page should use first-person about copy");
assert.match(page, /Jag ser till att leverera det som lovats/i, "page should use the revised quality promise");
assert.match(page, /Gör så här/i, "page should use the revised process heading");
assert.match(page, /Jag bedömer yta/i, "page should use first-person process copy");
assert.match(page, /Du blir nöjd/i, "page should use the revised final step");
assert.match(page, /subject=Kostnadsfri%20offertf%C3%B6rfr%C3%A5gan/i, "email actions should include the quote-request subject");
assert.match(page, /body=Hej%20Mateo/i, "email actions should include the quote-request template");
const outgoingLinks = [...page.matchAll(/<a\b[^>]+href="(?:mailto:|https?:\/\/)[^"]*"[^>]*>/gi)];
assert.ok(outgoingLinks.length >= 4, "page should include the expected outgoing links");
for (const [link] of outgoingLinks) {
  assert.match(link, /target="_blank"/i, "outgoing links must open in a new tab");
  assert.match(link, /rel="noopener noreferrer"/i, "outgoing links must isolate the opener");
}
assert.doesNotMatch(page, /6 900,-/, "old roof offer price must be removed");
assert.doesNotMatch(page, /073-00 00 00|0730000000/i, "placeholder phone number must be removed");
assert.doesNotMatch(page, /079-351 59 89|tel:/i, "phone references must be removed");
assert.doesNotMatch(page, /info@tvattbjorne\.se/i, "placeholder email must be removed");
assert.doesNotMatch(page, /Klara priser\. Klart resultat/i, "old offer heading must be removed");
assert.doesNotMatch(page, /ex måleri|så återkommer Mateo/i, "superseded copy must be removed");
assert.doesNotMatch(page, /mossa/i, "facade copy should use påväxt instead of mossa");
assert.doesNotMatch(page, /Längre liv för ytan/i, "old sustainability heading must be removed");
assert.doesNotMatch(page, /I tid och som lovat/i, "removed hero proof must stay removed");
assert.doesNotMatch(page, /Utbildad och certifierad specialrengöring för privatpersoner/i, "removed hero lead must stay removed");
assert.match(css, /@media\s*\(max-width:\s*980px\)/, "tablet layout must be defined");
assert.match(css, /@media\s*\(max-width:\s*620px\)/, "mobile layout must be defined");
assert.match(css, /#18733a/, "accessible dark green must be used");
assert.match(css, /#a94f12/, "accessible dark orange must be used");

console.log("✅ All smoke tests passed.");
