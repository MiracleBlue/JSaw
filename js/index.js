require.config({

  deps: ['app'],

  paths: {
    jquery: 'lib/jquery-1.7.2',
    lodash: 'lib/lodash-0.4.2',
    backbone: 'lib/backbone-0.9.2',
    handlebars: 'lib/handlebars-1.0.0.beta.6',
    layout: 'lib/backbone.layout-0.1.0',
    text: 'lib/require-text-2.0.1'
  },

  shim: {

    jquery: {
      exports: 'jQuery'
    },

    lodash: {
      exports: '_'
    },

    backbone: {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },

    handlebars: {
      exports: 'Handlebars'
    },

    layout: {
      deps: ['backbone'],
      exports: 'Backbone.Layout'
    }
  }

});