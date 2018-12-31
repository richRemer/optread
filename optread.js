/**
 * Parse GNU/POSIX-style command-line arguments.  Generates 2-tuples, each
 * tuple holding the option and a function which can be used to grab the option
 * value.
 * @param {string[]} argv
 * @returns {Generator}
 */
function* optread(argv) {
    while (argv.length && /^-./.test(argv[0])) {
        let curr = argv[0];

        if (curr === "--") {
            argv.shift();
            return;
        } else if (/^--.+=/.test(curr)) {
            let opt = curr.replace(/=.*/, ""),
                val = curr.replace(/^.+?=/, ""),
                needval = false;

            yield [opt, () => {
                needval = true;
                return val;
            }];

            if (!needval) throw new Error(`unexpected value for ${opt}`);
            argv.shift();
        } else if (/^--/.test(curr)) {
            let needval = false;

            yield [curr, () => {
                if (argv.length < 2) {
                    throw new Error(`missing value for ${curr}`);
                }

                needval = true;
                return argv[1];
            }];

            argv.shift();
            if (needval) argv.shift();
        } else if (curr.length > 2) {
            let needval = false;

            yield [curr.slice(0,2), () => {
                needval = true;
                return curr.slice(2);
            }];

            if (needval) argv.shift();
            else argv[0] = "-" + argv[0].slice(2);
        } else {
            let needval = false;

            yield [curr, () => {
                if (argv.length < 2) {
                    throw new Error(`missing value for ${curr}`);
                }

                needval = true;
                return argv[1];
            }];

            argv.shift();
            if (needval) argv.shift();
        }
    }
}

module.exports = optread;
