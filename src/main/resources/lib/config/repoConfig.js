/**
 * Configuration for repo connections with store 
 */
module.exports = {
    name : app.name, 
    branch : "master",
    path : "/repo",
    user : {
        login: "su",
        userStore: "system"
    }, 
    principal : ["role:system.admin"],
    permissions : [
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
    ]
}