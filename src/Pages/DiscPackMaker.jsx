import { useCallback, useEffect, useRef, useState, version } from "react"
import { DiscItem } from "../Components/DiscItem"
import { Dropdown } from "../Components/Dropdown"
import { UploadBox } from "../Components/UploadBox"
import { createPack } from "../lib/PackSetup"
import { MCData } from "../lib/Data"

export const DiscPackMaker = () => {
    const [selectedVersion, setSelectedVersion] = useState("1.21-1.21.1")
    const [collectionTrigger, setCollectionTrigger] = useState(0)
    const [packImage, setPackImage] = useState(null)
    const [packTitle, setPackTitle] = useState("")
    const [packDesc, setPackDesc] = useState("")
    const [customDiscs, setCustomDiscs] = useState([{id: crypto.randomUUID()}])
    const datapackVersion = ["1.21-1.21.1", "1.21.5", "1.20-1.20.1", "1.19.4", "1.19-1.19.2"]
    const isCreatingPack = useRef(false)

    const mcData = new MCData(selectedVersion)
    mcData.init()

    const addNewItem = () => {
        setCustomDiscs(prev => [...prev, {id: crypto.randomUUID()}])
    }

    const removeItem = (id) => {
        setCustomDiscs(prev => prev.filter((item) => (item.id != id)))
    }

    const handleCollect = (id, data) => {
        setCustomDiscs(prev => {
            const newDiscs = [...prev]
            const discIndex = newDiscs.findIndex((item) => item.id === id)
            if (discIndex !== -1) {
                newDiscs[discIndex] = {
                    ...newDiscs[discIndex],
                    ...data
                }
            }

            return newDiscs
        })
    }

    const handleSubmit = () => {
        setCollectionTrigger(prev => prev + 1)
        isCreatingPack.current = true
    }

    useEffect(() => {
        if (isCreatingPack.current) {
            createPack({
                version: selectedVersion,
                packTitle: packTitle,
                packDesc: packDesc,
                packImage: packImage,
                discs: customDiscs
            })
            isCreatingPack.current = false
        }
    }, [customDiscs])

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
                        {customDiscs.map((disc) => (
                            <DiscItem 
                                key={disc.id}
                                id={disc.id}
                                signal={collectionTrigger}
                                onRemove={removeItem}
                                onCollect={handleCollect}
                            />
                        ))}
                    </div>

                    <div class="flex justify-end items-end w-full">
                        <div class="bg-primary px-4 py-2.5 my-4 rounded-full cursor-pointer" onClick={handleSubmit}>
                            Create Pack    
                        </div>                     
                    </div>
                </div>
            </div>
        </div>
    )
}