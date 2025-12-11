import minecraftData from 'minecraft-data'

export class MCData{
    constructor(mcVersion) {
        this.mcData = minecraftData(mcVersion)
        this.itemsArray = this.mcData.itemsArray
    }

    itemLookUp (typeAhead) {
        const matches = []
        const MAX_MATCHES = 5

        this.itemsArray.forEach((item) => {
            if (item.displayName.toLowerCase().startsWith(typeAhead)) {
                const matchedItem = {
                    name: item.displayName,
                    idName: "minecraft:"+item.name
                }

                matches.push(matchedItem)
                if (matches.length > MAX_MATCHES) {
                    return
                }
            }
        })

        return matches
    }
}