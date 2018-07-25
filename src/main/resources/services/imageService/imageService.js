var repoLib = require("../../lib/repo/repo"); 
var repoConfig = require("../../lib/config/repoConfig"); 

/**
 * Get get images from Repo 
 */
exports.get = function(req) {

    log.info("GET_IMAGE")
    var result = getImages(); 
    return {
        body: {nodes: result},
        headers: {
            "Content-Type": "application/json"
        }

    }
    
}


/** 
 * Add to repo 
 */
exports.post = function(req) {
    log.info("post")
    var body = JSON.parse(req.body); 
    if(!body) {
        var message = "Missing/invalid image";
        return { status: 400, message: message };
    }

    var wasSuccessful = createNode(body).success; 
    
    if(wasSuccessful) {
        log.info("Added image:" + JSON.stringify(body, null, 4)); 
        return { 
            status: 200, 
            message: "" 
        }
    }
}




exports.delete = function (req){
    
    var body = JSON.parse(req.body);
    if (!body) {
        var message = "Missing/invalid image data in request";
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
 * Replace image
 */
exports.put = function(req) {
    var body = JSON.parse(req.body);
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    var hits = repoConn.query({
        query: "data.type = 'image' AND data.id = '" + body.id + "'"
    }).hits;
    if (!hits || hits.length < 1) {
        log.info("Node was not found. Creating a new one")
        var wasSuccessful = createNode(body).success; 
    
        if(wasSuccessful) {
            log.info("Added image:" + JSON.stringify(body, null, 4)); 
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
        node.body.name = body.name
        node.body.image = body.image
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
                message: "Something went wrong when editing and image"
            }
        }
    }
}

/**
 * NOT DONE 
 * Returns all images in repo
 */
function getImages() {
    
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    var hits = repoConn.query({
        count: 1000,
        query: "data.type = 'image'"
    }).hits;
    if (!hits || hits.length < 1) {
        return hits;
    }

    var images = hits.map(function (hit) {
        return repoConn.get(hit.id);
    });

    return images;
    
}

/**
 * Adds an image to repo 
 * @param image 
 */
var createNode = function(image) {
    try {
        var node = repoLib.storeImageAndCreateNode(
            image, 
            repoConfig
        ); 
        if (!node) {
            log.error(
                "Tried creating node, but something seems wrong: " +
                JSON.stringify(
                    {
                        incoming: image,
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



var deleteNode = function (image) {

    log.info("DELETE:" + new Date() + JSON.stringify(image, null, 4))
    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    
    var hits = repoConn.query({
        query: "data.type = 'image' AND data.id = '" + image.id + "'"
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
