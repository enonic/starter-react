const repoUrl = "/app/com.enonic.starter.react/_/service/com.enonic.starter.react/webStore";
    

export function add(item){

    return fetch(repoUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
    
}

export function remove(item){
    return fetch(repoUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
}

export function edit(item){
    return fetch(repoUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
}

export function get(){
    return fetch(repoUrl)
}
