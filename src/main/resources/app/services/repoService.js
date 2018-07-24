const itemRepoUrl = "/app/com.enonic.starter.react/_/service/com.enonic.starter.react/itemService";

const categoryRepoUrl = "/app/com.enonic.starter.react/_/service/com.enonic.starter.react/categoryService";
    
const imageRepoUrl = "/app/com.enonic.starter.react/_/service/com.enonic.starter.react/imageService";
    


/**
 * ITEMS
 */

export function addItem(item){

    return fetch(itemRepoUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
    
}

export function removeItem(item){
    return fetch(itemRepoUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
}

export function editItem(item){
    return fetch(itemRepoUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
}

export function getItems(){
    return fetch(itemRepoUrl)
        .then(response => response.length == 0  ? response : response.json()
            .then(data =>  data.nodes.filter(node => node.data ? node : null))
            .then(nodes => nodes.map(node => node.data))

        )
}



/**
 * CATEGORIES
 */

export function addCategory(item){

    return fetch(categoryRepoUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
    
}

export function removeCategory(item){
    return fetch(categoryRepoUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
}

export function editCategory(item){
    return fetch(categoryRepoUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
}

export function getCategories(){
    return fetch(categoryRepoUrl)
        .then(response => response.length == 0 ? response : response.json()
            .then(data =>  data.nodes.filter(node => node.data ? node : null))
            .then(nodes => nodes.map(node => node.data))
        )
}



/**
 * IMAGES
 */

export function addImage(item){

    return fetch(imageRepoUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
    
}

export function removeImage(item){
    return fetch(imageRepoUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
}

export function editImage(item){
    return fetch(imageRepoUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(item)
    })
}

export function getImage(){
    return fetch(imageRepoUrl)
        .then(response => response.json()
            .then(data =>  data.items.filter(node => node.item ? node : null))
            .then(nodes => nodes.map(node => node.item))
        )
}
