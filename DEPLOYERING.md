# Publisering av Bamora på Cloudflare Pages

Anbefalt oppsett: GitHub + Cloudflare Pages. Da kan siden oppdateres videre ved at vi endrer filer her, committer og pusher til GitHub. Cloudflare publiserer automatisk ny versjon.

## 1. Første gang: legg prosjektet på GitHub

1. Gå til https://repo.new
2. Lag et nytt repository, for eksempel `bamora-nettside`.
3. Hold det gjerne `Private`.
4. Ikke legg til README, .gitignore eller license i GitHub når du lager repoet.
5. Kopier repo-URL-en, for eksempel:

   ```txt
   https://github.com/BRUKERNAVN/bamora-nettside.git
   ```

Kjør deretter dette i prosjektmappen, men bytt URL:

```powershell
git remote add origin https://github.com/BRUKERNAVN/bamora-nettside.git
git push -u origin main
```

Hvis du vil at Codex skal gjøre dette for deg senere, send meg repo-URL-en.

### Hvis GitHub sier 403 / feil konto

Maskinen kan være innlogget med en annen GitHub-konto enn den som eier repoet. Sjekk kontoene slik:

```powershell
git credential-manager github list
```

Logg ut feil konto, for eksempel:

```powershell
git credential-manager github logout hoffmonika817-cyber
```

Logg inn med riktig konto:

```powershell
git credential-manager github login
```

Når innloggingen er ferdig i nettleseren, push på nytt:

```powershell
git push -u origin main
```

## 2. Koble GitHub til Cloudflare Pages

1. Logg inn i Cloudflare.
2. Gå til `Workers & Pages`.
3. Velg `Create application`.
4. Velg `Pages`.
5. Velg `Connect to Git`.
6. Velg GitHub-repoet `bamora-nettside`.
7. Bruk disse innstillingene:

| Felt | Verdi |
| --- | --- |
| Project name | `bamora` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `/` |
| Root directory | tom / ikke fyll ut |

Når du trykker deploy får du en midlertidig adresse som typisk blir:

```txt
https://bamora.pages.dev
```

## 3. Senere oppdateringer

Når vi endrer nettsiden videre:

```powershell
git add .
git commit -m "Oppdater Bamora-nettsiden"
git push
```

Cloudflare publiserer automatisk etter push.

## 4. Kjapp manuell publisering med Wrangler

Dette kan brukes til rask test hvis du ikke vil sette opp GitHub med én gang:

```powershell
wrangler login
npm run deploy:cloudflare
```

Merk: Hvis du starter et Cloudflare Pages-prosjekt som Direct Upload, kan ikke samme prosjekt senere byttes til Git-integrasjon. For et prosjekt som skal videreutvikles er GitHub-kobling derfor smartest.

## 5. Domene senere

Når du har kjøpt eller valgt domene:

1. Gå til Cloudflare → `Workers & Pages`.
2. Åpne Pages-prosjektet `bamora`.
3. Gå til `Custom domains`.
4. Velg `Set up a domain`.
5. Skriv inn domenet, for eksempel `bamora.no` eller `www.bamora.no`.
6. Følg Cloudflare sin DNS-veiviser.

Hvis det er hoveddomenet, for eksempel `bamora.no`, må domenet normalt ligge i Cloudflare DNS med Cloudflare-navnetjenere. For et subdomene, for eksempel `sokker.dittdomene.no`, kan du ofte bruke CNAME.
