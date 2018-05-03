angular.module('bicker_router').provider('Route', function(ObjectHelper) {
  "ngInject";
  const tokens = {};
  const urlWriters = [];
  const urls = [];
  const persistentStates = [];
  const ready = false;
  const types = {};
  let html5Mode = false;

  const provider = {

    registerType(name, config) {
      types[name] = config;
      types[name].regex = new RegExp(types[name].regex.source, 'i');
      return _.extend({ and: this.registerType }, this);
    },

    registerUrlToken(name, config) {
      tokens[name] = _.extend({name}, config);
      return _.extend({ and: this.registerUrlToken }, this);
    },

    registerUrlWriter(name, fn) {
      urlWriters[name] = fn;
      return _.extend({ and: this.registerUrlWriter }, this);
    },

    registerUrl(pattern, config = {}) {
      const urlData = {
        compiledUrl: this._compileUrlPattern(pattern, config),
        pattern
      };

      urls.push(_.extend(urlData, config));
      return _.extend({ and: this.registerUrl }, this);
    },

    setPersistentStates(...stateList) {
      _.forEach(stateList, (state) => {
        if (!persistentStates.includes(state)) {
          persistentStates.push(state);
        }
      });
    },

    setHtml5Mode(mode) {
      html5Mode = mode;
    },

    _compileUrlPattern(urlPattern, config) {
      let match;
      urlPattern = this._escapeRegexSpecialCharacters(urlPattern);
      urlPattern = this._ensureOptionalTrailingSlash(urlPattern);

      const tokenRegex = /\{([A-Za-z\._0-9]+)\}/g;
      let urlRegex = urlPattern;

      if (!config.partialMatch) {
        urlRegex = `^${urlRegex}$`;
      }

      const tokenList = [];

      while ((match = tokenRegex.exec(urlPattern)) !== null) {
        const token = tokens[match[1]];
        tokenList.push(token);
        urlRegex = urlRegex.replace(match[0], `(${types[token.type].regex.source})`);
      }

      urlRegex.replace('.', '\\.');

      return {
        regex: new RegExp(urlRegex, 'i'),
        tokens: tokenList
      };
    },

    _ensureOptionalTrailingSlash(str) {
      if (str.match(/\/$/)) {
        return str.replace(/\/$/, '/?');
      }
      return `${str}/?`;
    },

    _escapeRegexSpecialCharacters(str) {
      return str.replace(/[\-\[\]\/\(\)\*\+\?\\\^\$\|]/g, "\\$&");
    },

    $get($location, $injector, $q) {
      'ngInject';

      // When getting a new instance of the service (only done once), we need to iterate over the urlWriters and turn
      // them into methods that invoke the REAL urlWriter, but providing dependency injection to it, while also
      // giving it the data that the callee passes in.

      // The reason we have to do this here is because we don't have access to the $injector back in the routeProvider.

      _.forIn(urlWriters, (writer, writerName) =>
        urlWriters[writerName] = function(data) {
          if (!data) { data = {}; }
          const locals = {UrlData: data};
          return $injector.invoke(writer, {}, locals);
        }
      );

      let flashStates = [];

      const service = {
        currentBindings: {},
        readyDeferred: $q.defer(),

        match(urlToMatch) {
          for (const url of Array.from(urls)) {
            let match;
            if ((match = url.compiledUrl.regex.exec(urlToMatch)) !== null) {
              return {url, regexMatch: match};
            }
          }
          return null;
        },

        extractData(match, searchData = undefined) {
          const defaults = this.extractDefaultData(match);
          const path = this.extractPathData(match);
          searchData = this.extractSearchData(searchData);
          return ObjectHelper.default(searchData, path, defaults);
        },

        extractSearchData(searchData) {
          if (!searchData) { searchData = $location.search(); }
          const data = _.clone(searchData);
          const newData = {};

          _.forEach(data, (value, key) => {
            let targetKey = _.findKey(tokens, { searchAlias: key });
            if (!targetKey) { targetKey = key; }

            const tokenTypeName = tokens[targetKey] ? _.get(tokens[targetKey], 'type') : undefined;
            if (!tokens[targetKey] || (types[tokenTypeName].regex.test(value))) {

              const tokenType = tokens[targetKey] ? tokens[targetKey].type : undefined;
              const typeTokenType = tokenType ? types[tokenType] : undefined;
              const tokenTypeParsed = typeTokenType ? typeTokenType.parser : undefined;

              if (tokenTypeParsed) {
                value = $injector.invoke(tokenTypeParsed, null, {token: value});
              }

              const tokenTargetKeyStatePath = tokens[targetKey] ? tokens[targetKey].statePath : undefined;
              const dataKey = tokenTargetKeyStatePath || targetKey;

              ObjectHelper.set(newData, dataKey, value);
            }
          });

          return newData;
        },

        extractDefaultData(match) {
          const data = {};

          _.forEach(match.url.state, (value, key) => {
            ObjectHelper.set(data, key, (typeof value === 'object' ? _.cloneDeep(value) : value));
          });

          return data;
        },

        extractPathData(match) {
          const data = {};
          const pathTokens = match.url.compiledUrl.tokens;

          if (pathTokens.length === 0) { return {}; }

          for (let n = 0, end = pathTokens.length-1, asc = 0 <= end; asc ? n <= end : n >= end; asc ? n++ : n--) {
            const token = match.url.compiledUrl.tokens[n];
            let value = match.regexMatch[n+1];

            if (types[token.type].parser) { value = $injector.invoke(types[token.type].parser, null, {token: value}); }

            ObjectHelper.set(data, (token.statePath || token.name), value);
          }

          return data;
        },

        getUrlWriters() {
          return urlWriters;
        },

        getUrlWriter(name) {
          return urlWriters[name];
        },

        invokeUrlWriter(name, data = {}) {
          return urlWriters[name](data);
        },

        go(name, data = {}) {
          return $location.url(this.invokeUrlWriter(name, data));
        },

        getPersistentStates() {
          return persistentStates;
        },

        resetFlashStates() {
          flashStates = [];
        },

        addFlashStates(...newStates) {
          flashStates = flashStates.concat(newStates);
        },

        getFlashStates() {
          return flashStates;
        },

        setCurrentBinding(viewName, binding) {
          this.currentBindings[viewName] = binding;
        },

        getCurrentBinding(viewName) {
          return this.currentBindings[viewName];
        },

        deleteCurrentBinding(viewName) {
          delete this.currentBindings[viewName];
        },

        matchesCurrentBindingName(viewName, bindingNameExpression) {
          const currentBinding = this.getCurrentBinding(viewName);

          if (!currentBinding) {
            return false;
          }

          return bindingNameExpression instanceof RegExp ?
            bindingNameExpression.test(currentBinding.name) :
            currentBinding.name === bindingNameExpression;
        },

        setReady(ready) {
          if (!ready) {
            this.readyDeferred = $q.defer();
          } else {
            this.readyDeferred.resolve();
          }
          return ready;
        },

        isReady() {
          return ready;
        },

        isHtml5ModeEnabled() {
          return html5Mode;
        },

        whenReady() {
          return this.readyDeferred.promise;
        }
      };

      return service;
    }
  };

  provider.registerType('numeric', {regex: /\d+/, parser: ['token', token => parseInt(token)]});
  provider.registerType('alpha', {regex: /[a-zA-Z]+/});
  provider.registerType('any', {regex: /.+/});
  provider.registerType('list', {regex: /.+/, parser: ['token', token => token.split(',')]});

  return provider;
});
