
class DownloadMiddleware {
    static processRequest({request, spider, }) {
        //
    }

    static processResponse({response, spider, }) {
        //
    }

    static processException({request, exception, spider, }) {
        //
    }
}


class SpiderMiddleware {
    static processSpiderInput({response, spider, }) {
        //
    }

    static processSpiderOutput({response, result, spider, }) {
        //
    }

    static processSpiderException({response, exceptions, spider, }) {
        //
    }

    static processStartRequests(startRequests, spider) {
        //
    }
}

module.exports = {
    DownloadMiddleware,
    SpiderMiddleware,
}