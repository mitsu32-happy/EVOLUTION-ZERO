# EVOLUTION ZERO

EVOLUTION ZERO is a browser-based survival action game built with Vite and PixiJS.

The current public-prep build includes:

- Four normal stages: jungle, volcano, swamp, ruins
- NORMAL / HARD / EXPERT difficulty progression
- ENDLESS score attack mode
- ZERO mode for jungle / volcano / swamp
- ZERO reward evolutions: Abyss Raps, Ignicera, Omega Rex
- Daily missions, research points, titles, title frames, codex, result rewards
- BGM / SE with local audio assets

## Play

GitHub Pages URL:

https://mitsu32-happy.github.io/EVOLUTION-ZERO/

If the repository is published under a different GitHub account, use:

https://<username>.github.io/EVOLUTION-ZERO/

## Controls

- Move: drag / virtual stick
- Special: tap the special button when READY
- Pause: pause button in HUD
- Options: audio, warning guide, display, and touch settings are available in-game

## Supported Browsers

The game is designed for modern desktop and mobile browsers.

- PC: Edge / Chrome
- Mobile: iOS Safari / Android Chrome

Mobile real-device QA is still required before a release announcement.

## Credits And Licenses

This repository includes game code, generated visual assets, fonts, and audio assets.
Code licensing is not finalized yet.

Third-party and free-material license notes are documented under:

- `docs/assets/audio_credits_mvp158.md`
- `docs/assets/audio_credits_mvp160.md`
- `docs/assets/audio_source_list_mvp158.json`
- `docs/assets/audio_source_list_mvp160.json`
- `docs/assets/asset_replacement_plan.md`

Do not redistribute individual assets outside this project unless their source license explicitly allows it.

## Development

```bash
npm install
npm run dev
npm run build
```

GitHub Pages expects Vite `base` to be `/EVOLUTION-ZERO/`.

## Public Roadmap

Planned post-release additions:

- ruins ZERO route
- fourth dinosaur
- codex detail panel
- PWA polish
- additional audio polish
