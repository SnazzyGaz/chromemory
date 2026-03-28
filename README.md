# Chromemory

![Chromemory Header](https://raw.githubusercontent.com/SnazzyGaz/chromemory/main/rdhead2.png)

**A precise colour memory test powered by clinical perceptual science.**

How accurately can you remember and recreate a colour after seeing it for just a few seconds?

## 🎮 How to Play

1. Choose your difficulty (**Easy / Medium / Hard**) or jump into the **Daily Challenge**
2. Enter a seed (or leave blank for a random game)
3. A colour is shown for a few seconds — memorise it!
4. Use the HSB sliders to recreate the colour as accurately as you can
5. Complete 5 rounds and see your average score

Every game is defined by a **seed** (e.g. `ANVIL-7823`). Share the seed with friends to challenge them on the *exact same* colours!

## ✨ Features

- **Clinical CIEDE2000 scoring** — Uses the industry-standard perceptual colour-difference formula (ΔE₀₀) for truly fair, objective results across the entire colour space
- Per-round perceptual breakdown (Lightness / Chroma / Hue) so you can see exactly where you drifted
- **Daily Challenge** mode that resets every 24 hours with persistent high-score tracking
- Fully reproducible games via shareable seeds
- Beautiful dark mono UI with smooth arc countdown, diagonal-split result swatches, and haptic feedback
- Fully offline-capable Progressive Web App (PWA) — installable on phone or desktop
- Excellent mobile and desktop experience

## 🚀 Try It Live

**Main build:** [Play Chromemory](https://snazzygaz.github.io/chromemory/)  
**Temp / development build:** [https://snazzygaz.github.io/temp/](https://snazzygaz.github.io/temp/)

## 📱 Install as App

**On Android / Desktop (Chrome/Edge):**  
Open the site → tap the install icon in the address bar (or three-dot menu → **Install app**)

**On iPhone / iPad (Safari):**  
Open the site → tap the Share button → **Add to Home Screen**

## 🧪 Why Chromemory’s Scoring Is Different

Most colour memory games rely on crude weighted HSV/HSB distances with arbitrary forgiveness rules. Chromemory uses the full **CIEDE2000 (ΔE₀₀)** formula — the same perceptual standard trusted by printing, paint manufacturing, display calibration labs, and professional colour science. Every score is now clinically fair and consistent, no more juggling hacks.

## 🛠️ Tech Stack

- Pure HTML, CSS, and JavaScript (no frameworks)
- Accurate CIELAB conversion + full CIEDE2000 implementation
- Service Worker for offline support and caching
- Web App Manifest for PWA features
- Hosted on **GitHub Pages**

## 📄 License

This project is open source and free to use. Feel free to fork it, improve it, or learn from it.

Made as a fun personal project to test colour memory and PWA capabilities — now with proper clinical scoring. Inspired by dialed.gg.

---

*Last updated: March 2026*
