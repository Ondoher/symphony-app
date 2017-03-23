Package('{App}.Services', {
	{Name} : new Class({
		implements : [],
		initialize : function()
		{
			this.serviceName = '{app}:{name}';
			this.importServices = '{list}'.split(',');

			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			{APP}.events.listen('start', this.onReady.bind(this));
		},

		onStart : function(done)
		{
			var bootstrap = SYMPHONY.services.subscribe('bootstrap');

			this.importServices.each(function(service)
			{
				bootstrap.importService(service);
			}, this);

			bootstrap.exportService(this.serviceName);
			done();
		},

		onReady : function()
		{
		}
	})
});

new {App}.Services.{Name}();
