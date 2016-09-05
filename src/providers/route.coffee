angular.module('bicker_router').provider 'Route', (ObjectHelper) ->
  tokens = {}
  urlWriters = {}
  urls = []
  persistentStates = []
  ready = false
  types = {}
  html5Mode = false

  provider =

    registerType: (name, config) ->
      types[name] = config
      types[name].regex = new RegExp(types[name].regex.source, 'i')
      _.extend { and: @registerType }, @

    registerUrlToken: (name, config) ->
      tokens[name] = _.extend {name: name}, config
      _.extend { and: @registerUrlToken }, @

    registerUrlWriter: (name, fn) ->
      urlWriters[name] = fn
      _.extend { and: @registerUrlWriter }, @

    registerUrl: (pattern, config = {}) ->
      urlData =
        compiledUrl: @_compileUrlPattern(pattern, config)
        pattern: pattern

      urls.unshift(_.extend(urlData, config))
      _.extend { and: @registerUrl }, @

    setPersistentStates: (stateList...) ->
      for state in stateList
        persistentStates.push(state) unless state in persistentStates

    setHtml5Mode: (mode) -> html5Mode = mode

    _compileUrlPattern: (urlPattern, config) ->
      urlPattern = @_escapeRegexSpecialCharacters urlPattern
      urlPattern = @_ensureOptionalTrailingSlash urlPattern

      tokenRegex = /\{([A-Za-z\._0-9]+)\}/g
      urlRegex = urlPattern

      if not config.partialMatch
        urlRegex = "^#{urlRegex}$"

      tokenList = []

      while (match = tokenRegex.exec urlPattern) isnt null
        token = tokens[match[1]]
        tokenList.push token
        urlRegex = urlRegex.replace match[0], "(#{types[token.type].regex.source})"

      urlRegex.replace '.', '\\.'

      compiledUrl =
        regex: new RegExp urlRegex, 'i'
        tokens: tokenList

    _ensureOptionalTrailingSlash: (str) ->
      if str.match /\/$/
        return str.replace /\/$/, '/?'
      str + '/?'

    _escapeRegexSpecialCharacters: (str) ->
      str.replace /[\-\[\]\/\(\)\*\+\?\\\^\$\|]/g, "\\$&"

    $get: ($location, State, $injector, $q) ->

      # When getting a new instance of the service (only done once), we need to iterate over the urlWriters and turn
      # them into methods that invoke the REAL urlWriter, but providing dependency injection to it, while also
      # giving it the data that the callee passes in.

      # The reason we have to do this here is because we don't have access to the $injector back in the routeProvider.

      _.forIn urlWriters, (writer, writerName) ->
        urlWriters[writerName] = (data = {}) ->
          locals = UrlData: data
          $injector.invoke writer, {}, locals

      flashStates = []

      service =
        readyDeferred: $q.defer()

        match: (urlToMatch) ->
          for url in urls
            if (match = url.compiledUrl.regex.exec(urlToMatch)) isnt null
              return url: url, regexMatch: match
          null

        extractData: (match, searchData = undefined) ->
          defaults = @extractDefaultData match
          path = @extractPathData match
          searchData = @extractSearchData searchData
          ObjectHelper.default searchData, path, defaults

        extractSearchData: (searchData) ->
          searchData ?= $location.search()
          data = _.clone searchData
          newData = {}

          for key, value of data
            targetKey = _.findKey(tokens, { searchAlias: key })
            targetKey ?= key

            if not tokens[targetKey] or types[tokens[targetKey]?.type]?.regex.test value

              if types[tokens[targetKey]?.type]?.parser
                value = $injector.invoke(types[tokens[targetKey].type]?.parser, null, token: value)

              dataKey = tokens[targetKey]?.statePath or targetKey

              ObjectHelper.set newData, dataKey, value

          newData

        extractDefaultData: (match) ->
          data = {}

          for key, value of match.url.state
            ObjectHelper.set data, key, (if typeof value is 'object' then _.cloneDeep(value) else value)

          data

        extractPathData: (match) ->
          data = {}
          pathTokens = match.url.compiledUrl.tokens

          return {} if pathTokens.length is 0

          for n in [0..pathTokens.length-1]
            token = match.url.compiledUrl.tokens[n]
            value = match.regexMatch[n+1]

            value = $injector.invoke(types[token.type].parser, null, token: value) if types[token.type].parser

            ObjectHelper.set data, (token.statePath or token.name), value

          data

        getUrlWriters: -> urlWriters

        getUrlWriter: (name) -> urlWriters[name]

        invokeUrlWriter: (name, data = {}) -> urlWriters[name](data)

        go: (name, data = {}) -> $location.url @invokeUrlWriter name, data

        getPersistentStates: () ->
          persistentStates

        resetFlashStates: ->
          flashStates = [];

        addFlashStates: (newStates...) ->
          flashStates = flashStates.concat(newStates)

        getFlashStates: () ->
          flashStates

        setReady: (ready) ->
          if not ready
            @readyDeferred = $q.defer()
          else
            @readyDeferred.resolve()

          @ready = ready

        isReady: -> @ready

        isHtml5ModeEnabled: -> html5Mode

        whenReady: ->
          @readyDeferred.promise

      return service

  provider.registerType 'numeric', regex: /\d+/, parser: ['token', (token) -> parseInt token]
  provider.registerType 'alpha', regex: /[a-zA-Z]+/
  provider.registerType 'any', regex: /.+/

  return provider
