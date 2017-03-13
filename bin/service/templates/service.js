Package('{App}.Services', {
	{Name} : new Class({
		initialize : function()
		{
			this.serviceName = '{name}';
			this.importServices = '{list}'.split(',');

			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
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
	})
});

new {App}.Services.{Name}();
