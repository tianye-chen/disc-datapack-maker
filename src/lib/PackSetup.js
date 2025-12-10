import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const ffmpegInstance = null;

const initFFmpeg = async () => {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  ffmpegInstance = new FFmpeg();

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpegInstance.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  return ffmpegInstance;
};

export const createPack = async (data) => {
  console.log("Hello from createPack!");
  console.log(data);

  let projectFiles = {};
  const mcmeta = JSON.stringify(
    createMcMeta(data.version, data.packDesc),
    null,
    2,
  );

  await generateDiscFiles(projectFiles, data.discs);
  projectFiles["pack.mcmeta"] = mcmeta;
  projectFiles["pack.png"] = data.packImage;

  constructDownload(projectFiles);

  console.log("Done");
};

const constructDownload = (projectFiles) => {
  console.log(projectFiles);

  const zip = new JSZip();

  for (const [path, content] of Object.entries(projectFiles)) {
    console.log(path);
    zip.file(path, content);
  }

  zip.generateAsync({ type: "blob" }).then((download) => {
    saveAs(download, "music_pack.zip");
  });
};

const createMcMeta = (version, description) => {
  let dataFormat = -1;
  let resourceFormat = -1;

  switch (version) {
    case "1.21 - 1.12.1":
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
    case "1.20 - 1.20.1":
      dataFormat = 15;
      resourceFormat = 15;
      break;
    case "1.19.4":
      dataFormat = 12;
      resourceFormat = 13;
      break;
    case "1.19 - 1.19.2":
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
      description: description,
    },
  };
};

const generateDiscFiles = async (projectFiles, discData) => {
  const modelPath = "assets/minecraft/models/item/";
  const texturePath = "assets/minecraft/textures/item/";
  const soundRecordsPath = "assets/minecraft/sounds/records/";
  const soundJsonPath = "assets/minecraft/";
  const jukeBoxSongPath = "data/custom/jukebox_song/";
  const recipePath =  "data/custom/recipe/"

  const soundsJson = {};

  for (const [index, disc] of discData.entries()) {
    const discName = `${disc.title}_${index}`
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_");
    const discOgg = await convertToOgg(disc.trackFile);
    const recipeData = formatRecipe(disc.recipe)

    soundsJson[`music_disc.${discName}`] = {
      sounds: [
        {
          name: `records/music_disc_${discName}`,
          stream: true,
        },
      ],
    };

    projectFiles[recipePath + `music_disc_${discName}.json`] = 
      JSON.stringify({ 
        "type": disc.recipeIsShapeless ? "minecraft:crafting_shapeless" : "minecraft:crafting_shapeled",
        "pattern": recipeData.pattern,
        "key": recipeData.key,
        "id": "minecraft:music_disc_11",
        "count": 1,
        "components": {
          "minecraft:jukebox_playable": {
            "song": `custom:music_disc_${discName}`
          },
          "minecraft:item_name": `"${disc.title}"`,
          "minecraft:lore": [`"${disc.author}`]
        }
      },
      null,
      2,
    )

    projectFiles[jukeBoxSongPath + `music_disc_${discName}.json`] =
      JSON.stringify(
        {
          comparator_output: 1,
          description: disc.title + " - " + disc.author,
          length_in_seconds: Math.ceil(discOgg.duration),
          sound_event: {
            sound_id: `minecraft:music_disc.music_disc_${discName}`,
          },
        },
        null,
        2,
      );

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

    projectFiles[soundRecordsPath + `music_disc_${discName}.ogg`] = discOgg.ogg;
    projectFiles[texturePath + `music_disc_${discName}.png`] = disc.discImage;
  }

  projectFiles[soundJsonPath + "sounds.json"] = JSON.stringify(
    soundsJson,
    null,
    2,
  );
};

const convertToOgg = async (file) => {
  if (file.type === "application/ogg") {
    const buffer = new Uint8Array(await file.arrayBuffer());
    return {
      ogg: buffer,
      duration: await getDuration(file),
    };
  }

  const ffmpeg = await initFFmpeg();

  await ffmpeg.writeFile("input.mp3", await fetchFile(file));
  await ffmpeg.exec([
    "-i",
    "input.mp3",
    "-c:a",
    "libvorbis",
    "-q:a",
    "4",
    "output.ogg",
  ]);

  const ogg = await ffmpeg.readFile("output.ogg");
  const blob = new Blob([ogg.buffer], { type: "audio/ogg" });
  const duration = await getDuration(blob);

  return {
    ogg: ogg,
    duration: duration,
  };
};

const formatRecipe = (recipeArr) => {
  const itemToKey = {};
  const datapackKey = {}
  const recipe = ["", "", ""];
  const recipeKeys = ["j", "i", "h", "g", "f", "e", "d", "c", "b", "a"];
  let key = null;

  recipeArr.forEach((item, index) => {
    if (item == "") {
      recipe[Math.floor(index / 3)] += " ";
      return;
    }

    const isTag = item.startsWith("#")

    if (!(item in itemToKey)) {
      key = recipeKeys.pop();
      itemToKey[item] = key;
    }

    recipe[Math.floor(index / 3)] += itemToKey[item];

    datapackKey[itemToKey[item]] = {
      [isTag ? "tag" : "item"]: item
    }
  });

  return { pattern: recipe, key: datapackKey };
};

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
