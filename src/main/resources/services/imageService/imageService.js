var repoLib = require("../../lib/repo/repo"); 
var repoConfig = require("../../lib/config/repoConfig"); 
var portalLib = require('/lib/xp/portal');
var valueLib = require('/lib/xp/value');

/**
 * Get get images from Repo 
 */
exports.get = function(req) {

    log.info("GET_IMAGE")
    var result = getImages(); 
    return {
        body: {nodes: result},

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
        log.info(body.file ? true : false)
        if(body.file){
            log.info("Added image with file")

        } else {
            log.info("Added image:" + JSON.stringify(body, null, 4)); 
        }
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




function createImage(albumId, publish, fileIndex) {
    var part = portalLib.getMultipartItem("file", fileIndex);
    if (part.fileName && part.size > 0) {

        //Retrieves the album
        var album = imageXpertLib.getContentByKey(albumId);
        if (!album || album.type != (app.name + ":album" )) {
            log.error('No album: %s', albumId);
            return null;
        }

        //Creates the image
        var content = contentLib.createMedia({
            name: part.fileName,
            parentPath: album._path,
            mimeType: part.contentType,
            branch: "draft",
            focalX: 0.5,
            focalY: 0.5,
            data: portalLib.getMultipartStream("file", fileIndex)
        });

        //Updates the image with meta data
        var caption = portalLib.getMultipartText("caption");
        var artist = portalLib.getMultipartText("artist");
        var tags = portalLib.getMultipartText("tags");
        contentLib.modify({
            key: content._id,
            branch: "draft",
            editor: function (media) {
                media.data.caption = caption;
                media.data.artist = artist;
                media.data.tags = tags;
                return media;
            }
        });

        if (publish) {
            contentLib.publish({
                keys: [content._id],
                sourceBranch: 'draft',
                targetBranch: 'master'
            });
        }

        return content;
    }
    return null;
}


exports.put = function(req) {
    
    var body = {
        name: portalLib.getMultipartText('name'),
        id: portalLib.getMultipartText('id'),
        type: portalLib.getMultipartText('type')
    }
    
    
    var source = portalLib.getMultipartText('source')

    var file = portalLib.getMultipartItem('file')
    

    if (file.fileName && file.size > 0) {
        body['file'] = valueLib.binary('file' , portalLib.getMultipartStream('file'))
        log.info(body.file)
    } else if (source) {
        body['source'] = source
    }


    var repoConn = repoLib.getRepoConnection(repoConfig.name, repoConfig.branch);
    var hits = repoConn.query({
        query: "data.type = 'image' AND data.id = '" + body.id + "'"
    }).hits;
    if (!hits || hits.length < 1) {
        log.info("Node was not found. Creating a new one")
        var wasSuccessful = createNode(body).success; 
    
        if(wasSuccessful) {
            if(body.file){
                log.info("Added image ")
                
            } else {
                log.info("Added image:" + JSON.stringify(body, null, 4)); 
            }
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
        node.data.name = body.name
        node.data.source = body.source
        if(body.file){
            node.data.file = body.file
        }
        return node; 
    }

    var result = repoConn.modify({
        key: ids[0], 
        editor : editor
    });
    repoConn.refresh();

    if(result){
        if(body.file){
            log.info("PUT_IMAGE ")
        } else {
            log.info("PUT_IMAGE "+ JSON.stringify(body, null, 4))
        }
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

    var images = hits.filter(function (hit) {
        var image = repoConn.get(hit.id);
        if (image.data.file){
            log.info("getting stream")
            image.data.file = repoConn.getBinary({
                key: hit.id,
                binaryReference: "file"
            });
            log.info(image.data.file)
            return image
        }
    });

    return images[0];
    
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
        query: "data.type = 'image' AND data.id = " + image.id 
    }).hits;
    log.info(hits.length)
    /*
    hits = hits.filter(function(hit) {
        var repoImage = repoConn.get(hit.id)
        if(repoImage.data.id == image.id){
            return repoImage
        }
    })
    */

    if (!hits || hits.length < 1) {
        return "NOT_FOUND";
    }

    hits.map(function(hit) {
        return repoConn.delete(hit.id)
    });
    
    repoConn.refresh();

    return { success: true };
};
