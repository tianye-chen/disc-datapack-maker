import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"
import { saveAs } from "file-saver"
import JSZip from "jszip"

const ffmpegInstance = null

const initFFmpeg = async () => {
  if (ffmpegInstance) {
    return ffmpegInstance
  }

  ffmpegInstance = new FFmpeg()

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
  await ffmpegInstance.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })

  return ffmpegInstance
}


export const createPack = async (data) => {
  console.log("Hello from createPack!")
  console.log(data)

  let projectFiles = {}
  const mcmeta = JSON.stringify(createMcMeta(data.version, data.packDesc), null, 2)

  await generateDiscFiles(projectFiles, data.discs)
  projectFiles["pack.mcmeta"] = mcmeta
  projectFiles["pack.png"] = data.packImage

  constructDownload(projectFiles)

  console.log("Done")
}

const constructDownload = (projectFiles) => {
  console.log(projectFiles)

  const zip = new JSZip()

  for (const [path, content] of Object.entries(projectFiles)){
    console.log(path)
    zip.file(path, content)
  }

  zip.generateAsync({type:"blob"})
    .then((download) => {
      saveAs(download, "music_pack.zip")
    })
}


const createMcMeta = (version, description) => {
  let dataFormat = -1
  let resourceFormat = -1
  
  switch (version) {
    case "1.21 - 1.12.1":
      dataFormat = 48
      resourceFormat = 34
      break
    case "1.21.4":
      dataFormat = 61
      resourceFormat = 46
      break
    case "1.21.5":
      dataFormat = 71
      resourceFormat = 55
      break
    case "1.20 - 1.20.1":
      dataFormat = 15
      resourceFormat = 15
      break
    case "1.19.4":
      dataFormat = 12
      resourceFormat = 13
      break
    case "1.19 - 1.19.2":
      dataFormat = 10
      resourceFormat = 9
      break
  }

  return {
    pack: {
      pack_format: dataFormat,
      supported_formats: {"min_inclusive":Math.min(resourceFormat, dataFormat),"max_inclusive": Math.max(resourceFormat, dataFormat)},
      description: description
    }
  }
}


const generateDiscFiles = async (projectFiles, discData) => {
  const modelPath = "assets/minecraft/models/item/"
  const texturePath = "assets/minecraft/textures/item/"
  const soundRecordsPath = "assets/minecraft/sounds/records/"
  const soundJsonPath = "assets/minecraft/"
  const jukeBoxSongPath = "data/custom/jukebox_song/"

  const soundsJson = {}

  for (const [index, disc] of discData.entries()) {
    const discName = `${disc.title}_${index}`.toLowerCase().replace(/[^a-z0-9_]/g, "_")
    const discOgg = await convertToOgg(disc.trackFile)

    soundsJson[`music_disc.${discName}`] = {
      "sounds": [
        {
          "name": `records/music_disc_${discName}`,
          "stream": true
        }
      ]
    }

    projectFiles[jukeBoxSongPath+`music_disc_${discName}.json`] = JSON.stringify({
      "comparator_output": 1,
      "description": discData.title + " - " + discData.author,
      "length_in_seconds": Math.ceil(await getDuration(discOgg)),
      "sound_event": {
        "sound_id": `minecraft:music_disc.music_disc_${discName}`
      }
    })

    projectFiles[modelPath+`music_disc_${discName}.json`] = JSON.stringify({
      "parent": "minecraft:item/generated",
      "textures": {
        "layer0": `item/music_disc_${discName}`
      }
    }, null, 2)

    projectFiles[soundRecordsPath+`music_disc_${discName}.ogg`] = discOgg
    projectFiles[texturePath+`music_disc_${discName}.png`] = discData.discImage
  }

  projectFiles[soundJsonPath+"sounds.json"] = JSON.stringify(soundsJson, null, 2)
}

const convertToOgg = async (file) => {
  if (file.type === "application/ogg") {
    return new Uint8Array(await file.arrayBuffer())
  }

  const ffmpeg = await initFFmpeg()

  await ffmpeg.writeFile("input.mp3", await fetchFile(file))
  await ffmpeg.exec(["-i", "input.mp3", "-c:a", "libvorbis", "-q:a", "4", "output.ogg"])

  const ogg = await ffmpeg.readFile("output.ogg")
  return ogg
}

const getDuration = async (audioFile) => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(audioFile)
    const audio = new Audio(url)
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url)
      resolve(audio.duration)
    })
    audio.addEventListener('error', (e) => {
      reject(e)
      resolve(0)
    })
  }
  )
}

