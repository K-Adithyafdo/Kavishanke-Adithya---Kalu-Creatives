# Kalu Creatives — portfolio site

A single-page portfolio site for Kavishanke Adithya / Kalu Creatives. Plain HTML/CSS/JS — no build step, no framework, no npm install. Open `index.html` directly in a browser, or open the whole folder in VS Code.

## File structure

```
kalu-creatives/
├── index.html         All page content and structure
├── css/style.css       All styling — colours, fonts, layout
├── js/data.js           Portfolio video list — edit this to add your videos
├── js/main.js            Site behaviour (grid, filters, video lightbox, nav)
└── assets/               Put a logo or portrait photo here if you add one
```

Everywhere there's something you're expected to personalize, the file has a comment block starting with `EDIT ME:` — search for that text in VS Code (Ctrl/Cmd+Shift+F) to jump between every spot.

## 1. Add your YouTube videos

Open **`js/data.js`**. It's a list of objects, one per video:

```js
{
  id: "dQw4w9WgXcQ",        // the YouTube video ID — the part after "v=" in the URL
  title: "Wedding highlight — Perera family",
  category: "reels",         // "reels" | "music-videos" | "documentary" | "others"
  year: "2025"
}
```

To find a video's ID: open the video on YouTube, look at the URL —
`https://www.youtube.com/watch?v=`**`dQw4w9WgXcQ`** — the ID is everything after `v=`.

The thumbnail and play button are generated automatically from that ID, so you don't need to upload any images. Until you replace the placeholder `REPLACE_WITH_YOUTUBE_ID_...` values, each card shows a dashed "add a YouTube ID" placeholder instead of a broken thumbnail — so it's safe to keep extra rows in while you're still filling things in. Add or delete objects from the list freely; the grid and the filter buttons (Reels / Music Videos / Documentary / Others) update automatically.

## 2. Edit the text content

Open **`index.html`** and look for the `EDIT ME:` comments:

- **Hero** — the one-line pitch under the tagline
- **About** — your bio (currently placeholder copy)
- **About → Credits roll** — your career history, styled like film credits (role / project / years) — add or remove a `.timeline__item` block per entry
- **About → Equipment** — the list of gear tags
- **Services** — the six service cards (title + description)
- **Contact** — email, phone, location, and social links

## 3. Colours and fonts

Everything is controlled from the top of **`css/style.css`**, inside `:root { ... }`. The palette is strictly black/white/grey by design — if you want to change the shades, edit the hex values there and they'll apply site-wide. Fonts (Archivo Black for headings, Space Grotesk for body text, IBM Plex Mono for the timecode/label details) are loaded from Google Fonts in the `<head>` of `index.html` — swap the `<link>` tag and the `--font-*` variables together if you want different ones.

## 4. The contact form

The form submits directly to **kalucreatives.admin@gmail.com** via [FormSubmit](https://formsubmit.co) — a free hosted form service, no backend or account required. `js/main.js` posts the form data to FormSubmit's AJAX endpoint and shows an inline "Message sent" confirmation instead of navigating away.

**One-time activation step:** the first time the live form is submitted (after you publish the site), FormSubmit sends a confirmation email to kalucreatives.admin@gmail.com asking to activate that address — click the link in it, or submissions before that point won't be delivered. Test this once after deploying.

To change the destination address, update it in two places in `index.html`: the `action="https://formsubmit.co/..."` attribute on `<form id="contactForm">`, and the mailto link in the Contact section's email list item.

## 5. Publishing it

This is a static site — three files, no server logic — so any static host works:
- **Netlify / Vercel**: drag the `kalu-creatives` folder onto their dashboard, or connect a GitHub repo.
- **GitHub Pages**: push this folder to a repo and enable Pages in the repo settings.

Nothing else needs to change for deployment — just make sure `css/`, `js/`, and `assets/` stay in the same relative locations next to `index.html`.
