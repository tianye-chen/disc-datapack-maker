import { DiscItem } from "../Components/DiscItem"

export const DiscPackMaker = () => {

    const test = [1, 2, 3, 4, 5]

    return (
        <div class='text-primary-text min-w-screen'>
            <div class="font-bold text-4xl flex items-center justify-center mt-16 mb-8">
                Music Disc Datapack Maker
            </div>
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

            <div class='flex justify-center items-center flex-col gap-4 mt-4'>
                {test.map((data) => (
                        <DiscItem data={data} />
                ))}
            </div>
        </div>
    )
}