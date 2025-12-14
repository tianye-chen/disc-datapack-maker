export class MCData{
    constructor(verRange) {
        this.verRange = verRange.split('-')
        this.itemsArray = []
    }

    async init(){
        try {
            let res = await fetch(`/minecraft-data/${this.verRange[0]}/items.json`)
            if (!res.headers.get("content-type")?.includes("application/json")){
                res = await fetch(`/minecraft-data/${this.verRange[1]}/items.json`)
            }

            this.itemsArray = await res.json()
        } catch (e){
            console.log('Error loading mc-data')
            console.log(e)
        }
    }

    itemLookUp (typeAhead) {
        const matches = []
        const MAX_MATCHES = 5

        for (const item of this.itemsArray){
            if (item.displayName.toLowerCase().startsWith(typeAhead)) {
                const matchedItem = item.name

                matches.push(matchedItem)
            }

            if (matches.length > MAX_MATCHES) {
                break
            }
        }

        return matches
    }
}

const mcData = new MCData('1.21.1')
mcData.init()