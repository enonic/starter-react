
var io = require('/lib/xp/io'); 

var res1 = io.getResource("./index.html");
var size = res1.getSize();
var stream = res1.getStream(); 

var text = io.readText(stream); 

exports.get = function(){
    return {
        body : text
    }
}


/**
 * Notes: 
 * 
 * - get IO to work 
 * Then, return the text from a HTML-file. 
 * The HTML-file contains a reference to webpack bundle 
 */