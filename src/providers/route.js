angular.module('bicker_router').provider('Route', function(ObjectHelper) {
  "ngInject";
  let tokens = {};
  let urlWriters = {};
  let urls = [];
  let persistentStates = [];
  let ready = false;
  let types = {};
  let html5Mode = false;

  let provider = {

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

    registerUrl(pattern, config) {
      if (config == null) { config = {}; }
      let urlData = {
        compiledUrl: this._compileUrlPattern(pattern, config),
        pattern
      };

      urls.push(_.extend(urlData, config));
      return _.extend({ and: this.registerUrl }, this);
    },

    setPersistentStates(...stateList) {
      return (() => {
        let result = [];
        for (let state of Array.from(stateList)) {
          let item;
          if (!Array.from(persistentStates).includes(state)) { item = persistentStates.push(state); }
          result.push(item);
        }
        return result;
      })();
    },

    setHtml5Mode(mode) { return html5Mode = mode; },

    _compileUrlPattern(urlPattern, config) {
      let match;
      let compiledUrl;
      urlPattern = this._escapeRegexSpecialCharacters(urlPattern);
      urlPattern = this._ensureOptionalTrailingSlash(urlPattern);

      let tokenRegex = /\{([A-Za-z\._0-9]+)\}/g;
      let urlRegex = urlPattern;

      if (!config.partialMatch) {
        urlRegex = `^${urlRegex}$`;
      }

      let tokenList = [];

      while ((match = tokenRegex.exec(urlPattern)) !== null) {
        let token = tokens[match[1]];
        tokenList.push(token);
        urlRegex = urlRegex.replace(match[0], `(${types[token.type].regex.source})`);
      }

      urlRegex.replace('.', '\\.');

      return compiledUrl = {
        regex: new RegExp(urlRegex, 'i'),
        tokens: tokenList
      };
    },

    _ensureOptionalTrailingSlash(str) {
      if (str.match(/\/$/)) {
        return str.replace(/\/$/, '/?');
      }
      return str + '/?';
    },

    _escapeRegexSpecialCharacters(str) {
      return str.replace(/[\-\[\]\/\(\)\*\+\?\\\^\$\|]/g, "\\$&");
    },

    $get($location, State, $injector, $q) {

      // When getting a new instance of the service (only done once), we need to iterate over the urlWriters and turn
      // them into methods that invoke the REAL urlWriter, but providing dependency injection to it, while also
      // giving it the data that the callee passes in.

      // The reason we have to do this here is because we don't have access to the $injector back in the routeProvider.

      _.forIn(urlWriters, (writer, writerName) =>
        urlWriters[writerName] = function(data) {
          if (data == null) { data = {}; }
          let locals = {UrlData: data};
          return $injector.invoke(writer, {}, locals);
        }
      );

      let flashStates = [];

      let service = {
        readyDeferred: $q.defer(),

        match(urlToMatch) {
          for (let url of Array.from(urls)) {
            var match;
            if ((match = url.compiledUrl.regex.exec(urlToMatch)) !== null) {
              return {url, regexMatch: match};
            }
          }
          return null;
        },

        extractData(match, searchData) {
          if (searchData == null) { searchData = undefined; }
          let defaults = this.extractDefaultData(match);
          let path = this.extractPathData(match);
          searchData = this.extractSearchData(searchData);
          return ObjectHelper.default(searchData, path, defaults);
        },

        extractSearchData(searchData) {
          if (searchData == null) { searchData = $location.search(); }
          let data = _.clone(searchData);
          let newData = {};

          for (let key in data) {
            var value = data[key];
            let targetKey = _.findKey(tokens, { searchAlias: key });
            if (targetKey == null) { targetKey = key; }

            if (!tokens[targetKey] || __guard__(types[tokens[targetKey] != null ? tokens[targetKey].type : undefined], x => x.regex.test(value))) {

              if (__guard__(types[tokens[targetKey] != null ? tokens[targetKey].type : undefined], x1 => x1.parser)) {
                value = $injector.invoke(types[tokens[targetKey].type] != null ? types[tokens[targetKey].type].parser : undefined, null, {token: value});
              }

              let dataKey = (tokens[targetKey] != null ? tokens[targetKey].statePath : undefined) || targetKey;

              ObjectHelper.set(newData, dataKey, value);
            }
          }

          return newData;
        },

        extractDefaultData(match) {
          let data = {};

          for (let key in match.url.state) {
            let value = match.url.state[key];
            ObjectHelper.set(data, key, (typeof value === 'object' ? _.cloneDeep(value) : value));
          }

          return data;
        },

        extractPathData(match) {
          let data = {};
          let pathTokens = match.url.compiledUrl.tokens;

          if (pathTokens.length === 0) { return {}; }

          for (let n = 0, end = pathTokens.length-1, asc = 0 <= end; asc ? n <= end : n >= end; asc ? n++ : n--) {
            let token = match.url.compiledUrl.tokens[n];
            let value = match.regexMatch[n+1];

            if (types[token.type].parser) { value = $injector.invoke(types[token.type].parser, null, {token: value}); }

            ObjectHelper.set(data, (token.statePath || token.name), value);
          }

          return data;
        },

        getUrlWriters() { return urlWriters; },

        getUrlWriter(name) { return urlWriters[name]; },

        invokeUrlWriter(name, data) { if (data == null) { data = {}; } return urlWriters[name](data); },

        go(name, data) { if (data == null) { data = {}; } return $location.url(this.invokeUrlWriter(name, data)); },

        getPersistentStates() {
          return persistentStates;
        },

        resetFlashStates() {
          return flashStates = [];
        },

        addFlashStates(...newStates) {
          return flashStates = flashStates.concat(newStates);
        },

        getFlashStates() {
          return flashStates;
        },

        setReady(ready) {
          if (!ready) {
            this.readyDeferred = $q.defer();
          } else {
            this.readyDeferred.resolve();
          }

          return this.ready = ready;
        },

        isReady() { return this.ready; },

        isHtml5ModeEnabled() { return html5Mode; },

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

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}