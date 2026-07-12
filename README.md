# Spotify Achievements

View your listening achievements, levels, and statistics.

![preview](https://raw.githubusercontent.com/louloudev59/spotify-achievements/main/preview.png)

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

![preview](https://raw.githubusercontent.com/louloudev59/spotify-achievements/main/docs/main2.png)
![preview](https://raw.githubusercontent.com/louloudev59/spotify-achievements/main/docs/stats.png)

## Manual Installation

1. Run `spicetify config-dir` to open the spicetify folder.
2. Go to the `CustomApps` folder.
3. Create a `spotify-achievements` folder.
4. Download the custom app files and place the compiled files (`index.js`, `manifest.json`, `style.css`) inside the folder you created in step 3.
5. Copy the extension file `spotify-achievements.js` into the `Extensions` folder of Spicetify.

Then, run the following commands:

```sh
spicetify config custom_apps spotify-achievements extensions spotify-achievements.js
spicetify apply
```

## stats.fm Integration

If you use the **listening-stats** app connected to stats.fm on Spicetify, Spotify Achievements will automatically detect your stats.fm username from local storage.

To synchronize your lifetime statistics:
1. Open the **Achievements** custom app.
2. Go to the **Settings** tab.
3. Click the **Force synchronization** button.

The custom app will query the stats.fm API to fetch your lifetime listening duration, play count, top artists, and associated genres, immediately updating your XP and achievements!

![preview](https://raw.githubusercontent.com/louloudev59/spotify-achievements/main/docs/settings.png)

## Upcoming features

-   More custom achievements (e.g. specific release eras, artist marathons)
-   Interactive levels dashboard with achievements progression graphs
-   Sound effects theme selector (retro, native, fantasy)

## Uninstall

1. Run `spicetify config-dir` to open the spicetify folder
2. Go to the `CustomApps` folder and delete the `spotify-achievements` folder
3. Go to the `Extensions` folder and delete the `spotify-achievements.js` file

Then, run the following commands:

```sh
spicetify config custom_apps spotify-achievements- extensions spotify-achievements.js-
spicetify apply
```
