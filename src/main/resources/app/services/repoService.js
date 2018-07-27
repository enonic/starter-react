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

export function addImage(image){
    return fetch(imageRepoUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(image)
    })
    
}

export function removeImage(image){
    return fetch(imageRepoUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(image)
    })
}

export function editImage(image){
    let formdata = new FormData()
    formdata.append('name', image.name)
    formdata.append('id', image.id)
    formdata.append('type', image.type)
    image.file ? formdata.append('file', image.file)
        :   formdata.append('source', image.name)

    return fetch(imageRepoUrl, {
        method: "PUT",
        body: formdata
    })

}



export function getImages(){
    return fetch(imageRepoUrl)
        .then(response => response.length == 0 ? response : response.json()
            .then(data =>  data.nodes.filter(node => node.data ? node : null))
            .then(nodes => nodes.map(node => node.data))
        )
}
