var libIo = require('/lib/xp/io');


var test = libIo.getResource(resolve('./index.html'))
var stream = test.getStream()
var text = libIo.readText(stream);

exports.get = function (req) {
    return {
        body: text
    }
};