import { useCallback, useEffect, useRef, useState, version } from "react";
import { DiscItem } from "../Components/DiscItem";
import { Dropdown } from "../Components/Dropdown";
import { UploadBox } from "../Components/UploadBox";
import { createPack } from "../lib/PackSetup";
import { MCData } from "../lib/Data";

export const DiscPackMaker = () => {
  const [selectedVersion, setSelectedVersion] = useState("1.21-1.21.1");
  const [collectionTrigger, setCollectionTrigger] = useState(0);
  const [packImage, setPackImage] = useState(null);
  const [packTitle, setPackTitle] = useState("");
  const [packDesc, setPackDesc] = useState("");
  const [customDiscs, setCustomDiscs] = useState([{ id: crypto.randomUUID() }]);
  const datapackVersion = [
    "1.21.5",
    "1.21-1.21.1",
    "1.20-1.20.1",
    "1.19.4",
    "1.19-1.19.2",
  ];
  const isCreatingPack = useRef(false);
  const [downloadStatusMessage, setDownloadStatusMessage] = useState('')


  const mcData = new MCData(selectedVersion);
  mcData.init();

  const addNewItem = () => {
    setCustomDiscs((prev) => [...prev, { id: crypto.randomUUID() }]);
  };

  const removeItem = (id) => {
    setCustomDiscs((prev) => prev.filter((item) => item.id != id));
  };

  const handleCollect = (id, data) => {
    setCustomDiscs((prev) => {
      const newDiscs = [...prev];
      const discIndex = newDiscs.findIndex((item) => item.id === id);
      if (discIndex !== -1) {
        newDiscs[discIndex] = {
          ...newDiscs[discIndex],
          ...data,
        };
      }

      return newDiscs;
    });
  };


  const handleSubmit = () => {
    setCollectionTrigger((prev) => prev + 1);
    isCreatingPack.current = true;
  };

  useEffect(() => {
    if (isCreatingPack.current) {
      createPack({
        version: selectedVersion,
        packTitle: packTitle,
        packDesc: packDesc,
        packImage: packImage,
        discs: customDiscs,
				updateStatus: setDownloadStatusMessage
      });
      isCreatingPack.current = false;
    }
  }, [customDiscs]);

  return (
    <div class="min-w-screen text-primary-text">
      <div class="mt-16 mb-8 flex items-center justify-center text-4xl font-bold">
        Minecraft Custom Music Disc Datapack Generator
      </div>
      <div class="mb-4 flex items-center justify-center">
        <div class="h-[60px] min-h-24 w-[468px] bg-upload-bg">Ad Space</div>
      </div>

      <div class="flex justify-center">
        <div class="flex w-2/3 flex-col items-start">
          {/** Title and pack image and description*/}
          <div class="flex min-h-64 items-start min-w-full justify-center">
            <div
              class={`mr-4 aspect-square max-w-sm min-w-sm rounded-2xl bg-upload-bg`}
            >
              <UploadBox
                uploadMessage={"Upload Pack Image"}
                size="big"
                onFileUpload={setPackImage}
              />
            </div>
            <div>
              <div class="mb-4 text-6xl font-bold">
                <input
                  class="w-full rounded-lg bg-upload-bg px-2 py-1.5 outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:outline-outline"
                  type="text"
                  placeholder="Datapack Title"
                  onChange={(e) => setPackTitle(e.target.value)}
                ></input>
              </div>
              <div class="text-4xl font-thin">
                <input
                  class="w-full rounded-lg bg-upload-bg px-2 py-1.5 outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:outline-outline"
                  type="text"
                  placeholder="Datapack Description"
                  onChange={(e) => setPackDesc(e.target.value)}
                ></input>
              </div>
            </div>
          </div>

          {/** Functionality Cluster */}
          <div class="mt-4 flex w-full justify-between">
            <div></div>

            <div class="flex gap-4">
              <button
                class="cursor-pointer rounded-full bg-primary px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-primary-hover"
                onClick={addNewItem}
              >
                Add Disc
              </button>
              <Dropdown
                item={selectedVersion}
                setSelectedItem={setSelectedVersion}
                list={datapackVersion}
              />
            </div>
          </div>

          <div class="mt-4 flex min-w-full flex-col gap-4">
            {customDiscs.map((disc) => (
              <DiscItem
                key={disc.id}
                id={disc.id}
                signal={collectionTrigger}
                onRemove={removeItem}
                onCollect={handleCollect}
                mcData={mcData}
              />
            ))}
          </div>

          <div class="flex w-full items-center justify-end gap-4">
						{downloadStatusMessage}
            <div
              class="my-4 cursor-pointer rounded-full bg-primary px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-primary-hover"
              onClick={handleSubmit}
            >
              Create Pack
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
