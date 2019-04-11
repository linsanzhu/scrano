class Pipeline {

    /**
     * 任务开启时调用, 用于前置处理, 如建立与数据库的连接
     */
    static engineOpended() {
        //
    }

    /**
     * 任务结束时调用, 用于后置处理, 如关闭与数据库的连接
     */
    static engineClosed() {
        //
    }

    /** 
     * 
     * @param {Item} item 
     * @param {Spider} spider 
     * @throws {DropItem} 表示item被处理, 不用向后继续传递了
     */
    static processItem(item, spider) {
        //
    }
}

module.exports = {
    Pipeline,
}