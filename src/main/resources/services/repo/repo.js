var repoLib = require("/lib/xp/repo");
var nodeLib = require("/lib/xp/node");
var contextLib = require("/lib/xp/context");


/**
 * Returns a connection to the repo. Low-level permission, unless part of functions that are wrapped in {@link sudo}.
 * @public
 * @param name of the repo 
 * @param branch in the repo 
 */
var getRepoConnection = exports.getRepoConnection = function(name, branch) { 
    return nodeLib.connect({
        repoId: name,
        branch: branch,
    });
}

/** 
 * Initialize a repository 
 * @param name of the repo   
 * @param permissions for the repository 
 * @param path of repository 
 * @param branch in repository
 */
var doInitialize = function (name, permissions, path, branch) {
    var result = repoLib.get(name);
    if (!result) {
        createRepo(name, permissions);
    }

    if (!repoLib.get(name)) {
        throw Error('Something went wrong when creating (and/or getting) repo:' + name);
    }

    //Creates repositories
    createNode(path, permissions, name, branch); 
};

/**
 * Creates a new repo 
 * @param name of repo 
 * @param permissions for repo 
 */
var createRepo = function (name, permissions) {
    log.info('Creating repository: ' + name);
    repoLib.create({
        id: name,
        rootPermissions: permissions
    });
};

/**
 * Checks if there is a node with the given path 
 * @param repoConnection 
 * @param path 
 */
var nodeWithPathExists = function(repoConnection, path) {
    var result = repoConnection.query({
        start: 0,
        count: 0,
        query: "_path = '" + path + "'"
    });
    return result.total > 0;
};

/**
 * Creates node, if it does not exist 
 * @param path for access 
 * @param permissions to the repo 
 * @param name of repo 
 * @param branch in repo 
 */
function createNode(path, permissions, name, branch) {
    var repoConn = getRepoConnection(name, branch);

    var pushSubscriptionsExist = nodeWithPathExists(repoConn, path);

    if (pushSubscriptionsExist) {
        // Node exists
        return;
    }

    repoConn.create({
        _name: path.slice(1),
        _parentPath: '/',
        _permissions: permissions
    });
}


/**
 * Initializing connection with repo 
 * @param name of repository 
 * @param permissions permissions of repository 
 * @param user user for the repository 
 * @param principal principal for repository 
 * @param path path to repository 
 * @param branch in repository 
 */
exports.initialize = function(name, permissions, user, principal, path, branch) {
    log.info("Initializing repository...");
    exports.sudo(function() {
        doInitialize(name, permissions, path, branch);
    },user, principal); 
};

/**
 * @param func {(name, permissions) => void} intialize function 
 * @param user repo user 
 * @param principal principal of repo 
 */
exports.sudo = function (func, user, principal) {
    return contextLib.run({
        user: user,
        principals: principal,
    }, func);
};

// Very similar to createNode above. Refactor. 
/**
 * DESCRIPTION 
 * @param item to store
 * @param path path to repository
 * @param permissions for repository
 * @param name of repository 
 * @param branch in repository 
 */
exports.storeItemAndCreateNode = function(item, path, permissions, name, branch) {
    var repoConn = getRepoConnection(name, branch);
    var node = repoConn.create({
        _parentPath: path,
        _permissions: permissions,
        item: item
    })

    repoConn.refresh();
    return node;
}
