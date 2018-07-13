export const actions = {
    addImage: 'ADD_IMAGE',
    deleteImage: 'DELETE_IMAGE'
}

function addImageAction(arg) {
    return {
        type: actions.addImage,
        image: arg
    }
}

function deleteImageAction(arg) {
    return {
        type: actions.deleteImage,
        image: arg
    }
}




export function addImage(dispatch, arg) {
    dispatch(addImageAction(arg))
}

export function deleteImage(dispatch, arg) {
    dispatch(deleteImageAction(arg));
}