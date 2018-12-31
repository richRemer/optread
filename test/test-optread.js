const optread = require("..");
const expect = require("expect.js");

describe("iterating over options", () => {
    let argv, iterable;

    beforeEach(() => {
        argv = ["--foo", "--bar", "42", "apple", "banana"];
        iterable = optread(argv);
    });

    it("should iterate over option tuples", () => {
        const result = iterable.next();

        expect(result.value).to.be.an("array");
        expect(result.value[0]).to.be("--foo");
        expect(result.done).to.be(false);
    });

    it("should not change argv during current iteration", () => {
        expect(argv.length).to.be(5);
        iterable.next();
        expect(argv.length).to.be(5);
    });

    it("should shift options from argv after current iteration", () => {
        expect(argv.length).to.be(5);
        const foo = iterable.next();
        const bar = iterable.next();
        expect(argv.length).to.be(4);
    });

    it("should provide function to read value", () => {
        const foo = iterable.next();
        const bar = iterable.next();

        expect(bar.value[0]).to.be("--bar");
        expect(bar.value[1]).to.be.a("function");
        expect(bar.value[1]()).to.be("42");

        const done = iterable.next();

        expect(done.done).to.be(true);
        expect(argv.length).to.be(2);
    });
});

describe("errors", () => {
    let argv, iterable;

    beforeEach(() => {
        argv = [];
        iterable = optread(argv);
    });

    it("should throw on missing value", () => {
        argv.splice(0, 0, "--foo");
        const [opt, readval] = iterable.next().value;
        expect(readval).to.throwError();
    });

    it("should throw on unexpected value", () => {
        argv.splice(0, 0, "--foo=bar");
        const [opt, readval] = iterable.next().value;
        expect(() => iterable.next()).to.throwError();
    });
});
