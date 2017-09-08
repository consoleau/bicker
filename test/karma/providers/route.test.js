describe('Route', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  describe('provider', function() {

    describe('types', function () {

      describe('numeric', function () {

        let urlDefinition = '/{tokenA}';

        beforeEach(function () {
          window.angular.mock.module(function (RouteProvider) {
            RouteProvider.registerUrlToken('tokenA', {type: 'numeric'});
            RouteProvider.registerUrl(urlDefinition);
          });
        });

        it('should match against a single digit', function () {
          inject(function (Route) {
            let result = Route.match('/1');
            expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
            expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
            expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
          });
        });

        it('should match against a sequence of digits', function () {
          inject(function (Route) {
            let result = Route.match('/234');
            expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
            expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
            expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
          });
        });

        it('should not match if there are non-digit characters', function () {
          inject(Route => expect(Route.match('/2a')).toBe(null));
        });

        it('should not match if there are symbols', function () {
          inject(Route => expect(Route.match('/a$#')).toBe(null));
        });
      });

      describe('alpha', function () {

        let urlDefinition = '/{tokenA}';

        beforeEach(function () {
          window.angular.mock.module(function (RouteProvider) {
            RouteProvider.registerUrlToken('tokenA', {type: 'alpha'});
            RouteProvider.registerUrl(urlDefinition);
          });
        });

        it('should match against a letter', function () {
          inject(function (Route) {
            let result = Route.match('/a');
            expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
            expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
            expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
          });
        });

        it('should match against a sequence of letters', function () {
          inject(function (Route) {
            let result = Route.match('/abCDefg');
            expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
            expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
            expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
          });
        });

        it('should not match if there are numbers', function () {
          inject(Route => expect(Route.match('/a2')).toBe(null));
        });

        it('should not match if there are symbols', function () {
          inject(Route => expect(Route.match('/a$#')).toBe(null));
        });
      });

      describe('custom types', function () {
        let urlDefinition = '/{tokenA}';

        beforeEach(function () {
          window.angular.mock.module(function (RouteProvider) {
            RouteProvider.registerType('cars', {regex: /volkswagen|bmw|mercedes/});
            RouteProvider.registerUrlToken('tokenA', {type: 'cars'});
            RouteProvider.registerUrl(urlDefinition);
          });
        });

        it('should match against provided regex', function () {
          inject(function (Route) {
            let result = Route.match('/volkswagen');
            expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
            expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
            expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
            expect(Route.match('/ford'), 'Route.match("/ford")').toBe(null);
          });
        });
      });

      describe('any', function () {
        let urlDefinition = '/something/{tokenA}/something';

        beforeEach(function () {
          window.angular.mock.module(function (RouteProvider) {
            RouteProvider.registerUrlToken('tokenA', {type: 'any'});
            RouteProvider.registerUrl(urlDefinition);
          });
        });

        it('should not match against an empty value', function () {
          inject(Route => expect(Route.match('/something//something')).toBe(null));
        });

        it('should match against a non-empty value', function () {
          inject(function (Route) {
            let result = Route.match('/something/abc/something');
            expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
            expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
            expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
          });
        });
      });

      describe('lists', function () {
        let urlDefinition = '/something/{someList}/something';

        beforeEach(function () {
          window.angular.mock.module(function (RouteProvider) {
            RouteProvider.registerUrlToken('someList', {type: 'list'});
            RouteProvider.registerUrl(urlDefinition);
          });
        });

        describe('with a single value', function () {
          it('should match against a URL with a single value in the specified location', function () {
            inject(function (Route) {
              let result = Route.match('/something/abc/something');
              expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
              expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
              expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
            });
          });

          it('returns an array with the value from the specified location in the URL', function () {
            inject(function (Route) {
              let result = Route.match('/something/abc/something');
              expect(Route.extractData(result)).toEqual({someList: ['abc']});
            });
          });
        });

        describe('with multiple values separated by a comma', function () {
          it('should match against a URL with multiple values separated by a comma in the specified location', function () {
            inject(function (Route) {
              let result = Route.match('/something/a,b,c/something');
              expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
              expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
              expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
            });
          });

          it('returns the array of values ', function () {
            inject(function (Route) {
              let result = Route.match('/something/a,b,c/something');
              expect(Route.extractData(result)).toEqual({someList: ['a', 'b', 'c']});
            });
          });
        });
      });
    });
  });

  describe('match', function() {
    it('should match the first matching URL', function() {
      let urlA = '/{tokenA}';
      let urlB = '/A';

      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('tokenA', {type: 'alpha'})
          .registerUrl(urlA)
          .registerUrl(urlB);
      });

      inject(function(Route) {
        let result = Route.match('/A');
        expect(result.url.pattern).toEqual('/{tokenA}');
      });
    });

    it('should return an object with a compiled URL and a regex match', function() {
      let urlDefinition = '/{tokenA}/{tokenB}/c';

      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('tokenB', {type: 'alpha'})
          .and('tokenA', {type: 'numeric'})
          .registerUrl(urlDefinition);
      });

      inject(function(Route) {
        let result = Route.match('/1/b/c');
        expect(result.url.pattern, 'url.pattern').toEqual(urlDefinition);
        expect(result.url.compiledUrl.tokens, 'compiledUrl.tokens').toBeInstanceOf(Object);
        expect(result.regexMatch, 'regexMatch').toBeInstanceOf(Object);
      });
    });

    it('should return null if there are no matching URL patterns registered', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrl('/a/b/c');
      });

      inject(Route => expect(Route.match('/c/b/a')).toBeNull());
    });

    it('should match a URL pattern if a trailing slash is present in the URL pattern but not in the URL', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrl('/a/b/c/');
      });

      inject(Route => expect(Route.match('/a/b/c/')).not.toBeNull());
    });

    it('should match a URL pattern if a trailing slash is not present in the URL pattern but exists in the URL', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrl('/a/b/c');
      });

      inject(Route => expect(Route.match('/a/b/c/')).not.toBeNull());
    });

    it('should use exact matching by default', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrl('/a/b/c');
      });

      inject(function(Route) {
        let result = Route.match('/x/a/b/c/');
        expect(result).toBeNull();
      });
    });

    it('can use partial matching if specified', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrl('/a/b/c', {partialMatch: true});
      });
      inject(function(Route) {
        expect(Route.match('/x/a/b/c/'), 'Route.match("/x/a/b/c/")').not.toBeNull();
        expect(Route.match('/a/b/c/x'), 'Route.match("/a/b/c/x")').not.toBeNull();
      });
    });
  });

  describe('extractData', function() {
    it('should override default data with data from the path', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('a.b.c', {type: 'alpha'})
        .registerUrl('/a/b/{a.b.c}', {state: {a: {b: {c: 'expected to be overriden'}}}});
      });

      inject(function(Route) {
        let match = Route.match('/a/b/hello');
        let result = Route.extractData(match);
        expect(result).toEqual({ a : {b: {c: 'hello'}} });});
  });

    it('should override path data with search data', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('c', {type: 'alpha'})
        .registerUrl('/a/b/{c}');
      });

      inject(function(Route) {
        let match = Route.match('/a/b/pathValue');
        let result = Route.extractData(match, { c: 'searchValue' });
        expect(result).toEqual({ c : 'searchValue' });});
  });
});

  describe('extractPathData', function() {
    it('should extract data from the path component of the match', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('tokenB', {type: 'alpha'})
        .and('tokenA', {type: 'numeric'})
        .registerUrl('/{tokenA}/{tokenB}/c');
      });

      inject(function(Route) {
        let match = Route.match('/1/b/c');
        let data = Route.extractData(match);
        expect(data.tokenA, 'tokenA').toBe(1);
        expect(data.tokenB, 'tokenB').toBe('b');
      });
    });

    it("should replace each type's data with the parsed form, if a parser is specified for that type", function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerType('customType', { regex: /[a-z]/, parser(token) { return `${token}!!!`; } });
        RouteProvider.registerUrlToken('tokenB', {type: 'customType'})
        .and('tokenA', {type: 'numeric'})
        .registerUrl('/{tokenA}/{tokenB}/c');
      });

      inject(function(Route) {
        let match = Route.match('/1/b/c');
        let data = Route.extractData(match);
        expect(data.tokenA, 'tokenA').toBe(1);
        expect(data.tokenB, 'tokenB').toBe('b!!!');
      });
    });

    it('should use the statePath as the key for the data, if it is supplied', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('tokenB', {type: 'alpha', statePath: 'somewhere.else'})
        .and('tokenA', {type: 'numeric'})
        .registerUrl('/{tokenA}/{tokenB}/c');
      });

      inject(function(Route) {
        let match = Route.match('/1/b/c');
        let data = Route.extractData(match);
        expect(data.tokenA, 'tokenA').toBe(1);
        expect(data.somewhere.else, 'somewhere.else').toBe('b');
      });
    });
  });

  describe('extractDefaultData', function() {
    it('should automatically inject default data', function () {
      window.angular.mock.module(function (RouteProvider) {
        RouteProvider.registerUrl('/a/b/c', {state: {'a.b.c': true}});
      });

      inject(function (Route) {
        let match = Route.match('/a/b/c');
        let result = Route.extractDefaultData(match);
        expect(result).toEqual(jasmine.objectContaining({a: {b: {c: true}}}));
      });
    });
  });

  describe('extractSearchData', function() {
    it('should return fields whose value match the regex registered for that token', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('tokenA', {type: 'alpha'});
      });

      inject(function(Route) {
        let result = Route.extractSearchData({ tokenA: 'hello' });
        expect(result).toEqual(jasmine.objectContaining({ tokenA: 'hello' }));});
  });

    it("should replace each token's data with the parsed form, if a parser is specified for that token", function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerType('customType', { regex: /[a-z]/, parser(token) { return `${token}!!!`; } });
        RouteProvider.registerUrlToken('tokenA', {type: 'customType'});
      });

      inject(function(Route) {
        let result = Route.extractSearchData({ tokenA: 'hello' });
        expect(result).toEqual(jasmine.objectContaining({ tokenA: 'hello!!!' }));});
  });

    it("should inject dependencies into the parser", function() {
      let parser = jasmine.createSpy();

      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerType('customType', { regex: /[a-z]/, parser: ['Route', 'token', parser] });
        RouteProvider.registerUrlToken('tokenA', {type: 'customType'});
      });

      inject(function(Route) {
        let tokenValue = 'token value';
        Route.extractSearchData({ tokenA: tokenValue });

        expect(parser).toHaveBeenCalledWith(Route, tokenValue);
      });
    });

    it('should default to using the data from $location.search()', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('tokenA', {type: 'alpha'});
      });

      inject(function(Route, $location) {
        spyOn($location, 'search').and.returnValue({ tokenA: 'hello' });
        let result = Route.extractSearchData();
        expect(result).toEqual(jasmine.objectContaining({ tokenA: 'hello' }));});
  });

    it('should rename fields that have a searchAlias defined', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('a.b.c', {type: 'alpha', searchAlias: 'hello'});
      });

      inject(function(Route) {
        let result = Route.extractSearchData({ hello: 'world' });
        expect(result).toEqual(jasmine.objectContaining({ a : {b: {c: 'world'}} }));});
  });

    it('should not return data that has a regex defined when the regex does not match the value from the search', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlToken('a', {type: 'alpha', searchAlias: 'hello'});
      });

      inject(function(Route) {
        let result = Route.extractSearchData({ hello: '123', a: '123' });
        expect(Object.keys(result).length).toBe(0);
      });
    });

    it('should return data that does not have a token defined for it', function() {
      inject(function (Route) {
        let result = Route.extractSearchData({hello: '123'});
        expect(result).toEqual(jasmine.objectContaining({hello: '123'}));
      });
    });
});


  describe('getUrlWriters',  function() {
    it('should return all of the registered URL writers', function () {
      let writerA = jasmine.createSpy('writerA');
      let writerB = jasmine.createSpy('writerB');

      window.angular.mock.module(function (RouteProvider) {
        RouteProvider
          .registerUrlWriter('writerB', writerB)
          .registerUrlWriter('writerA', writerA);
      });

      inject(function (Route) {
        let writers = Route.getUrlWriters();

        expect(_.keys(writers).length, '_.keys(writers) count').toBe(2);

        writers.writerA();
        writers.writerB();

        expect(writerA, 'writerA toHaveBeenCalled').toHaveBeenCalled();
        expect(writerB, 'writerB toHaveBeenCalled').toHaveBeenCalled();
      });
    });
  });

  describe('urlWriters', function() {
    it('should inject an object called UrlData which is the data passed to the invoker', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlWriter('pagination', function(UrlData, State) {
          let page = UrlData.page || State.get('page');
          return `/page/${page}`;
        });
      });

      inject(function($compile, $rootScope, State, Route) {
        State.set('page', 2);
        expect(Route.invokeUrlWriter('pagination'), 'Route.invokeUrlWriter("pagination")').toBe('/page/2');
        expect(Route.invokeUrlWriter('pagination', {page: 5}), 'Route.invokeUrlWriter("pagination", {page: 5})').toBe('/page/5');
      });
    });

    it('should inject other services as normal', function() {
      let calledWithLocation = undefined;

      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.registerUrlWriter('pagination', (UrlData, $location) => calledWithLocation = $location);
      });

      inject(function($location, Route) {
        Route.invokeUrlWriter('pagination');
        expect(calledWithLocation).toBe($location);
      });
    });
  });

  describe('go', function() {
    describe('When the target URL is different to the current URL', function () {
      it("should call the specified url writer and update the browser's URL to the value returned", function () {
        window.angular.mock.module(function (RouteProvider) {
          RouteProvider.registerUrlWriter('pagination', UrlData => `/page/${UrlData.page}`);
        });

        inject(function (Route, $location) {
          spyOn($location, 'url').and.returnValue('/some/other/url')
          Route.go('pagination', {page: 3});
          expect($location.url).toHaveBeenCalledWith('/page/3');
        });
      });
    });

    describe('When the target URL is the same as the current URL and forceReload is set to true', function () {
      it("should force the view to re-render", function () {
        window.angular.mock.module(function (RouteProvider) {
          RouteProvider.registerUrlWriter('pagination', UrlData => '/some/url');
        });

        inject(function (Route, $location) {
          const forceReload = true
          spyOn($location, 'url').and.returnValue('/some/url')
          spyOn(Route, 'reload')
          Route.go('pagination', {}, forceReload);
          expect(Route.reload).toHaveBeenCalled();
          expect($location.url).not.toHaveBeenCalledWith('/some/url');
        });
      });
    });

    describe('When the target URL is the same as the current URL and forceReload is set to false', function () {
      it("should force the view to re-render", function () {
        window.angular.mock.module(function (RouteProvider) {
          RouteProvider.registerUrlWriter('pagination', UrlData => '/some/url');
        });

        inject(function (Route, $location) {
          const forceReload = false
          spyOn($location, 'url').and.returnValue('/some/url')
          spyOn(Route, 'reload')
          Route.go('pagination', {}, forceReload);
          expect(Route.reload).not.toHaveBeenCalled();
          expect($location.url).not.toHaveBeenCalledWith('/some/url');
        });
      });
    });
  });

  describe('Reload', function() {
    it('emits the event bicker_router.forcedReload', function () {
      inject(function (Route, $rootScope) {
        spyOn($rootScope, '$emit')
        Route.reload()
        expect($rootScope.$emit).toHaveBeenCalledWith('bicker_router.forcedReload')
      });
    })
  })

  describe('persistentStates',  function() {
    it('set/get should work as expected', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.setPersistentStates('a', 'b');
      });

      inject(Route => expect(Route.getPersistentStates()).toEqual(['a', 'b']));
    });

    it('should suppress duplicate entries', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.setPersistentStates('a');
        RouteProvider.setPersistentStates('a');
      });

      inject(Route => expect(Route.getPersistentStates()).toEqual(['a']));
    });
  });

  describe('Storing currently rendered bindings for views', function () {
    it('set/get should work as expected', function() {
      const binding = {};

      inject(Route => {
        Route.setCurrentBinding('viewName', binding);
        expect(Route.getCurrentBinding('viewName', binding)).toBe(binding);
      });
    });

    it('set/delete/get should work as expected', function() {
      const binding = {};

      inject(Route => {
        Route.setCurrentBinding('viewName', binding);
        Route.deleteCurrentBinding('viewName');
        expect(Route.getCurrentBinding('viewName', binding)).toBe(undefined);
      });
    });
  });

  describe('matchesCurrentBindingName', function () {
    it('should return false if there is no binding rendered in the nominated view', function () {
      inject(Route => {
        expect(Route.matchesCurrentBindingName('viewName', 'myBinding')).toBe(false);
      });
    }),

    it('should return true if the current binding name exactly matches the string provided', function () {
      const binding = { name: 'myBinding' };

      inject(Route => {
        Route.setCurrentBinding('viewName', binding);
        expect(Route.matchesCurrentBindingName('viewName', 'myBinding')).toBe(true);
      });
    });

    it('should return true if the current binding name matches the regexp provided', function () {
      const binding = { name: 'myBinding' };

      inject(Route => {
        Route.setCurrentBinding('viewName', binding);
        expect(Route.matchesCurrentBindingName('viewName', /^my/ )).toBe(true);
      });
    });

    it('should return false if the current binding name does not match the provided value', function () {
      const binding = { name: 'myBinding' };

      inject(Route => {
        Route.setCurrentBinding('viewName', binding);
        expect(Route.matchesCurrentBindingName('viewName', 'someOtherValue')).toBe(false);
      });
    });
  });
});
