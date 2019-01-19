var ioLib = require('/lib/xp/io');
var utilLib = require('/lib/enonic/util');
var cacheLib = require('/lib/cache');

// TODO: centralize this even more? Along with other strings that must match?
const R4X = 'react4xp';

const SERVICE_ROOT = `/_/service/${app.name}/${R4X}/`;
const REACT4XP_ROOT = `/${R4X}/`;


// TODO: For content-hashed chunks, Cache-Control should be "private, max-age=31536000". For others, 3 hours? Use commonChunks to separate!
// TODO: How to update ETag headers for non-cached, short-lived resources?
const react4xpCache = cacheLib.newCache({
    size: 30,
    expire: 10800, // 3 hours
});


const getReact4XP = (resource) => {
    const fileContent = utilLib.data.forceArray(ioLib.readLines(resource.getStream())).join("\n");
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
    if ((req.path || "").startsWith(SERVICE_ROOT)) {
        const target = (req.path.substring(SERVICE_ROOT.length) || "").trim();
        if (!target) {
            return {
                status: 400,
            }
        }

        //log.info("React4xp target: " + JSON.stringify(target, null, 2));

        const resource = ioLib.getResource(REACT4XP_ROOT + target);
        if (!resource || !resource.exists()) {
            log.warning(`File not found: ${REACT4XP_ROOT + target}`);
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
