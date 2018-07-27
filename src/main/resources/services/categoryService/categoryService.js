var repoLib = require("../../lib/repo/repo"); 
var repoConfig = require("../../lib/config/repoConfig"); 

/**
 * Get get categories from Repo 
 */
exports.get = function(req) {
    log.info("GET CATEGORY")
    var result = getCategories(); 

    return {
        body: {nodes : result},
        headers: {
            "Content-Type": "application/json"
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
    
    log.info(JSON.stringify(req, null, 2))
    var body = JSON.parse(req.body);
    if (!body) {
        var message = "Missing/invalid node data in request";
        log.warning(message);
        return { 
            status: 400,
            message: message 
        };
    }

    var result = deleteNode(body);

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
 * Replace category
 */
exports.put = function(req) {
    log.info("PUT CATEGORY")
    var body = JSON.parse(req.body);
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    var hits = repoConn.query({
        query: "data.type = 'category' AND data.id = '" + body.id + "'"
    }).hits;

    if (!hits || hits.length < 1) {
        log.info("Node was not found. Creating a new one")
        var wasSuccessful = createNode(body).success; 
    
        if(wasSuccessful) {
            log.info("Added node:" + JSON.stringify(body, null, 4)); 
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
        node.data.title = body.title
        node.data.filter = body.filter
        node.data.visble = body.visible
        return node; 
    }

    var result = repoConn.modify({
        key: ids[0], 
        editor : editor
    });
    repoConn.refresh();

    if(result){
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
                message: "Something went wrong when editing node"
            }
        }
    }
}

/**
 * NOT DONE 
 * Returns all categories in repo
 */
function getCategories() {
    
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    var hits = repoConn.query({
        count: 1000,
        query: "data.type = 'category'"
    }).hits;
    if (!hits || hits.length < 1) {
        return hits;
    }

    var categories = hits.map(function (hit) {
        return repoConn.get(hit.id);
    });

    if (categories) {
        return categories;
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
        var node =  repoLib.storeCategoryAndCreateNode(
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



var deleteNode = function (body) {

    log.info("DELETE:" + new Date() + JSON.stringify(body, null, 4))
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    
    var hits = repoConn.query({
        query: "data.type = 'category' AND data.id = '" + body.id + "'"
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
