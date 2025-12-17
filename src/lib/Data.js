export class MCData {
  constructor(verRange) {
    this.verRange = verRange.split("-");
    this.itemsArray = [];
  }

  async init() {
    try {
      let res = await fetch(`/minecraft-data/${this.verRange[0]}/items.json`);
      if (!res.headers.get("content-type")?.includes("application/json")) {
        res = await fetch(`/minecraft-data/${this.verRange[1]}/items.json`);
      }

      this.itemsArray = await res.json();
    } catch (e) {
      console.log("Error loading mc-data");
      console.log(e);
    }
  }

  itemLookUp(query) {
    query = query.toLowerCase();

    const matches = [];
    const MAX_MATCHES = 5;
    const terms = query.trim().split(" ");

    for (const item of this.itemsArray) {
      const itemName = item.displayName.toLowerCase();

      if (terms.every((t) => itemName.includes(t))) {
        matches.push(item.name);
      }

      if (matches.length > MAX_MATCHES) break;
    }

    matches.sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(query);
      const bStarts = b.toLowerCase().startsWith(query);
      if (aStarts && !bStarts) return 0;
      if (!aStarts && bStarts) return 1;
      return a.length - b.length;
    });

    return matches;
  }
}

const mcData = new MCData("1.21.1");
mcData.init();
