import { UploadBox } from "./UploadBox";
import { useEffect, useState, useRef } from "react";
import { FaDotCircle } from "react-icons/fa";

export const DiscItem = ({ id, signal, onCollect, onRemove, mcData }) => {
  const [title, setTitle] = useState(id);
  const [author, setAuthor] = useState("");
  const [recipe, setRecipe] = useState([
    "",
    "iron_ingot",
    "",
    "iron_ingot",
    "diamond",
    "iron_ingot",
    "",
    "iron_ingot",
    "",
  ]);
  const [recipeIsShapeless, setRecipeIsShapeless] = useState(false);
  const [recipeIsDefault, setRecipeIsDefault] = useState(true);
  const [trackFile, setTrackFile] = useState(null);
  const [discImage, setDiscImage] = useState(null);
  const [autoCompleteSuggestion, setAutoCompleteSuggestion] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [namespaceVisibility, setNamespaceVisibility] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [namespace, setNameSpace] = useState([
    "minecraft",
    "minecraft",
    "minecraft",
    "minecraft",
    "minecraft",
    "minecraft",
    "minecraft",
    "minecraft",
    "minecraft",
  ]);
  const namespaceInputs = useRef([]);

  const handleNamespaceVisibility = (index, state) => {
    console.log(index, state);

    setNamespaceVisibility((prev) =>
      prev.map((item, i) => (i == index ? state : item)),
    );

    if (state) {
      setTimeout(() => {
        namespaceInputs.current[index]?.focus();
      }, 0);
    }
  };

  const handleSuggestionKeyDown = (e, i) => {
    if (e.key == "ArrowUp") {
      e.preventDefault();
      setSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key == "ArrowDown") {
      e.preventDefault();
      setSuggestionIndex((prev) =>
        prev < autoCompleteSuggestion.length - 1
          ? prev + 1
          : autoCompleteSuggestion.length - 1,
      );
    } else if (e.key == "Enter") {
      e.preventDefault();
      handleRecipeChange(autoCompleteSuggestion[suggestionIndex], i);
      setSuggestionIndex(-1);
    } else {
      setSuggestionIndex(-1);
    }
  };

  const handleSuggestFocus = (e, index) => {
    handleAutocomplete(recipe[index]);
  };

  const handleAutocomplete = (query) => {
    setAutoCompleteSuggestion(mcData.itemLookUp(query));
  };

  const handleRecipeChange = (value, index) => {
    console.log(index, value);
    let newRecipe;

    if (recipeIsDefault) {
      setRecipeIsDefault(false);
      newRecipe = ["", "", "", "", "", "", "", "", ""];
    } else {
      newRecipe = [...recipe];
    }

    newRecipe[index] = value;
    handleAutocomplete(value);
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
        {/** Disc image upload */}
        <div class="">
          <UploadBox
            uploadMessage={"Upload Disc Sprite"}
            size="small"
            onFileUpload={setDiscImage}
          />
        </div>

        {/** Title and author */}
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

      {/** Recipe input */}
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
            <div class="relative h-8 w-full" key={i}>
              <div
                class={`absolute z-10 flex h-8 w-full -translate-y-10 items-center rounded-lg bg-upload-bg p-2 ${namespaceVisibility[i] ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} border-outline outline-2 outline-white transition-all duration-300 ease-in-out`}
                onBlur={(e) => handleNamespaceVisibility(i, false)}
              >
                <input
                  key={i}
                  ref={(el) => (namespaceInputs.current[i] = el)}
                  class="z-10 w-full outline-none"
                  type="text"
                  placeholder={"minecraft"}
                  value={namespace[i]}
                />
              </div>

              <div class="group">
                <div
                  class="absolute flex h-8 w-full min-w-full place-items-center rounded-lg border-outline bg-upload-bg pr-2 text-xs outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:z-10 focus-within:w-42 focus-within:outline-white"
                  onFocus={(e) => handleSuggestFocus(e, i)}
                >
                  <div
                    class="flex h-full items-center rounded-l-lg px-1.5 transition-all duration-300 ease-in-out hover:bg-upload-hover"
                    onClick={(e) =>
                      handleNamespaceVisibility(i, !namespaceVisibility[i])
                    }
                    title="Namespace"
                  >
                    <FaDotCircle class="opacity-25" />
                  </div>

                  <input
                    key={i}
                    class="w-full pl-1 outline-none"
                    type="text"
                    placeholder={item}
                    value={recipe[i]}
                    onChange={(e) => {
                      handleRecipeChange(e.target.value, i);
                    }}
                    onKeyDown={(e) => {
                      handleSuggestionKeyDown(e, i);
                    }}
                  />
                </div>

                {autoCompleteSuggestion.length > 0 ? (
                  <div class="pointer-events-none absolute z-10 w-fit min-w-full translate-y-10 scale-74 rounded-lg bg-upload-bg opacity-0 outline-1 outline-upload-border transition-all duration-300 ease-in-out group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100">
                    {autoCompleteSuggestion.map((suggestion, j) => (
                      <div
                        div
                        class={`h-full w-full cursor-default rounded-lg px-2 py-1.5 transition-all duration-300 ease-in-out hover:bg-upload-hover ${suggestionIndex == j ? "bg-upload-hover" : ""}`}
                        onMouseDown={() => {
                          handleRecipeChange(suggestion, i);
                        }}
                        key={j}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/** Track upload */}
      <div class="flex max-w-2/5 flex-col justify-center">
        Track {"(mp3/ogg)"}
        <input
          type="file"
          onChange={(e) => setTrackFile(e.target.files[0])}
          class="mt-2 w-full cursor-pointer rounded-full bg-upload-bg pr-2 transition-all duration-300 ease-in-out file:mr-4 file:w-fit file:cursor-pointer file:rounded-full file:bg-white file:px-4 file:py-2 file:text-black file:transition-all file:duration-300 file:ease-in-out hover:file:bg-upload-button-hover hover:file:text-white"
          accept=".mp3, .ogg"
        ></input>
      </div>

      {/** Delete button */}
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
