export const actions = {
    addImage: 'ADD_IMAGE',
    deleteImage: 'DELETE_IMAGE',
    changeImage: 'CHANGE_IMAGE',
    save: 'SAVE_IMAGES',
    cancelSave: 'CANCEL_SAVE_IMAGES'
}

function addImageAction(arg, edit) {
    return {
        type: actions.addImage,
        image: arg,
        edit: edit
    }
}

function deleteImageAction(arg) {
    return {
        type: actions.deleteImage,
        image: arg
    }
}

function editImageAction(arg) {
    return {
        type: actions.changeImage,
        data: arg
    }
}

function saveAction() {
    return {
        type: actions.save
    }
}

function cancelSaveAction() {
    return {
        type: actions.cancelSave
    }
}




export function cancelSave(dispatch) {
    dispatch(cancelSaveAction())
}


export function save(dispatch) {
    dispatch(saveAction())
}


export function editImage(dispatch, arg) {
    dispatch(editImageAction(arg))
}


export function addImage(dispatch, arg, edit) {
    dispatch(addImageAction(arg, edit))
}

export function deleteImage(dispatch, arg) {
    dispatch(deleteImageAction(arg));
}