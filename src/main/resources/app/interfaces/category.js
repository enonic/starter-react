export default class Item {
    constructor(data){
        this.title = data.title; 
        this.id = data.id || new Date().valueOf(); 
        this.visible = data.visible || true; 
        this.filter = data.filter; 
    }
}