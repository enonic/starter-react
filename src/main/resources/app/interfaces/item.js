export default class Item {
        constructor(data){
                this.name = data.name; 
                this.info = data.info;  
                this.image = data.image; 
                this.id = data.id || new Date().valueOf();
                this.visible = true; 
                this.categoryName = data.category || "others"; 
        }
}