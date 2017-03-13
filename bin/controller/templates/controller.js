Package('{Name}.Controllers', {
	{Name} : new  Class({
		Extends: Sapphire.Controller,

		initialize : function()
		{
			this.parent();
			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onStart : function(callback)
		{
			callback();
		},

		onReady : function()
		{
			this.view = new {Name}.Views.{Name}();
		}
	})
});

SAPPHIRE.application.registerController('{name}', new {Name}.Controllers.{Name}());
