var repoLib = require("../../lib/repo/repo"); 
var repoConfig = require("../../lib/config/repoConfig"); 

/**
 * Get get items from Repo 
 */
exports.get = function(req) {
    log.info("GET CATEGORY")
    var result = getItems(); 

    if(result === "NOT_FOUND") {
        return {
            status : 400, 
            message : "Not found"
        }
    }else{
        return {
            body: {items : result},
            headers: {
                "Content-Type": "application/json"
            }

        }
    }
}


/** 
 * Add to repo 
 */
exports.post = function(req) {
    var body = JSON.parse(req.body); 
    if(!body) {
        var message = "Missing/invalid body";
        return { status: 400, message: message };
    }

    var wasSuccessful = createNode(body).success; 
    
    if(wasSuccessful) {
        log.info("Added Category:" + JSON.stringify(body, null, 4)); 
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
    var item = JSON.parse(req.body);
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    var hits = repoConn.query({
        query: "item.id = " + item.id
    }).hits;
    if (!hits || hits.length < 1) {
        log.info("Node was not found. Creating a new one")
        var wasSuccessful = createNode(item).success; 
    
        if(wasSuccessful) {
            log.info("Added Item:" + JSON.stringify(item, null, 4)); 
            return { 
                status: 200, 
                message: "" 
            }
        }
    }

    var ids = hits.map(function (hit) {
        return hit.id;
    });

    var editor = function(node) {
        node.item.name = item.name
        node.item.info = item.info
        node.item.image = item.image
        node.item.visble = item.visible
        node.item.category = item.category
        return node; 
    }

    var result = repoConn.modify({
        key: ids[0], 
        editor : editor
    });
    repoConn.refresh();

    if(result){
        log.info("PUT")
        return {
            body: {
                status: 200
            }
        }

    } else {
        log.info("PUT ERROR")
        return {
            body: {
                status: 500,
                message: "Something went wrong when editing and item"
            }
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
 * Adds an category to repo 
 * @param category 
 */
var createNode = function(category) {
    try {
        var node = repoLib.storeItemAndCreateNode(
            category, 
            repoConfig
        ); 
        if (!node) {
            log.error(
                "Tried creating node, but something seems wrong: " +
                JSON.stringify(
                    {
                        incoming: category,
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
