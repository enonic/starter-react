var libIo = require('/lib/xp/io');
var portalLib = require('/lib/xp/portal');
var router = require('/lib/router')();
var mustache = require('/lib/xp/mustache');

function getAppUrl() {
    return portalLib.url({path:'/app/' + app.name}) + '/';
}

function getPage() {
    var test = libIo.getResource(resolve('./index.html'))
    var stream = test.getStream()
    var page = libIo.readText(stream);
    return page
}

function getBundle(){
    var appUrl = getAppUrl();
    return {
        contentType: 'application/javascript',
        body: mustache.render(resolve('/assets/bundle.js'), {
            appUrl: appUrl,
        })
    };

}

router.get('/', getPage);
router.get('/bundle.js', getBundle);

exports.get = function (req) {

    return {
        body: router.dispatch(req)
    }
};