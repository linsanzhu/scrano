class Item {
    toString() {
        return `<Item ${this.name}>`
    }
    engineOpended() {
        //
    }
    
    engineClosed() {
        //
    }
    
    /** 处理由spider返回的item
     * 若返回undefine/null, 或者Item实例, 则继续交由下一个pipeline处理
     * 若返回其他对象,则通过engine交由调度器调度
     * 若抛出DropItem异常,则不再继续交由其他pipeline处理
     * @param {Item} item 
     * @param {Spider} spider 
     */
    processItem(item, spider) {
        //
    }
}

module.exports = {
    Item,
}
