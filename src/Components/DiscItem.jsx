import { UploadBox } from "./UploadBox";

export const DiscItem = (props) => {
  return (
    <div class="flew-row flex w-full justify-between gap-4 rounded-xl bg-card-bg p-4">
      <div class="flex flex-row gap-12">
        <UploadBox uploadMessage={"Upload Disc Sprite"} size="small" />

        {/**<div class='aspect-square min-w-36 max-w-36 bg-upload-bg border-2 border-dashed rounded-2xl border-[#ffffff55]'>
                    <div class='flex items-center justify-center min-h-full min-w-full text-xs'>
                        Upload Disc Sprite
                    </div>
                </div>**/}

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

        <div class="relative h-min w-full">
          Recipe
          <div class="absolute top-6 grid h-fit w-full grid-cols-3 grid-rows-3 gap-x-26 gap-y-2">
            {[...Array(9)].map((_, i) => (
              <div class="group grid h-8 w-24 place-items-center overflow-hidden rounded-lg border-[#ffffff55] bg-upload-bg px-2 text-xs outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:z-10 focus-within:w-48 focus-within:outline-white">
                <input
                  class="outline-none"
                  text="text"
                  placeholder="minecraft:diamond"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div class="flex items-end">
        <div
          class="cursor-pointer rounded-full bg-bad px-4 py-2 hover:bg-bad-hover"
          onClick={() => props.remove(props.index)}
        >
          Delete
        </div>
      </div>
    </div>
  );
};
