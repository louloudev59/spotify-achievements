# Spotify Achievements

View your listening achievements, levels, and statistics.

![preview](https://raw.githubusercontent.com/louloudev59/spotify-achievements/refs/heads/main/main/docs/main.png)

> **Note**  
> Spotify Achievements tracks your local listening history and level progression in real-time.
>
> To sync your lifetime Spotify hours and top artist/genre statistics, make sure to link your **stats.fm** account via the **listening-stats** custom app.

## Features

-   **RPG Leveling System**: Earn XP and level up by listening to music and completing achievements.
-   **35+ Achievements**: Unlock common, uncommon, rare, epic, and legendary achievements.
-   **Smart Filtering**: Filter and search your achievements by category, rarity, or unlock status.
-   **stats.fm Sync**: Retrieve your lifetime cloud stats (total duration, plays, and unique artists) with one click.
-   **Clean Vector Design**: Modern SVG icons styled to look like Spotify's native user interface.
-   **Multi-language**: Choice of display language (English / French) on first launch.

![preview](https://raw.githubusercontent.com/louloudev59/spotify-achievements/refs/heads/main/main/docs/main2.png)
![preview](https://raw.githubusercontent.com/louloudev59/spotify-achievements/refs/heads/main/main/docs/stats.png)

## Manual Installation

1. Run `spicetify config-dir` to open the Spicetify directory.
2. Navigate to the `CustomApps` folder.
3. Create a new folder named `spotify-achievements`.
4. Copy the compiled custom app files (`index.js`, `manifest.json`, `style.css`, `extension.js`) into this new folder.

Then, register the custom app and apply Spicetify:

```sh
spicetify config custom_apps spotify-achievements
spicetify apply
```

## Publishing to Spicetify Marketplace

To make this app available on the Spicetify Marketplace, follow these steps:

### 1. Add GitHub Topics Tag
Go to your GitHub repository settings and add the following topic tag to the repository:
*   `spicetify-apps`

### 2. Build and Deploy compiled files
Your repository's `main` branch contains the source code, but the Marketplace expects the compiled files to be located in the root of a branch. Run the built-in deployment script to automatically build, package, and push the assets to the `dist` branch:

```sh
npm run publish-dist
```

The Marketplace will read the `manifest.json` on your default branch, detect `"branch": "dist"`, and download the compiled files from the `dist` branch automatically!

## Uninstall

1. Run `spicetify config-dir` to open the Spicetify folder.
2. Go to the `CustomApps` folder and delete the `spotify-achievements` folder.

Then, remove the app configuration and apply:

```sh
spicetify config custom_apps spotify-achievements-
spicetify apply
```
