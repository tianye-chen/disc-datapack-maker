export const createPack = () => {

}

export const createMcMeta = (version, description) => {
  return {
    pack: {
      pack_format: version,
      supported_formats: [34, 48],
      description: description
    },
    overlays: {
      entries:[
        {
          "formats": {"min": 34, "max":999999},
          "directory": "overlays"
        }
      ]
    }
  }
}

export const getDuration = async (audioFile) => {
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

export const createDiscData = (audioFiles, images, titles, authors) => {
  const discPromises = audioFiles.map(async (audio, index) => {
      const title = titles[index] || "Unknown Title"
      const author = authors[index] || "Unknown Artist"

      return {
        audio: audio,
        length: Math.ceil(await getDuration(audio)),
        image: images[index],
        title: titles[index],
      }
    }
  )

  const musicDiscs = Promise.all(discPromises)
  return musicDiscs
}