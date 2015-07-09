describe 'Route', ->
  beforeEach -> window.angular.mock.module 'bicker_router'

  describe 'provider', ->

    describe 'types', ->

      describe 'numeric', ->

        urlDefinition = '/{tokenA}'

        beforeEach ->
          window.angular.mock.module (RouteProvider) ->
            RouteProvider.registerUrlToken 'tokenA', type: 'numeric'
            RouteProvider.registerUrl urlDefinition
            return

        it 'should match against a single digit', ->

          inject (Route) ->
            result = Route.match '/1'
            expect(result.url.pattern).toEqual urlDefinition
            expect(result.url.compiledUrl.tokens).toBeInstanceOf Object
            expect(result.regexMatch).toBeInstanceOf Object

        it 'should match against a sequence of digits', ->
          inject (Route) ->
            result = Route.match '/234'
            expect(result.url.pattern).toEqual urlDefinition
            expect(result.url.compiledUrl.tokens).toBeInstanceOf Object
            expect(result.regexMatch).toBeInstanceOf Object

        it 'should not match if there are non-digit characters', ->
          inject (Route) ->
            expect(Route.match '/2a').toBe null

        it 'should not match if there are symbols', ->
          inject (Route) ->
            expect(Route.match '/a$#').toBe null

      describe 'alpha', ->

        urlDefinition = '/{tokenA}'

        beforeEach ->
          window.angular.mock.module (RouteProvider) ->
            RouteProvider.registerUrlToken 'tokenA', type: 'alpha'
            RouteProvider.registerUrl urlDefinition
            return

        it 'should match against a letter', ->
          inject (Route) ->
            result = Route.match '/a'
            expect(result.url.pattern).toEqual urlDefinition
            expect(result.url.compiledUrl.tokens).toBeInstanceOf Object
            expect(result.regexMatch).toBeInstanceOf Object

        it 'should match against a sequence of letters', ->
          inject (Route) ->
            result = Route.match '/abCDefg'
            expect(result.url.pattern).toEqual urlDefinition
            expect(result.url.compiledUrl.tokens).toBeInstanceOf Object
            expect(result.regexMatch).toBeInstanceOf Object

        it 'should not match if there are numbers', ->
          inject (Route) ->
            expect(Route.match '/a2').toBe null

        it 'should not match if there are symbols', ->
          inject (Route) ->
            expect(Route.match '/a$#').toBe null

      describe 'custom types', ->

        urlDefinition = '/{tokenA}'

        beforeEach ->
          window.angular.mock.module (RouteProvider) ->
            RouteProvider.registerType 'cars', regex: /volkswagen|bmw|mercedes/
            RouteProvider.registerUrlToken 'tokenA', type: 'cars'
            RouteProvider.registerUrl urlDefinition
            return

        it 'should match against provided regex', ->
          inject (Route) ->
            result = Route.match '/volkswagen'
            expect(result.url.pattern).toEqual urlDefinition
            expect(result.url.compiledUrl.tokens).toBeInstanceOf Object
            expect(result.regexMatch).toBeInstanceOf Object
            expect(Route.match '/ford').toBe null

      describe 'any', ->

        urlDefinition = '/something/{tokenA}/something'

        beforeEach ->
          window.angular.mock.module (RouteProvider) ->
            RouteProvider.registerUrlToken 'tokenA', type: 'any'
            RouteProvider.registerUrl urlDefinition
            return

        it 'should not match against an empty value', ->
          inject (Route) ->
            expect(Route.match '/something//something').toBe null

        it 'should match against a non-empty value', ->
          inject (Route) ->
            result = Route.match '/something/abc/something'
            expect(result.url.pattern).toEqual urlDefinition
            expect(result.url.compiledUrl.tokens).toBeInstanceOf Object
            expect(result.regexMatch).toBeInstanceOf Object


  describe 'match', ->
    it 'should return an object with a compiled URL and a regex match', ->
      urlDefinition = '/{tokenA}/{tokenB}/c'

      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'tokenB', type: 'alpha'
          .and 'tokenA', type: 'numeric'
          .registerUrl urlDefinition
        return

      inject (Route) ->
        result = Route.match '/1/b/c'
        expect(result.url.pattern).toEqual urlDefinition
        expect(result.url.compiledUrl.tokens).toBeInstanceOf Object
        expect(result.regexMatch).toBeInstanceOf Object

    it 'should return null if there are no matching URL patterns registered', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrl '/a/b/c'
        return

      inject (Route) ->
        expect(Route.match '/c/b/a').toBeNull()

    it 'should match a URL pattern if a trailing slash is present in the URL pattern but not in the URL', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrl '/a/b/c/'
        return

      inject (Route) ->
        expect(Route.match '/a/b/c/').not.toBeNull()

    it 'should match a URL pattern if a trailing slash is not present in the URL pattern but exists in the URL', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrl '/a/b/c'
        return

      inject (Route) ->
        expect(Route.match '/a/b/c/').not.toBeNull()

    it 'should use exact matching by default', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrl '/a/b/c'
        return

      inject (Route) ->
        result = Route.match '/x/a/b/c/'
        expect(result).toBeNull()

    it 'can use partial matching if specified', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrl '/a/b/c', partialMatch: true
        return
      inject (Route) ->
        expect(Route.match '/x/a/b/c/').not.toBeNull()
        expect(Route.match '/a/b/c/x').not.toBeNull()

  describe 'extractData', ->
    it 'should override default data with data from the path', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'a.b.c', type: 'alpha'
        .registerUrl '/a/b/{a.b.c}', state: a: b: c: 'expected to be overriden'
        return

      inject (Route) ->
        match = Route.match '/a/b/hello'
        result = Route.extractData match
        expect(result).toEqual { a : b: c: 'hello' }

    it 'should override path data with search data', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'c', type: 'alpha'
        .registerUrl '/a/b/{c}'
        return

      inject (Route) ->
        match = Route.match '/a/b/pathValue'
        result = Route.extractData match, { c: 'searchValue' }
        expect(result).toEqual { c : 'searchValue' }

  describe 'extractPathData', ->
    it 'should extract data from the path component of the match', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'tokenB', type: 'alpha'
        .and 'tokenA', type: 'numeric'
        .registerUrl '/{tokenA}/{tokenB}/c'
        return

      inject (Route) ->
        match = Route.match '/1/b/c'
        data = Route.extractData match
        expect(data.tokenA).toBe 1
        expect(data.tokenB).toBe 'b'

    it "should replace each type's data with the parsed form, if a parser is specified for that type", ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerType 'customType', { regex: /[a-z]/, parser: (token) -> "#{token}!!!" }
        RouteProvider.registerUrlToken 'tokenB', type: 'customType'
        .and 'tokenA', type: 'numeric'
        .registerUrl '/{tokenA}/{tokenB}/c'
        return

      inject (Route) ->
        match = Route.match '/1/b/c'
        data = Route.extractData match
        expect(data.tokenA).toBe 1
        expect(data.tokenB).toBe 'b!!!'

    it 'should use the statePath as the key for the data, if it is supplied', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'tokenB', type: 'alpha', statePath: 'somewhere.else'
        .and 'tokenA', type: 'numeric'
        .registerUrl '/{tokenA}/{tokenB}/c'
        return

      inject (Route) ->
        match = Route.match '/1/b/c'
        data = Route.extractData match
        expect(data.tokenA).toBe 1
        expect(data.somewhere.else).toBe 'b'

  describe 'extractDefaultData', ->
    it 'should automatically inject default data', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrl '/a/b/c', state: 'a.b.c': true
        return

      inject (Route) ->
        match = Route.match '/a/b/c'
        result = Route.extractDefaultData match
        expect(result).toEqual jasmine.objectContaining { a : b: c: true }

  describe 'extractSearchData', ->
    it 'should return fields whose value match the regex registered for that token', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'tokenA', type: 'alpha'
        return

      inject (Route) ->
        result = Route.extractSearchData { tokenA: 'hello' }
        expect(result).toEqual jasmine.objectContaining { tokenA: 'hello' }

    it "should replace each token's data with the parsed form, if a parser is specified for that token", ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerType 'customType', { regex: /[a-z]/, parser: (token) -> "#{token}!!!" }
        RouteProvider.registerUrlToken 'tokenA', type: 'customType'
        return

      inject (Route) ->
        result = Route.extractSearchData { tokenA: 'hello' }
        expect(result).toEqual jasmine.objectContaining { tokenA: 'hello!!!' }

    it "should inject dependencies into the parser", ->
      parser = jasmine.createSpy()

      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerType 'customType', { regex: /[a-z]/, parser: ['Route', 'token', parser] }
        RouteProvider.registerUrlToken 'tokenA', type: 'customType'
        return

      inject (Route) ->
        tokenValue = 'token value'
        Route.extractSearchData { tokenA: tokenValue }

        expect(parser).toHaveBeenCalledWith(Route, tokenValue)

    it 'should default to using the data from $location.search()', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'tokenA', type: 'alpha'
        return

      inject (Route, $location) ->
        spyOn($location, 'search').and.returnValue { tokenA: 'hello' }
        result = Route.extractSearchData()
        expect(result).toEqual jasmine.objectContaining { tokenA: 'hello' }

    it 'should rename fields that have a searchAlias defined', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'a.b.c', type: 'alpha', searchAlias: 'hello'
        return

      inject (Route) ->
        result = Route.extractSearchData { hello: 'world' }
        expect(result).toEqual jasmine.objectContaining { a : b: c: 'world' }

    it 'should not return data that has a regex defined when the regex does not match the value from the search', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlToken 'a', type: 'alpha', searchAlias: 'hello'
        return

      inject (Route) ->
        result = Route.extractSearchData { hello: '123', a: '123' }
        expect(Object.keys(result).length).toBe 0

    it 'should return data that does not have a token defined for it', ->
      inject (Route) ->
        result = Route.extractSearchData { hello: '123' }
        expect(result).toEqual jasmine.objectContaining { hello: '123' }


  describe 'getUrlWriters',  ->
    it 'should return all of the registered URL writers', ->
      writerA = jasmine.createSpy 'writerA'
      writerB = jasmine.createSpy 'writerB'

      window.angular.mock.module (RouteProvider) ->
        RouteProvider
        .registerUrlWriter 'writerB', writerB
        .registerUrlWriter 'writerA', writerA

        return

      inject (Route) ->
        writers = Route.getUrlWriters()

        expect(_.keys(writers).length).toBe 2

        writers.writerA()
        writers.writerB()

        expect(writerA).toHaveBeenCalled()
        expect(writerB).toHaveBeenCalled()

  describe 'urlWriters', ->
    it 'should inject an object called UrlData which is the data passed to the invoker', ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlWriter 'pagination', (UrlData, State) ->
          page = UrlData.page or State.get 'page'
          "/page/#{page}"
        return

      inject ($compile, $rootScope, State, Route) ->
        State.set 'page', 2

        expect(Route.invokeUrlWriter('pagination')).toBe '/page/2'
        expect(Route.invokeUrlWriter('pagination', page: 5)).toBe '/page/5'

    it 'should inject other services as normal', ->
      calledWithLocation = undefined

      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlWriter 'pagination', (UrlData, $location) ->
          calledWithLocation = $location
        return

      inject ($location, Route) ->
        Route.invokeUrlWriter('pagination')
        expect(calledWithLocation).toBe $location

  describe 'go', ->
    it "should call the specified url writer and update the browser's URL to the value returned", ->
      window.angular.mock.module (RouteProvider) ->
        RouteProvider.registerUrlWriter 'pagination', (UrlData) ->
          "/page/#{UrlData.page}"
        return

      inject (Route, $location) ->
        spyOn $location, 'url'
        Route.go 'pagination', page: 3
        expect($location.url).toHaveBeenCalledWith '/page/3'

  describe 'persistentStates',  ->
    it 'set/get should work as expected', ->

      window.angular.mock.module (RouteProvider) ->
        RouteProvider.setPersistentStates 'a', 'b'

        return

      inject (Route) ->
        expect(Route.getPersistentStates()).toEqual ['a', 'b']

    it 'should suppress duplicate entries', ->

      window.angular.mock.module (RouteProvider) ->
        RouteProvider.setPersistentStates 'a'
        RouteProvider.setPersistentStates 'a'

        return

      inject (Route) ->
        expect(Route.getPersistentStates()).toEqual ['a']
