import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { saveAs } from "file-saver";
import JSZip from "jszip";

let ffmpegInstance = null;

// Initialize FFmpeg instance
const initFFmpeg = async () => {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  ffmpegInstance = new FFmpeg();

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  await ffmpegInstance.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  return ffmpegInstance;
};

// Core function called to create the datapack
export const createPack = async (data) => {
  console.log(data);

  data.updateStatus("Generating Pack");

  try {
    let projectFiles = {};
    const mcmeta = JSON.stringify(
      createMcMeta(data.version, data.packDesc),
      null,
      2,
    );

    await generateDiscFiles(projectFiles, data.discs, data.version);
    projectFiles["pack.mcmeta"] = mcmeta;
    projectFiles["pack.png"] = data.packImage;

    constructDownload(projectFiles, data.packTitle);
  } catch (e) {
    console.log(e);
    if (e instanceof TypeError) {
      data.updateStatus("One or more inputs are either missing or malformed");
    }
    return;
  }

  data.updateStatus("Download started");
  console.log("Done");
};

// Zips the files and download the datapack
const constructDownload = (projectFiles, packTitle) => {
  if (!packTitle || packTitle.trim() == "") {
    packTitle = "custom_discs";
  }

  const zip = new JSZip();

  for (const [path, content] of Object.entries(projectFiles)) {
    console.log(path);
    zip.file(path, content);
  }

  zip.generateAsync({ type: "blob" }).then((download) => {
    saveAs(download, `${packTitle}.zip`);
  });
};

// Make mcmeta based on version
const createMcMeta = (version, description) => {
  let dataFormat = -1;
  let resourceFormat = -1;

  switch (version) {
    case "1.21-1.21.1":
      dataFormat = 48;
      resourceFormat = 34;
      break;
    case "1.21.4":
      dataFormat = 61;
      resourceFormat = 46;
      break;
    case "1.21.5":
      dataFormat = 71;
      resourceFormat = 55;
      break;
    case "1.20-1.20.1":
      dataFormat = 15;
      resourceFormat = 15;
      break;
    case "1.19.4":
      dataFormat = 12;
      resourceFormat = 13;
      break;
    case "1.19-1.19.2":
      dataFormat = 10;
      resourceFormat = 9;
      break;
  }

  return {
    pack: {
      pack_format: dataFormat,
      supported_formats: {
        min_inclusive: Math.min(resourceFormat, dataFormat),
        max_inclusive: Math.max(resourceFormat, dataFormat),
      },
      description: description + "\nCreated with §eDaniel.ch/MC-Disc",
    },
  };
};

// Makes the majority of the datapack files
const generateDiscFiles = async (projectFiles, discData, version) => {
  const modelPath = "assets/minecraft/models/item/";
  const itemPath = "assets/minecraft/items/"; // For 1.21.5 item models
  const texturePath = "assets/minecraft/textures/item/";
  const soundRecordsPath = "assets/minecraft/sounds/records/";
  const soundJsonPath = "assets/minecraft/";
  const jukeBoxSongPath = "data/custom/jukebox_song/";
  const recipePath = "data/custom/recipe/";

  const overrides = [];
  const entries = [];

  const soundsJson = {};

  for (const [index, disc] of discData.entries()) {
    const discName = `${disc.title}_${index}`
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_");
    const discOgg = await convertToOgg(disc.trackFile, disc.volume);
    const recipeData = formatRecipe(disc.fullRecipe);
    const customModelId = 6700 + index;

    // --- Create sound entry for disc ---
    soundsJson[`music_disc.${discName}`] = {
      sounds: [
        {
          name: `records/music_disc_${discName}`,
          stream: true,
        },
      ],
      attenuation_distance: 16,
    };

    // --- Model override logic ---
    if (version == "1.21-1.21.1") {
      overrides.push({
        predicate: {
          custom_model_data: customModelId,
        },
        model: `item/music_disc_${discName}`,
      });
    } else {
      entries.push({
        threshold: customModelId,
        model: {
          type: "model",
          model: `item/music_disc_${discName}`,
        },
      });
    }

    // --- Create recipe ---
    projectFiles[recipePath + `music_disc_${discName}.json`] = JSON.stringify(
      {
        type: disc.recipeIsShapeless
          ? "minecraft:crafting_shapeless"
          : "minecraft:crafting_shaped",
        pattern: recipeData.pattern,
        key: recipeData.key,
        result: {
          id: "minecraft:music_disc_11",
          count: 1,
          components: {
            "minecraft:jukebox_playable":
              version == "1.21-1.21.1"
                ? { song: `custom:music_disc_${discName}` }
                : `custom:music_disc_${discName}`,
            "minecraft:custom_model_data":
              version == "1.21-1.21.1"
                ? customModelId
                : { floats: [customModelId] },
            "minecraft:item_name":
              version == "1.21-1.21.1"
                ? { text: `${disc.title} - ${disc.author}` }
                : `${disc.title} - ${disc.author}`,
            "minecraft:lore": [
              version == "1.21-1.21.1"
                ? { text: "Custom Music Discs" }
                : "Custom Music Discs",
            ],
          },
        },
      },
      null,
      2,
    );

    // --- Create jukebox song file ---
    projectFiles[jukeBoxSongPath + `music_disc_${discName}.json`] =
      JSON.stringify(
        {
          comparator_output: 1,
          description: { text: disc.title + " - " + disc.author },
          length_in_seconds: Math.ceil(discOgg.duration),
          sound_event: {
            sound_id: `minecraft:music_disc.${discName}`,
          },
        },
        null,
        2,
      );

    // --- Create model and texture files ---
    projectFiles[modelPath + `music_disc_${discName}.json`] = JSON.stringify(
      {
        parent: "minecraft:item/generated",
        textures: {
          layer0: `item/music_disc_${discName}`,
        },
      },
      null,
      2,
    );

    // Assets
    projectFiles[soundRecordsPath + `music_disc_${discName}.ogg`] = discOgg.ogg;
    projectFiles[texturePath + `music_disc_${discName}.png`] = disc.discImage;
  }

  if (version == "1.21-1.21.1") {
    overrides.sort(
      (a, b) => a.predicate.custom_model_data - b.predicate.custom_model_data,
    );
    projectFiles[modelPath + "music_disc_11.json"] = JSON.stringify(
      {
        parent: "item/generated",
        textures: {
          layer0: "item/music_disc_11",
        },
        overrides: overrides,
      },
      null,
      2,
    );
  } else {
    entries.sort((a, b) => a.threshold - b.threshold);
    projectFiles[itemPath + "music_disc_11.json"] = JSON.stringify(
      {
        model: {
          type: "minecraft:range_dispatch",
          property: "minecraft:custom_model_data",
          entries: entries,
          fallback: {
            type: "minecraft:model",
            model: "minecraft:item/music_disc_11",
          },
        },
      },
      null,
      2,
    );
  }

  projectFiles[soundJsonPath + "sounds.json"] = JSON.stringify(
    soundsJson,
    null,
    2,
  );
};

// Converts a file into .ogg
const convertToOgg = async (file, volume) => {
  const ffmpeg = await initFFmpeg();

  await ffmpeg.writeFile(file.name, await fetchFile(file));
  await ffmpeg.exec([
    "-i", // Input file
    file.name, // Input file name
    "-c:a", // Codec:Audio
    "libvorbis", // Use libvorbis codec, standard for ogg
    "-q:a", // Audio quality
    "4", // Set quality to 4, ~128kbps (good quality, reasonable size)
    "-ac", // Audio channels
    "1", // Set to mono, allows audio distance fading to work properly
    "-af", // Audio filter
    `volume=${volume / 100}`, // Set volume based on user input
    "output.ogg", // Output file name
  ]);

  const ogg = await ffmpeg.readFile("output.ogg");
  const blob = new Blob([ogg.buffer], { type: "audio/ogg" });
  const duration = await getDuration(blob);

  return {
    ogg: ogg,
    duration: duration,
  };
};

// Put recipe into correct format
const formatRecipe = (recipeArr, version) => {
  const itemToKey = {};
  const datapackKey = {};
  const recipe = ["", "", ""];
  const recipeKeys = ["j", "i", "h", "g", "f", "e", "d", "c", "b", "a"];
  let key = null;

  recipeArr.forEach((item, index) => {
    if (item == "") {
      recipe[Math.floor(index / 3)] += " ";
      return;
    }

    const isTag = item.startsWith("#");

    if (!(item in itemToKey)) {
      key = recipeKeys.pop();
      itemToKey[item] = key;
    }

    recipe[Math.floor(index / 3)] += itemToKey[item];

    if (version == "1.21-1.21.1") {
      datapackKey[itemToKey[item]] = {
        [isTag ? "tag" : "item"]: item,
      };
    } else {
      datapackKey[itemToKey[item]] = item;
    }
  });

  return { pattern: recipe, key: datapackKey };
};

// Get the duration of an audio file in seconds
const getDuration = async (audioFile) => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(audioFile);
    const audio = new Audio(url);

    audio.onloadeddata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    };
    audio.onerror = () => resolve(0);
  });
};
