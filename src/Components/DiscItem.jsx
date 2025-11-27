export const DiscItem = (props) => {
    return (
        <div class='w-full bg-card-bg p-4 rounded-xl flex flew-row gap-4 justify-between'>
            <div class='flex flex-row gap-12'>
                <div class='aspect-square min-w-36 max-w-36 bg-upload-bg border-2 border-dashed rounded-2xl border-[#ffffff55]'>
                    <div class='flex items-center justify-center min-h-full min-w-full text-xs'>
                        Upload Disc Sprite
                    </div>
                </div>

                <div class='flex flex-col gap-2'>
                    <div>
                        Title
                        <div class="bg-upload-bg py-1.5 px-2 rounded-full mt-1 outline-2 outline-transparent focus-within:outline-outline transition-all ease-in-out duration-300">
                            <input class="outline-none mx-2" type="text" placeholder="Enter song title"></input>
                        </div>
                    </div>

                    <div>
                        Author
                        <div class="bg-upload-bg py-1.5 px-2 rounded-full mt-1 outline-2 outline-transparent focus-within:outline-outline transition-all ease-in-out duration-300">
                            <input class="outline-none mx-2" type="text" placeholder="Enter author name"></input>
                        </div>
                    </div>
                </div>
            </div>

        
            <div class="flex items-end">
                <div class="bg-bad py-2 px-4 rounded-full hover:bg-bad-hover cursor-pointer" onClick={() => props.remove(props.index)}>
                    Delete
                </div>
            </div>
        </div>
    )
}