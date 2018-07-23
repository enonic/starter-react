export default class Category {
    constructor(data){
        this.title = data.title; 
        this.id = data.id || new Date().valueOf(); 
        this.visible = data.visible || true; 
        this.filter = data.filter; 
        this.edited = false
    }

    update(data){
        if(data.id){
            this.id = data.id
            this.edited = true
        }
        if(data.title){
            this.title = data.title
            this.edited = true
        }
        if(data.visible){
            this.visible = data.visible
            this.edited = true
        }
        if(data.filter){
            this.filter = data.filter
            this.edited = true
        }
    }
}