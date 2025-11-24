export const DiscItem = (props) => {
    return (
        <div class='w-full bg-card-bg p-4 rounded-xl'>
            <div class='aspect-square max-w-32 bg-upload-bg border-2 border-dashed rounded-2xl border-[#ffffff55]'>
                <div class='flex items-center justify-center min-h-full min-w-full text-xs'>
                    Upload Disc Sprite
                </div>
            </div>
            {props.data}
            <div onClick={() => props.remove(props.index)}>
                Delete
            </div>
        </div>
    )
}