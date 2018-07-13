// fetch api
export const actions = {
    addImage: 'ADD_IMAGE',
    deleteImage: 'DELETE_CATEGORY'
}

function createCategoryAction(arg) {
    return {
        type: actions.addimage,
        category: arg
    }
}

function deleteCategoryAction(arg) {
    return {
        type: actions.deleteImage,
        category: arg
    }
}




export function deleteCategory(dispatch, arg) {
    dispatch(deleteCategoryAction(arg))
}

export function createCategory(dispatch, arg) {
    dispatch(createCategoryAction(arg))
}
