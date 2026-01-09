import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

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

// Converts a file into .ogg
export const convertToOgg = async (file, volume) => {
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
