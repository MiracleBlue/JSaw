require.config({

  // main app file to load
  deps: ['app'],

  paths: {
    jquery: 'lib/jquery-1.7.2',
    lodash: 'lib/lodash-0.4.2',
    backbone: 'lib/backbone-0.9.2',
    handlebars: 'lib/handlebars-1.0.0.beta.6',
    text: 'lib/require-text-2.0.1',
    less: 'lib/require-less-0.0.1'
  },

  shim: {

    backbone: {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },

    handlebars: {
      exports: 'Handlebars'
    },

    lodash: {
      exports: '_'
    }
  }

});