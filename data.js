/**
 * PORTFOLIO VIDEOS
 * -----------------
 * Add one object per video. This is the file you'll come back to most.
 *
 * id       -> for YouTube (default): the video ID (the part after "v=" in
 *             the URL, e.g. https://www.youtube.com/watch?v=XXXXXXXXXXX
 *             the ID is XXXXXXXXXXX)
 *          -> for Instagram (platform: "instagram"): the full Reel URL,
 *             e.g. https://www.instagram.com/reel/XXXXXXXXXXX/
 * title    -> shown under the thumbnail
 * category -> one of: "reels" | "music-videos" | "documentary" | "others"
 * year     -> optional, shown as a small label (e.g. "2025")
 * platform -> optional, "youtube" (default) or "instagram". Instagram
 *             entries have no thumbnail (Instagram doesn't provide one
 *             without their API) and open the Reel in a new tab instead
 *             of the lightbox.
 *
 * Until you swap in a real ID/URL, the card shows a dashed placeholder
 * instead of breaking — safe to leave rows in while you're building.
 */

const portfolioVideos = [
 {
    id: "KA_7MGRZCQY",
    title: "Aaha Mal",
    category: "music-videos",
    year: "2024"
  },
  {
    id: "jbagGn750jY",
    title: "MMR'25",
    category: "aftermovie",
    year: "2025"
  },
    {
    id: "IC6zPS3UAzw",
    title: "Show Me Love",
    category: "music-videos",
    year: "2025"
  },
  {
    id: "1fI9j3w_lNw",
    title: "Andhakare",
    category: "music-videos",
    year: "2025"
  },
  {
    id: "5O0Yi5p3ri4",
    title: "Obai Ramya Sanda Kirana",
    category: "music-videos",
    year: "2025"
  },
  {
    id: "pn5BwQCxxyc",
    title: "Raawa",
    category: "aftermovie",
    year: "2024"
  },
  {
    id: "M8Kw_kbuyX8",
    title: "Unmadini",
    category: "others",
    year: "2026"
  },
  {
    id: "-BAX68_JhcQ",
    title: "WAYO Medley",
    category: "music-videos",
    year: "2024"
  },
  {
    id: "CV5rRt7G3sg",
    title: "Munnakkara",
    category: "documentary",
    year: "2023"
  },
  {
    id: "ASEvkmCOVIg",
    title: "Asaya Sands",
    category: "reels",
    year: "2025"
  },
  {
    id: "g_3cVxF7dtg",
    title: "Mora",
    category: "reels",
    year: "2025"
  },
  {
    id: "NsFohIuihnQ",
    title: "Ceylon Kitchen",
    category: "reels",
    year: "2025"
  }
];
