import { UploadBox } from "./UploadBox";
import { useState } from "react";

export const DiscItem = (props) => {
  const [recipeIsShapeless, setRecipeIsShapeless] = useState(false);
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
  const [trackFile, setTrackFile] = useState(null);

  return (
    <div class="flew-row flex w-full justify-between gap-4 rounded-xl bg-card-bg p-4">
      <div class="flex flex-row gap-12">
        <div class="">
          <UploadBox uploadMessage={"Upload Disc Sprite"} size="small" />
        </div>

        <div class="flex flex-col gap-2">
          <div>
            Title
            <div class="mt-1 rounded-full bg-upload-bg px-2 py-1.5 outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:outline-outline">
              <input
                class="mx-2 outline-none"
                type="text"
                placeholder="Enter song title"
              ></input>
            </div>
          </div>

          <div>
            Author
            <div class="mt-1 rounded-full bg-upload-bg px-2 py-1.5 outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:outline-outline">
              <input
                class="mx-2 outline-none"
                type="text"
                placeholder="Enter author name"
              ></input>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="flex w-max flex-row gap-16">
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
          <div class="absolute top-6 grid w-full grid-cols-3 grid-rows-3 gap-x-26 gap-y-2">
            {recipe.map((item, i) => (
              <div class="group grid h-8 w-24 place-items-center overflow-hidden rounded-lg border-outline bg-upload-bg px-2 text-xs outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:z-10 focus-within:w-42 focus-within:outline-white">
                <input
                  class="w-full outline-none"
                  text="text"
                  placeholder={item}
                  onChange={(e) => {
                    let newRecipe = [...recipe];
                    newRecipe[i] = e.target.value;
                    setRecipe(newRecipe);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-center ml-8">
        Track {"(mp3/ogg)"}
        <input
          type="file"
          onChange={(e) => setTrackFile(e.target.files[0])}
          class="hover:bg-primary-hover cursor-pointer rounded-full mt-2 bg-upload-bg transition-all duration-300 ease-in-out file:w-fit file:cursor-pointer file:rounded-full file:bg-white file:px-4 file:py-2 file:mr-4 file:text-black hover:file:bg-upload-button-hover hover:file:text-white file:transition-all file:duration-300 file:ease-in-out"
          accept=".mp3, .ogg"
        ></input>
      </div>

      <div class="flex items-end">
        <div
          class="cursor-pointer rounded-full bg-bad px-4 py-2 hover:bg-bad-hover transition-all duration-300 ease-in-out"
          onClick={() => props.remove(props.index)}
        >
          Delete
        </div>
      </div>
    </div>
  );
};
