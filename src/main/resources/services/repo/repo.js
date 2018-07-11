
/**
 * Get get items from Repo 
 */
exports.get = function(req) {
    log.info(JSON.stringify(req, null, 4)); 
    return {
        body: {
            text : "hi"
        }, 
        headers: {
            "Content-Type": "application/json"
        }
    };
}


/** 
 * Replace or add to repo
 */
exports.put = function(req) {
    return {
        body: {
            notice : "Not implemented"
        }
    }
}

