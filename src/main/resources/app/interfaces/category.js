export default class Category {
    constructor(data){
        this.title = data.title; 
        this.id = data.id || new Date().valueOf(); 
        this.visible = data.visible == undefined ? true: data.visible;
        this.filter = data.filter;
        this.edited = data.edited == undefined ? true: data.edited;
        this.type = "category"
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