var repoLib = require("../../lib/repo/repo"); 
var repoConfig = require("../../lib/config/repoConfig"); 

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
    log.info("GET")
    var result = getItems(); 

    log.info(result.length)
    if(result === "NOT_FOUND") {
        return {
            status : 400, 
            message : "Not found"
        }
    }else{
        return {
            status : 200, 
            message : "Nodes deleted"
        }
    }
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
        return { 
            status: 200, 
            message: "" 
        }
    }
}




exports.delete = function (req){
    
    var item = JSON.parse(req.body);
    if (!item) {
        var message = "Missing/invalid item data in request";
        log.warning(message);
        return { 
            status: 400,
            message: message 
        };
    }

    var result = deleteNode(item);

    if(result === "NOT_FOUND") {
        return {
            status : 400, 
            message : "Not found"
        }
    } else {
        return {
            body: {result: result},
            headers: {
                "Content-Type": "application/json"
            }
        }
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
function getItems() {
    
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    var hits = repoConn.query({
        count: 1000,
        query: "_nodeType = 'default'"
    }).hits;
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
            repoConfig
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
                status: 500,
                message: "Could not create node"
            };
        } else {
            return { success: true };
        }
    } catch (e) {
        return {
            status: 500,
            message: "Couldn't create node"
        };
    }
};



var deleteNode = function (item) {

    log.info("DELETE:" + new Date() + JSON.stringify(item, null, 4))
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    
    var hits = repoConn.query({
        query: "item.id = " + item.id 
    }).hits;

    if (!hits || hits.length < 1) {
        return "NOT_FOUND";
    }

    hits.map(function(hit) {
        return repoConn.delete(hit.id)
    });
    
    repoConn.refresh();

    return { success: true };
};
