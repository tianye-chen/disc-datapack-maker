import { useEffect, useState } from "react"
import { DiscItem } from "../Components/DiscItem"
import { Dropdown } from "../Components/Dropdown"
import { UploadBox } from "../Components/UploadBox"
import { add } from "three/tsl"

export const DiscPackMaker = () => {
    const [selectedVersion, setSelectedVersion] = useState("1.21 - 1.12.1")
    const [collectionTrigger, setCollectionTrigger] = useState(0)
    const [packImage, setPackImage] = useState(null)
    const [packTitle, setPackTitle] = useState("")
    const [packDesc, setPackDesc] = useState("")
    const [nDiscs, setNDiscs] = useState(1)
    const [customDiscs, setCustomDiscs] = useState([])
    const datapackVersion = ["1.21 - 1.12.1", "1.20.5 - 1.20.6", "1.20.2 - 1.20.4", "1.20 - 1.20.1", "1.19.3 - 1.19.4", "1.19 - 1.19.2"]

    const addNewItem = () => {
        setCustomDiscs(prev => [...prev, 1])
    }

    const removeItem = (index) => {
        setCustomDiscs(prev => prev.filter((v, i) => (i != index)))
    }

    const handleDiscImageUpload = (file, index) => {
        const newDiscs = [...customDiscs]
        newDiscs[index].image = file
        setCustomDiscs(newDiscs)
    }

    const handleCollect = (id, data) => {

    }

    const handleSubmit = () => {
        setCollectionTrigger(prev => prev + 1)
    }

    return (
        <div class='text-primary-text min-w-screen'>
            <div class="font-bold text-4xl flex items-center justify-center mt-16 mb-8">
                Music Disc Datapack Maker
            </div>
            <div class="flex items-center justify-center mb-4">
                <div class="min-h-24 bg-upload-bg w-[468px] h-[60px]">
                    Ad Space
                </div>
            </div>
            
            <div class="flex justify-center">
                <div class="flex flex-col items-start w-2/3">

                    {/** Title and pack image */}
                    <div class="flex min-h-64 justify-center items-start">
                        <div class={`bg-upload-bg aspect-square max-w-sm min-w-sm mr-4 rounded-2xl`}>
                            <UploadBox 
                                uploadMessage={"Upload Pack Image"}
                                size="big"
                                onFileUpload={setPackImage}
                            />
                        </div>
                        <div>
                            <div class="font-bold text-6xl mb-4">
                                <input
                                    class="bg-upload-bg rounded-lg px-2 py-1.5 outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:outline-outline"
                                    type="text"
                                    placeholder="Datapack Title"
                                    onChange={(e) => setPackTitle(e.target.value)}
                                ></input>
                            </div>
                            <div class="font-thin text-4xl">
                                <input
                                    class="bg-upload-bg rounded-lg w-full px-2 py-1.5 outline-2 outline-transparent transition-all duration-300 ease-in-out focus-within:outline-outline"
                                    type="text"
                                    placeholder="Datapack Description"
                                    onChange={(e) => setPackDesc(e.target.value)}
                                ></input>
                            </div>
                        </div>
                    </div>

                    {/** Functionality Cluster */}
                    <div class='w-full mt-4 flex justify-between'>
                        <div></div>

                        <div class="flex gap-4">
                            <button class="bg-primary px-4 py-2.5 rounded-full cursor-pointer" onClick={addNewItem}>
                                    Add disc
                            </button>
                            <Dropdown 
                                    item={selectedVersion}
                                    setSelectedItem={setSelectedVersion}
                                    list={datapackVersion}
                            />
                        </div>
                    </div>

                    <div class='flex flex-col gap-4 mt-4 min-w-full'>
                        {customDiscs.map((data, index) => (
                            <DiscItem 
                                signal={collectionTrigger}
                                data={data}
                                index={index}
                                onRemove={removeItem}
                                onCollect={handleCollect}
                                handleDiscImageUpload={handleDiscImageUpload}
                            />
                        ))}
                    </div>

                    <div class="flex justify-end items-end w-full" onClick={handleSubmit}>
                        <div class="bg-primary px-4 py-2.5 my-4 rounded-full cursor-pointer">
                            Create Pack    
                        </div>                     
                    </div>
                </div>
            </div>
        </div>
    )
}