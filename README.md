optread
=======
The `optread` function parses GNU/POSIX style options from the beginning of
an array of command-line arguments.

Example
-------
The following example shows idiomatic use of the `optread` function.

```js
const options = {};
const optread = require("optread");
const argv = process.argv.slice();

// first two args are node and script name
argv.shift();
argv.shift();

for (const [opt, readval] of optread(argv)) {
    switch (opt) {
        case "-v":
        case "--verbose":
            options.verbose = true;
            break;
        case "-W":
        case "--working-dir":
            options.workingDir = readval();
            break;
        case "--":
            break;
        default:
            throw new Error(`invalid option: ${opt}`);
    }

    if (opt === "--") break;
}

// argv contains remaining arguments, if any
```
