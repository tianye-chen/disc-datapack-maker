import { overlay } from "three/tsl"

export const createPack = (data) => {
  console.log("Hello from createPack!")
  console.log(data)

  let projectFiles = {}
  projectFiles["pack.mcmeta"] = {
    type: "json",
    content: createMcMeta(data.version, data.packDesc)
  }
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


const addDiscDuration = (data) => {
  const discPromises = data.map(async (data, index) => {
    return {
      ...data,
      length: Math.ceil(await getDuration(audio)),
    }
  }
  )

  const discs = Promise.all(discPromises)
  return discs
}

