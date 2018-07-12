var repoLib = require("../repo/repo"); 


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
    log.info(JSON.stringify(req, null, 4));
    return {
        body: {
            text: "Hello from Server - GET"
        }
    };
}


/** 
 * Add to repo 
 */
exports.post = function(req) {
    /**
     * Get item from request 
     * if item is valid JSON, continue. 
     * 
     * Create a node based on the item. 
     * If creation successful, continue. 
     * 
     * Push node to repo 
     */

    var item = JSON.parse(req.body); 
    if(!item) {
        var message = "Missing/invalid item";
        return { status: 400, message: message };
    }

    var wasSuccessFul = createNode(item).success; 
    
    if(wasSuccessFul) {
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


var REPO_NAME = app.name; // STORE CONFIG ONE PLACE INSTEAD OF THESE DUPLICATES
var REPO_BRANCH = "master";
var ROOT_PERMISSIONS = [
    {
        principal: "role:system.everyone",
        allow: [
            "READ",
            "CREATE",
            "MODIFY",
            "DELETE",
            "PUBLISH",
            "READ_PERMISSIONS",
            "WRITE_PERMISSIONS"
        ],
        deny: []
    }
];
var STORE_PATH = "/store";

function getStoreItems() {
    var repoConn = repoLib.getRepoConnection(REPO_NAME, REPO_BRANCH); 
    var hits = repoConn.query({
        query: "item.id = " + id
    }).hits;

    if (!hits || hits.length < 1) {
        return "NOT_FOUND";
    }

    var todoItems = hits.map(function (hit) {
        return repoConn.get(hit.id);
    });
    if (todoItems) {
        return todoItems;
    } else {
        return "NOT_FOUND";
    } 
}

var createNode = function(item) {
    try {
        var node = repoLib.storeItemAndCreateNode(item, STORE_PATH, ROOT_PERMISSIONS, REPO_NAME, REPO_BRANCH); 
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