


pushRepo.initialize(REPO_NAME, ROOT_PERMISSIONS);

/**
 * Get get items from Repo 
 */
exports.get = function (req) {
    log.info(JSON.stringify(req, null, 4));
    return {
        body: {
            text: "Hello from Server"
        }
    };
}


/** 
 * Replace or add to repo
 */
exports.put = function (req) {
    return {
        body: {
            notice: "Not implemented"
        }
    }
}