# Bilder till tjänsteöversikten

## Mål

Lägg till verkliga arbetsbilder i takt med att Mateo levererar dem. Kunden ska se vilken tjänst varje bild hör till och vad arbetet innebär.

## Nuläge

På startsidan renderas fyra tjänstegrupper från `serviceGroups`. Varje post har ett namn och en beskrivning i en definitionslista. På dator visas två tjänster per rad. På mobil visas en. Varje kategori har en direktlänk.

## Filer

- `src/pages/index.astro` innehåller tjänsteposterna och mallen.
- `src/assets/tjanster/` blir platsen för lokala bildfiler när första bilden levereras.
- `src/styles/global.css` styr storlek och beskärning i tjänstelistan.
- `test/smoke.mjs` kontrollerar den byggda sidan.

## Genomförande när bilderna kommer

1. Be om originalfotot och namnet på tjänsten för varje bild. Lämpliga första motiv är rensning av en hängränna, pågående fasadtvätt, ett kök under flyttstädning och ett extraktionsmunstycke mot ett tygsäte. Liggande bilder med lite utrymme runt arbetsytan fungerar bäst.
2. Importera varje publiceringsklar bild från `src/assets/tjanster/`. Utöka den befintliga posten från `[namn, beskrivning]` till `[namn, beskrivning, bild?]`. Bildens fält är `src: ImageMetadata`, `alt: string` och valfritt `position: string` för CSS-egenskapen `object-position`. Alt-texten beskriver det som faktiskt syns, på svenska.
3. Rendera bilden efter beskrivningen i samma `dd`, endast för poster med bild. Använd `Image` från `astro:assets`, WebP, `loading="lazy"` och `decoding="async"`. Generera bredder på 320, 640 och 960 pixlar upp till originalets bredd. Inkludera originalbredden om den är mindre än 320. Sätt `sizes="(max-width: 620px) min(520px, calc(100vw - 24px)), (max-width: 980px) calc((100vw - 80px) / 2), 410px"`.
4. Visa bilden i postens bredd med proportionen 4:3 och `object-fit: cover`. Centrera motivet som standard. Justera `position` på den enskilda bilden om verktyget eller arbetsytan hamnar utanför utsnittet.

## Specialfall

En post utan foto består av rubrik och text. Bildytan och dess marginal skapas endast när posten har ett foto. Om kopplingen till en tjänst är oklar, invänta Mateos identifiering. Beskär eller välj ett annat foto om motivet inte går att urskilja på mobil.

## Validering

Kör `npm run build` följt av `npm test`. Lägg till en kontroll för den första avbildade tjänsten som verifierar alt-text, responsiva bildkällor och att bildfilen finns i byggresultatet. Öppna `/#tjanster` i förhandsvisningen och jämför bredderna 320, 390, 834 och 1440 pixlar med en blandning av tjänster med och utan foto.

## Godkänt resultat

Varje levererad bild hör till rätt text och laddas när besökaren närmar sig tjänsten. Motiv och text är läsbara vid alla fyra bredderna. Bildytan har rätt proportioner redan före laddning och samtliga fyra kategorilänkar fungerar.

## Antaganden

Första versionen visar högst ett foto per tjänst. Mateo levererar bilder som får publiceras. Nästa leverans kan omfatta en enda tjänst.
