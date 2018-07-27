/**
 * Interface for an image 
 * @param {name : string, source : string} data 
 * @throws If name is not defined 
 */
export default class Image {
    constructor(data) {
        console.log(data)
        this.name = data.name || "unnamed";
        this.id = data.id || new Date().valueOf(); 
        this.type = "image";
        this.edited = data.edited == undefined ? true: data.edited;
        this.file = data.file || null
        if(this.file){
            console.log(this.file)
            
        }
        this.source = this.file ? URL.createObjectURL(this.file) : data.source;
    }

    update(data){
        if(data.name){
            this.name = data.name
            this.edited = true
        }
        if(data.source){
            this.source = data.source
            this.file = null
            this.edited = true
        }
        if(data.file){
            this.file = data.file
            this.edited = true
        }
    }
} 