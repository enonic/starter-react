export default class Item {
    constructor(data){
        this.name = data.name; 
        this.info = data.info;  
        this.image = data.image; 
        this.id = data.id || new Date().valueOf();
        this.visible = data.visible == undefined ? true: data.visible;
        this.category = data.category || "others"; 
        this.edited = data.edited == undefined ? true: data.edited;
        this.type = "item"
    }

    update(data){
        if(data.name){
            this.name = data.name
            this.edited = true
        }
        if(data.info){
            this.info = data.info
            this.edited = true
        }
        if(data.image){
            this.image = data.image
            this.edited = true
        }
        if(data.category){
            this.category = data.category
            this.edited = true
        }

    }
} 