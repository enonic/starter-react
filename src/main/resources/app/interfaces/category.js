export default class Item {
    constructor(data){
        this.title = data.title; 
        this.id = new Date().valueOf(); 
        this.visible = false; 
        this.filter = data.filter; 
    }
}