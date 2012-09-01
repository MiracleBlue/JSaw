# jsaw

a browser based daw inspired by fruity loops. synthesized entirely in javascript using the web audio api.

in time, `core/`, `dsp/`, and `views/` directories could be split out for general purpose use.

## building documentation

[formatted documentation](http://catshirt.github.com/JSaw) is available and can be built using groc:

```
np install -g groc
roc js/core**/*.js js/dsp/**/*.js js/views/**/*.js js/index.js readme.md
```
