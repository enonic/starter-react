export default class Item {
        constructor(data){
                this.name = data.name, 
                this.info = data.info, 
                this.image = data.id || new Date().valueOf(); 
                this.id = Math.random()
                this.visible = false
                this.categoryName = data.category || "others"
        }
}