class Item {
    toString() {
        return `<Item ${this.constructor.name}>`
    }
}

module.exports = {
    Item,
}