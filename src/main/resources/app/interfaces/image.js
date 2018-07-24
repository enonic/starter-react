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
        this.type = "image";
    }
} 