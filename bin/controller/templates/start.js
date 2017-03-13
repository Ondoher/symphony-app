var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var services = new Feature(app, '/{name}/features/services/');

	services.addJS(['assets/js/Services/Bootstrap.js']);

	return Q(app);
}
