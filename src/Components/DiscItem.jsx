import { UploadBox } from "./UploadBox";
import { useEffect, useState } from "react";

export const DiscItem = ({ id, signal, onCollect, onRemove, mcData }) => {
  const [title, setTitle] = useState(id);
  const [author, setAuthor] = useState("");
  const [recipe, setRecipe] = useState([
    "",
    "minecraft:iron_ingot",
    "",
    "minecraft:iron_ingot",
    "minecraft:diamond",
    "minecraft:iron_ingot",
    "",
    "minecraft:iron_ingot",
    "",
  ]);
  const [recipeIsShapeless, setRecipeIsShapeless] = useState(false);
  const [recipeIsDefault, setRecipeIsDefault] = useState(true);
  const [trackFile, setTrackFile] = useState(null);
  const [discImage, setDiscImage] = useState(null);

  const handleRecipeChange = (index, value) => {
    let newRecipe

    if (recipeIsDefault) {
      setRecipeIsDefault(false);
      newRecipe = ["", "", "", "", "", "", "", "", ""];
    } else {
      newRecipe = [...recipe];
    }

    newRecipe[index] = value;
    setRecipe(newRecipe);
  };

  useEffect(() => {
    onCollect(id, {
      title,
      author,
      recipe,
      recipeIsShapeless,
      trackFile,
      discImage,
    });
  }, [signal]);

  return (
    <div class="flew-row flex w-full justify-between gap-4 rounded-xl bg-card-bg p-4">
      <div class="flex flex-row gap-4">
        <div class="">
          <UploadBox
            uploadMessage={"Upload Disc Sprite"}
            size="small"
            onFileUpload={setDiscImage}
          />
        </div>

        <div class="flex flex-col gap-2">
          <div class="">
            Title
            <div class="mt-1 overflow-hidden rounded-full bg-upload-bg px-2 py-1.5 outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:outline-outline">
              <input
                class="w-full outline-none"
                type="text"
                placeholder={id}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
            </div>
          </div>

          <div class="">
            Author
            <div class="mt-1 overflow-hidden rounded-full bg-upload-bg px-2 py-1.5 outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:outline-outline">
              <input
                class="w-full outline-none"
                type="text"
                placeholder="Enter author name"
                onChange={(e) => setAuthor(e.target.value)}
              ></input>
            </div>
          </div>
        </div>
      </div>

      <div class="w-3/11">
        <div class="flex w-max flex-row gap-8">
          Recipe
          <label class="cursor-pointer select-none">
            <input
              type="checkbox"
              class="mr-2"
              onChange={(e) => setRecipeIsShapeless(e.target.checked)}
            />
            <span>Shapeless</span>
          </label>
        </div>
        <div class="grid w-full grid-cols-3 grid-rows-3 gap-x-2 gap-y-2">
          {recipe.map((item, i) => (
            <div class="group relative h-8 w-full">
              <div class="absolute grid h-8 min-w-full w-full place-items-center rounded-lg border-outline bg-upload-bg px-2 text-xs outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:z-10 focus-within:w-42 focus-within:outline-white">
                <input
                  key={i}
                  class="w-full outline-none"
                  type="text"
                  placeholder={item}
                  onChange={(e) => {
                    handleRecipeChange(i, e.target.value);
                  }}
                />
              </div>

              
              <div class='absolute bg-upload-bg outline-upload-border outline-1 z-10 translate-y-10 w-full rounded-lg opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto scale-74 group-focus-within:scale-100 transition-all duration-300 ease-in-out'>
                <div class='w-full h-full hover:bg-upload-hover rounded-lg transition-all duration-300 ease-in-out px-1 py-1.5' onMouseDown={() => {console.log("ello")}}>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div class="flex flex-col justify-center max-w-2/5">
        Track {"(mp3/ogg)"}
        <input
          type="file"
          onChange={(e) => setTrackFile(e.target.files[0])}
          class="w-full hover:bg-primary-hover mt-2 cursor-pointer rounded-full bg-upload-bg pr-2 transition-all duration-300 ease-in-out file:mr-4 file:w-fit file:cursor-pointer file:rounded-full file:bg-white file:px-4 file:py-2 file:text-black file:transition-all file:duration-300 file:ease-in-out hover:file:bg-upload-button-hover hover:file:text-white"
          accept=".mp3, .ogg"
        ></input>
      </div>

      <div class="flex items-end">
        <div
          class="cursor-pointer rounded-full bg-bad px-4 py-2 transition-all duration-300 ease-in-out hover:bg-bad-hover"
          onClick={() => onRemove(id)}
        >
          Delete
        </div>
      </div>
    </div>
  );
};
