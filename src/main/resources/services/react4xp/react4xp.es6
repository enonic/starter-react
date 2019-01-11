var ioLib = require('/lib/xp/io');
var utilLib = require('/lib/enonic/util');
var cacheLib = require('/lib/cache');

const ROOTNAME = "/_/service/" + app.name + "/react4xp/";
const REACT4XP_ASSETS = "/assets/react4xp/";


// TODO: For content-hashed chunks, Cache-Control should be "private, max-age=31536000". For others, 3 hours? Use commonChunks to separate!
// TODO: How to update ETag headers for non-cached, short-lived resources?
const react4xpCache = cacheLib.newCache({
    size: 30,
    expire: 10800, // 3 hours
});


const getReact4XP = (resource) => {
    const fileContent = utilLib.data.forceArray(ioLib.readLines(resource.getStream())).join("");
    return {
        body: fileContent,
        headers: {
            'Content-Type': 'application/javascript;charset=utf-8',
            'Cache-Control': 'max-age=10800' 
        }
    };
};




// Handle all GET requests
exports.get = function (req) {
    if ((req.path || "").startsWith(ROOTNAME)) {
        const target = (req.path.substring(ROOTNAME.length) || "").trim();
        if (!target) {
            return {
                status: 400,
            }
        }

        //log.info("React4xp target: " + JSON.stringify(target, null, 2));

        const resource = ioLib.getResource(REACT4XP_ASSETS + target);
        if (!resource || !resource.exists()) {
            log.warning(`File not found: ${REACT4XP_ASSETS + target}`);
            return {
                status: 404,
            }
        }

        return react4xpCache.get(target, function() {
            log.info("Caching React4XP component: " + target);
            return getReact4XP(resource);
        });

    } else {
        return {
            status: 400,
        }
    }
};
