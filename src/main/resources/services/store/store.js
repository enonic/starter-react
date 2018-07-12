var repoLib = require("../../lib/repo/repo"); 
var StoreConfig = require("../../lib/storeConfig/storeConfig"); 

/**
 * Get get items from Repo 
 */
exports.get = function(req) {
    /**
     * Search in repo for item. 
     * If found, get it and continue 
     * 
     * Convert repo-node to item that client expects 
     * Return the item
     */
    var responseFromGetting = getStoreItems(); 

    if(responseFromGetting === "NOT_FOUND") {
        return {
            status : 400, 
            message : "Not found"
        }
    }

    log.info("Response from getting: " + JSON.stringify(responseFromGetting, null, 4)); 
}


/** 
 * Add to repo 
 */
exports.post = function(req) {
    var item = JSON.parse(req.body); 
    if(!item) {
        var message = "Missing/invalid item";
        return { status: 400, message: message };
    }

    var wasSuccessful = createNode(item).success; 
    
    if(wasSuccessful) {
        log.info("Added Item:" + JSON.stringify(item, null, 4)); 
    }
}


/**
 * Replace item
 */
exports.put = function(req) {
    return {
        body: {
            notice: "PUT not implemented"
        }
    }
}

/**
 * NOT DONE 
 * Returns all items in repo
 */
function getStoreItems() {
    var repoConn = repoLib.getRepoConnection(StoreConfig.name, StoreConfig.branch);
    var hits = repoConn.query().hits;

    if (!hits || hits.length < 1) {
        return "NOT_FOUND";
    }

    var items = hits.map(function (hit) {
        return repoConn.get(hit.id);
    });

    if (items) {
        return items;
    } else {
        return "NOT_FOUND";
    } 
}

/**
 * Adds an item to repo 
 * @param item 
 */
var createNode = function(item) {
    try {
        var node = repoLib.storeItemAndCreateNode(
            item, 
            StoreConfig.path, 
            StoreConfig.permissions, 
            StoreConfig.name, 
            StoreConfig.branch
        ); 
        if (!node) {
            log.error(
                "Tried creating node, but something seems wrong: " +
                JSON.stringify(
                    {
                        incoming_item: item,
                        resulting_node: node
                    },
                    null,
                    2
                )
            );

            return {
                count : "firstError", 
                status: 500,
                message: "Could not create node"
            };
        } else {
            return { success: true };
        }
    } catch (e) {
        return {
            count: "secondError", 
            status: 500,
            message: "Couldn't create node"
        };
    }
};