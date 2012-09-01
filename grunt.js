module.exports = function(grunt) {

  grunt.initConfig({

    // `grunt watch` will recompile less on save
    watch: {
      files: ['less/**/*.less'],
      tasks: 'less'
    },

    // cleanup previous releases
    clean: ['dist/'],

    // use r.js to compile require
    requirejs: {
      mainConfigFile: 'js/index.js',
      out: 'dist/staging/require.js',
      name: 'index',
      wrap: false,
      insertRequire: ['app']
    },

    concat: {
      dist: {
        dest: 'dist/staging/require.js',
        separator: ';',
        src: [
          'js/lib/require.js',
          'dist/staging/require.js'
        ]
      }
    },

    // minify the release file
    min: {
      'dist/release/require.js': ['dist/staging/require.js']
    },

    // compile less
    less: {
      compile: {
        options: {
          paths: ['less']
        },
        files: {
          'css/index.css': 'less/index.less',
          'dist/staging/index.css': 'less/index.less'
        }
      }
    },

    // minify compiled less file
    mincss: {
      'dist/release/index.css': ['dist/staging/index.css']
    },

    // static server
    server: {

      // bbb server:debug
      debug: {
        folders: {
          'js': './js',
          'css': './css',
          'img': './img',
          'handlebars': './handlebars'
        }
      },

      // bbb server:release
      release: {
        host: '0.0.0.0',
        folders: {
          'js': './dist/release',
          'js/lib': './dist/release',
          'css': './dist/release',
          'img': './img'
        }
      }
    }

  });

  grunt.registerTask('release', [
    'clean',
    'requirejs',
    'concat',
    'min',
    'less',
    'mincss',
    'server:release'
  ].join(' '));

};