var portal = require('/lib/xp/portal');
var mustache = require('/lib/xp/mustache');
var repoLib = require('./services/repo/repo'); // move to lib?  


var view = resolve('./index.html');

function handleGet(req) {

    var params = {
        appVersion: app.version,
        assetUrl: portal.assetUrl('')
    };
    
    var body = mustache.render(view, params);

    return {
        contentType: 'text/html',
        headers: {
            'Service-Worker-Allowed': '/'
        },
        body: body
    };
}

exports.get = handleGet;

var REPO_NAME = app.name; // STORE CONFIG ONE PLACE INSTEAD OF THESE DUPLICATES
var REPO_BRANCH = "master";
var STORE_PATH = "/store";
var REPO_USER = {
    login: "su",
    userStore: "system"
};

var REPO_PRINCIPAL = ["role:system.admin"];

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

repoLib.initialize(REPO_NAME, ROOT_PERMISSIONS, REPO_USER, REPO_PRINCIPAL, STORE_PATH, REPO_BRANCH); 