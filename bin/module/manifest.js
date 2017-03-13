module.exports = {
	files: [
        {path: 'apps/{path}/sapphire-config/config.js', template: 'config.js'},
        {path: 'apps/{path}/sapphire-config/config.dev.js', template: 'config.dev.js'},
        {path: 'apps/{path}/sapphire-config/config.prod.js', template: 'config.prod.js'},
        {path: 'apps/{path}/sapphire-config/config.js'},
		{path: 'apps/{path}/{name}.js', template: 'app.js'},
		{path: 'apps/{path}/templates/body.html', template: 'body.html'},
		{path: 'apps/{path}/templates/master.html', template: 'master.html'},
		{path: 'apps/{path}/assets/css/{name}.css', template: 'app.css'},
		{path: 'apps/{path}/assets/js/Views/{App}.js', template: 'view.js'},
		{path: 'apps/{path}/assets/js/Controllers/{App}.js', template: 'controller.js'},
		{path: 'apps/{path}/assets/js/Models/Service.js', template: 'service.js'},
		{path: 'apps/{path}/features/services/assets/js/Services/Bootstrap.js', template: 'start-service.js'},
		{path: 'apps/{path}/features/services/services.js', template: 'start.js'},
	],
}

