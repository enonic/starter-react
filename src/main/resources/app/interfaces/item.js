export default class Item {
        constructor(data){
                this.name = data.name, 
                this.info = data.info, 
                this.image = data.image,
                this.id = Math.random()
                this.visible = false
        }
}