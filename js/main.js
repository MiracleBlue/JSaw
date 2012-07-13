require.config({
	paths: {
		// libs
		jquery: 'libs/jquery-1.7.1.min',
		drag_resize: 'libs/jquery-ui-1.8.16.custom.min',
		underscore: 'libs/underscore-min',
		backbone: 'libs/backbone-min'
	}
});

require(['app'], function(App) {
	App.initialize();
}); 