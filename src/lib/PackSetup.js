export const createPack = (data) => {
  console.log(data)
}


const createMcMeta = (version, description) => {
  return {
    pack: {
      pack_format: version,
      supported_formats: [34, 48],
      description: description
    },
    overlays: {
      entries: [
        {
          "formats": { "min": 34, "max": 999999 },
          "directory": "overlays"
        }
      ]
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

