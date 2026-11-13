#!/bin/sh
cd "$(dirname "$0")" && printf 'const TL = ' > tl.js && cat timeline.json >> tl.js && printf ';\n' >> tl.js
