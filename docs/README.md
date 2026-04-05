# GitHub Pages app

The working browser app is in `/docs/index.html`.

To publish it from this repo without any local install:
1. Open **Settings** in the repository
2. Open **Pages**
3. Set **Build and deployment** to **GitHub Actions**
4. Push to `main` or run the existing Pages workflow

This GitHub-only version runs fully in the browser and asks the user for their own API key at runtime. That is convenient for a static demo, but it is not the secure architecture for a public production app.