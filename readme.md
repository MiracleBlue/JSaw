# jsaw

a browser based daw inspired by fruity loops. synthesized entirely in javascript using the web audio api.

in time, `core/`, `dsp/`, and `views/` directories could be split out for general purpose use.

## to run

    $ npm install bbb -g
    $ git clone git@github.com:MiracleBlue/JSaw.git
    $ cd JSaw
    $ bbb less && bbb server:debug

## to develop

    $ bbb watch & bbb server:debug

## to build

    $ bbb release

## documentation

[formatted documentation](http://catshirt.github.com/JSaw) is available and can be built using groc:

    $ npm install -g groc
    $ groc js/core**/*.js js/dsp/**/*.js js/views/**/*.js js/index.js readme.md