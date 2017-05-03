describe('ViewBindings', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  describe('bind called with array:', function() {
    it('get should return array', function () {
      window.angular.mock.module(function (ViewBindingsProvider) {
        ViewBindingsProvider.bind('name1', [1, 2, 3]);
      });

      inject(function(ViewBindings) {
        const expectedState = [1, 2, 3];
        expect(ViewBindings.getView('name1').getBindings()).toEqual(expectedState);
      });
    });
  });

  describe('bind called with object:', function() {
    it('get should return one element array containing object', function () {
      window.angular.mock.module(function (ViewBindingsProvider) {
        ViewBindingsProvider.bind('name1', {'x': 'y'});
      });

      inject(function(ViewBindings) {
        const expectedState = [{'x': 'y'}];
        expect(ViewBindings.getView('name1').getBindings()).toEqual(expectedState);
      });
    });
  });

  describe('bind called with object containing bindings array:', function() {
    it('get should return bindings array', function () {
      window.angular.mock.module(function (ViewBindingsProvider) {
        ViewBindingsProvider.bind('name1', {'bindings': [1, 2]});
      });

      inject(function(ViewBindings) {
        const expectedState = [1, 2];
        expect(ViewBindings.getView('name1').getBindings()).toEqual(expectedState);
      });
    });
  });

  describe('bind adds commonRequiredState:', function() {
    it('when commonRequiredState is a string and existing requiredState is an array', function() {
      window.angular.mock.module(function(ViewBindingsProvider) {
        ViewBindingsProvider.bind('name1', {
          'bindings': [{requiredState: ['a']}, {requiredState: ['b']}],
          'commonRequiredState': 'c'
        });
      });

      inject(function(ViewBindings) {
        const expectedState = [{ requiredState: ['a', 'c']}, { requiredState: ['b', 'c']}];
        expect(ViewBindings.getView('name1').getBindings()).toEqual(expectedState);
      });
    });

    it('when commonRequiredState is a string and existing requiredState is a string', function() {
      window.angular.mock.module(function(ViewBindingsProvider) {
        ViewBindingsProvider.bind('name1', {
          'bindings' : [{ requiredState: 'a'}, { requiredState: 'b'}],
          'commonRequiredState': 'c'
        });
      });

      inject(function(ViewBindings) {
        const expectedState = [{ requiredState: ['a', 'c']}, { requiredState: ['b', 'c']}];
        expect(ViewBindings.getView('name1').getBindings()).toEqual(expectedState);
      });
    });

    it('when commonRequiredState is an array and existing requiredState is an array', function() {
      window.angular.mock.module(function(ViewBindingsProvider) {
        ViewBindingsProvider.bind('name1', {
          'bindings' : [{ requiredState: ['a']}, { requiredState: ['b']}],
          'commonRequiredState': ['c', 'd']
        });
      });

      inject(function(ViewBindings) {
        const expectedState = [{ requiredState: ['a', 'c', 'd']}, { requiredState: ['b', 'c', 'd']}];
        expect(ViewBindings.getView('name1').getBindings()).toEqual(expectedState);
      });
    });
  });

  describe('commonResolve:', function() {
    it('merges with existing resolve section', function() {
      window.angular.mock.module(function(ViewBindingsProvider) {
        ViewBindingsProvider.bind('name1', {
          'bindings' : [ { resolve: { 'a' : 'a', 'b': 'b' } } ],
          'commonResolve': { 'b' : 'override', 'c': 'c' }
        });
      });

      inject(function(ViewBindings) {
        const expectedState = [{ resolve: { 'a': 'a', 'b': 'b', 'c': 'c' } }];
        expect(ViewBindings.getView('name1').getBindings()).toEqual(expectedState);
      });
    });

    it('creates resolve section if missing', function() {
      window.angular.mock.module(function(ViewBindingsProvider) {
        ViewBindingsProvider.bind('name1', {
          'bindings' : [ {} ],
          'commonResolve': { 'a' : 'a' }
        });
      });

      inject(function(ViewBindings) {
        const expectedState = [{ resolve: { 'a': 'a' } }];
        expect(ViewBindings.getView('name1').getBindings()).toEqual(expectedState);
      });
    });
  });

  describe('Application of basic common fields', function() {
    let basicCommonFields = [
      { name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl' },
      { name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent' },
      { name: 'commonErrorComponent', overrideField: 'errorComponent' },
      { name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl' }
    ];

    return basicCommonFields.map((commonField) => {
      describe(`${commonField.name}:`, function () {
        it(`adds ${commonField.overrideField} to each binding that does not specify one already`, function () {
          window.angular.mock.module(function (ViewBindingsProvider) {
            let viewBinding =
              {bindings: [{}]};

            viewBinding[commonField.name] = 'commonValue';
            ViewBindingsProvider.bind('name1', viewBinding);
          });

          inject(function (ViewBindings) {
            let expectedBinding = {};
            expectedBinding[commonField.overrideField] = 'commonValue';
            expect(ViewBindings.getView('name1').getBindings()).toEqual([expectedBinding]);
          });
        });

        it(`does not override ${commonField.overrideField} if already specified`, function () {
          window.angular.mock.module(function (ViewBindingsProvider) {
            let bindingWithExistingValue = {};
            bindingWithExistingValue[commonField.overrideField] = 'specificValue';

            let viewBinding = {bindings: [bindingWithExistingValue]};
            viewBinding[commonField.name] = 'someValue';
            ViewBindingsProvider.bind('name1', viewBinding);
          });

          inject(function (ViewBindings) {
            let expectedBinding = {};
            expectedBinding[commonField.overrideField] = 'specificValue';

            expect(ViewBindings.getView('name1').getBindings()).toEqual([expectedBinding]);
          });
        });
      });
    })
  });

  describe('when bind called with empty array:', function() {
    it('throws an error', function () {
      let throwsError = function () {
        window.angular.mock.module(ViewBindingsProvider => ViewBindingsProvider.bind('name1', []));

        inject(function (ViewBindings) {
          return ViewBindings.getView('name1');
        });
      };

      expect(throwsError).toThrow();
    });
  });
});

//XXX TODO test for commonResolve
