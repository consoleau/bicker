beforeEach(function () {

  jasmine.addMatchers({
    toBeInstanceOf() {
      return {
        compare(actual, expected) {
          return {pass: actual instanceof expected};
        }
      };
    }
  });
});
