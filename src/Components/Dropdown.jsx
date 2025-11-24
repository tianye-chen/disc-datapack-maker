import { useState } from "react"

export const Dropdown = (props) => {
    const [showDropdown, setShowDropdown] = useState(false)
    
    const onMenuClick = (listItem) => {
        props.setSelectedItem(listItem)
        setShowDropdown(false)
    }

    return (
        <div class="relative inline-block items-center z-10" onMouseOver={(e) => {setShowDropdown(true)}} onMouseLeave={(e) => {setShowDropdown(false)}}>
           <div class="text-primary-text px-4 py-2.5 rounded-full cursor-pointer bg-upload-bg hover:bg-primary transition-all ease-in-out duration-200 select-none">
                Version: {props.item} <span class="text-[0.5rem]">▼</span>
           </div>

           <div class={`absolute left-1/2 -translate-x-1/2 top-full transition-all ease-in-out duration-200 scale-75 ${showDropdown ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}>
            <div class="my-2.5 w-full"></div>
            <div class={` bg-upload-bg px-3 py-2 rounded-2xl`}>
                    {props.list.map(((listItem) => {
                        return (
                            <div class="bg-upload-bg text-primary-text rounded-full cursor-pointer px-4 py-2 my-1 w-full text-nowrap hover:bg-primary transition-all ease-in-out duration-200" onClick={() => onMenuClick(listItem)}>
                                {listItem}
                            </div>
                        )
                    }))}
            </div>
           </div>
        </div>
    )
}