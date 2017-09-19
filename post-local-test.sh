#!/bin/sh
#
# posttest script for docs and demo update
cp src/bootstrap.data-driven-components.js docs/bootstrap.data-driven-components.js
./node_modules/.bin/jsdox --output docs src
cat docs/introduction.md docs/bootstrap.data-driven-components.md > README.md
# build readthedocs.io documentation
pandoc -s -r markdown -w rst  README.md -o docs/index.rst
