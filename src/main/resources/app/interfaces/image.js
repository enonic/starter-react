/**
 * Interface for an image 
 * @param {name : string, source : string} data 
 * @throws If name is not defined 
 */
export default class Image {
    constructor(data) {
        if(!data.source) throw "Image must have a source. Got undefined or null"
        this.name = data.name || "unnamed";
        this.source = data.source; 
        this.id = data.id || new Date().valueOf(); 
        this.type = "image";
        this.edited = data.edited == undefined ? true: data.edited;
        console.log(data.edited)
    }

    update(data){
        if(data.id){
            this.id = data.id
            this.edited = true
        }
        if(data.name){
            this.title = data.title
            this.edited = true
        }
        if(data.source){
            this.source = data.source
            this.edited = true
        }
    }
} 