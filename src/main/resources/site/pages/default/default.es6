var libs = {
	portal: require('/lib/xp/portal'), // Import the portal functions
	thymeleaf: require('/lib/xp/thymeleaf'), // Import the Thymeleaf rendering function
    util: require('/lib/enonic/util')
};

// Specify the view file to use
var view = resolve('default.html');
var exemel = resolve('default.xml');


// Handle the GET request
exports.get = function(req) {

    // Get the content that is using the page
    var content = libs.portal.getContent();    

    //var site = libs.portal.getSite();
    //var config = libs.portal.getSiteConfig();

	var mainRegion = content.page.regions.main;

    //log.info(JSON.stringify({site:site}, null, 2));

    // Prepare the model that will be passed to the view
    var model = { content,  mainRegion };

    // Render the dynamic HTML with values from the model
    var body = libs.thymeleaf.render(view, model);

    // Return the response object
    return { body }
};

