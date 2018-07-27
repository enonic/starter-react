var repo = require("/lib/xp/repo");
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
    var result = repo.get(name);
    if (!result) {
        createRepo(name, permissions);
    }

    if (!repo.get(name)) {
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
    repo.create({
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

    var node = nodeWithPathExists(repoConn, path);

    if (node) {
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
 * @param config configuration of repo 
 */
exports.initialize = function(config) {
    log.info("Initializing repository...");
    exports.sudo(function() {
        doInitialize(config.name, config.permissions, config.path, config.branch);
    }, config.user, config.principal); 
};

/**
 * @param func {(name, permissions) => void} initialize function 
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
exports.storeItemAndCreateNode = function(data, config) {
    var repoConn = getRepoConnection(config.name, config.branch);
    var node = repoConn.create({
        _parentPath: config.path,
        _permissions: config.permissions,
        data: data
    })
    repoConn.refresh();
    return node;
}

exports.storeCategoryAndCreateNode = function(data, config) {
    var repoConn = getRepoConnection(config.name, config.branch);
    var node = repoConn.create({
        _parentPath: config.path,
        _permissions: config.permissions,
        data: data
    })

    repoConn.refresh();
    return node;
}

exports.storeImageAndCreateNode = function(data, config) {
    var repoConn = getRepoConnection(config.name, config.branch);
    var node = repoConn.create({
        _parentPath: config.path,
        _permissions: config.permissions,
        data: data
    })

    repoConn.refresh();
    return node;
}