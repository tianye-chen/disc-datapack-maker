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
    "1.21.6-1.21.11",
    "1.21.5",
    "1.21-1.21.1",
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
    <main className="min-w-screen text-primary-text" role="main">
      <div className="mt-16 mb-8 flex flex-col items-center justify-center">
        <h1 className="sr-only">MC Disc – Minecraft Custom Music Disc Datapack Maker</h1>
        <img
          src="/mcdisc_logo_light.png"
          width={600}
          height={200}
          alt="MC Disc – Create custom music disc datapacks for Minecraft"
          fetchPriority="high"
        />
      </div>
      <div className="mb-4 flex items-center justify-center">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1951180234830251"
     crossorigin="anonymous"></script>
      </div>

      <div className="flex justify-center">
        <div className="flex w-2/3 flex-col items-start">
          {/** Title and pack image and description*/}
          <section className="flex min-h-64 items-start min-w-full justify-center" aria-label="Pack details">
            <div
              className={`mr-4 aspect-square max-w-sm min-w-sm rounded-2xl bg-upload-bg`}
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
          </section>

          {/** Functionality Cluster */}
          <section className="mt-4 flex w-full justify-between" aria-label="Add discs and select version">
            <div></div>

            <div className="flex gap-4">
              <button
                type="button"
                className="cursor-pointer rounded-full bg-primary px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-primary-hover"
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
          </section>

          <div className="mt-4 flex min-w-full flex-col gap-4">
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

          <div className="flex w-full items-center justify-end gap-4">
						{downloadStatusMessage}
            <button
              type="button"
              className="my-4 cursor-pointer rounded-full bg-primary px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-primary-hover"
              onClick={handleSubmit}
            >
              Create Pack
            </button>
          </div>
        </div>
      </div>

      <section className="flex justify-center items-center w-full px-48 py-16 flex-col" aria-labelledby="how-to-install">
        <h2 id="how-to-install" className="text-4xl font-bold mb-4">How to install</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to your downloads and find the generated zip file.</li>
          <li>In another file explorer window, go to <strong>%appdata%</strong>, then <strong>.minecraft</strong>, then <strong>resourcepacks</strong>.</li>
          <li>Copy the zip file into the <strong>resourcepacks</strong> folder.</li>
          <li>Go back to <strong>.minecraft</strong>, go to <strong>saves</strong>, then <strong>YOUR_WORLD_NAME</strong>, then <strong>datapacks</strong>.</li>
          <li>Copy the same zip file into the <strong>datapacks</strong> folder.</li>
          <li>In Minecraft, go to <strong>Options</strong> &gt; <strong>Resource Packs</strong>, and enable the pack.</li>
          <li> <strong>7.</strong> Enjoy!</li>
          <li> <strong>Tip.</strong> To easily get the music discs, type the command <strong>/recipe give YOUR_NAME *</strong> then go to a <strong>crafting table</strong>, and open <strong>recipe book</strong>, toggle <strong>Show all recipes</strong>, and <strong>search for disc</strong></li>
        </ol>
      </section>
    </main>
  );
};
