var libIo = require('/lib/xp/io');
var portal = require("/lib/xp/portal");


var html = getFileContents('./index.html') + "<script> " + getFileContents("./bundle.js") + "</script>"; 

exports.get = function(){
    return {
        headers : {
            "Content-Type" : "text/html"
        }, 
        body: html
    }
}


/**
 * NOTES: 
 * - importing the HTML file works
 * - Problem
    * - The imported script (supposed to be a js-bundle) contains a copy of the HTML.. 
    * - The bundle looks okay locally 
 */

function getFileContents(path) {
    var result = libIo.getResource(resolve(path))
    var stream = result.getStream()
    return libIo.readText(stream);
}