import { useEffect, useState } from "react"
import { DiscItem } from "../Components/DiscItem"
import { Dropdown } from "../Components/Dropdown"

export const DiscPackMaker = () => {
    const [selectedVersion, setSelectedVersion] = useState(1.21)
    const [customDiscs, setCustomDiscs] = useState([0])
    const datapackVersion = [1.21, 1.22, 1.23, 1.24, 1.25]

    const addNewItem = () => {
        setCustomDiscs(prev => [...prev, prev[prev.length-1]+1])
    }

    const removeItem = (index) => {
        setCustomDiscs(prev => prev.filter((v, i) => (i != index)))
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
                        <div class="bg-upload-bg aspect-square max-w-sm min-w-sm border-4 border-dashed border-[#ffffff55] mr-4 rounded-2xl">
                            <div class="flex items-center justify-center min-h-full">
                                Upload Pack Image
                            </div>
                        </div>
                        <div>
                            <div class="font-bold text-6xl mb-4">Data pack title</div>
                            <div class="font-thin text-4xl">Data pack description</div>
                        </div>
                    </div>

                    {/** Functionality Cluster */}
                    <div class='w-full mt-4 flex justify-between'>
                        <div></div>

                        <div class="flex gap-4">
                            <button class="bg-primary px-4 py-2.5 rounded-full cursor-pointer" onClick={addNewItem}>
                                    Add item
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
                                data={data}
                                index={index}
                                remove={removeItem}
                            />
                        ))}
                    </div>

                    <div class="flex justify-end w-full">
                        <div class="bg-primary px-4 py-2.5 my-4 rounded-full cursor-pointer">
                            Create Pack    
                        </div>                     
                    </div>
                </div>
            </div>
        </div>
    )
}