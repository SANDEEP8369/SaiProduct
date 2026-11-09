# Construction equipment website (React + Vite)

A photo-first catalog site in yellow and white for selling equipment, with optional rental and an admin panel for adding equipment.

## Run it

```bash
npm install
npm run dev        # development at http://localhost:5173
npm run build      # production files in dist/
```

Upload everything inside `dist/` to any static host (Netlify, Vercel, GitHub Pages, cPanel, etc.).

## Make it look real: add your own photos

1. Open `your-site/#/admin` (default password: **admin123**).
2. **Equipment > Edit**: add up to 6 photos per machine. The first is the cover.
3. **Business details**: add a wide homepage photo, photos of jobs on site, your key numbers and customer reviews.

Tips: shoot in daylight, landscape orientation, the whole machine in frame, plus a close-up of the controls or plate.
Machines with no photo show an illustration with a "Photo coming soon" tag.

## Selling and renting

- Selling is the main offer: every machine shows its sale price, condition (new, used, refurbished) and stock status.
- Rental is optional per machine. Tick "Also available for rent" and enter a rent price per hour, day or month. Those machines get an "Also for rent" badge and a smaller "Or rent from" price.
- To launch without rental, or to switch it on later, use **Business details > We also offer equipment on rent**. When off, all rental prices, the Buy/Rent filter and the rental section disappear. Your per-machine rental details are kept.
- The quote form asks the customer whether they want to buy or rent.

## What helps bring in enquiries

- WhatsApp and call buttons everywhere, plus a sticky Call / WhatsApp bar on phones
- "Get a quote" form that opens WhatsApp with the customer's details filled in
- Share button on every machine, and a print / save price list button
- Key numbers, reviews and job-site photos (sections appear only when you add them, so nothing fake is shown)
- Search engine tags (business name, area, phone) generated automatically

## Publishing changes

The site is static, so visitors read `equipment.json` and the `images/` folder.

1. In the admin, make your changes. They are saved in your browser for preview.
2. **Publish** tab > Download website update (a zip with your equipment list and photos).
3. Unzip, then upload `equipment.json` and the `images` folder to your hosting next to `index.html`.
   If you work from this project, copy both into `public/` and run `npm run build`.
4. Refresh the site. Then press "Discard unpublished changes" in the admin to confirm the live version.

## Security note

The admin password is a light gate, not strong security, because the site has no server. A visitor's edits only affect their own browser, never the live site. The live site changes only when you upload a new update. If you later want logins and instant publishing from any device, add a backend such as Firebase or Supabase.

## Files you will edit most

- `public/equipment.json`: equipment and business details
- `src/styles.css`: colours are the variables at the top (`--yellow`, `--ink`)
