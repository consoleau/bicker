(function() {
  angular.module('bicker_router', ['ngAnimate']).run(function(State, Route, $location, $rootScope, ObjectHelper, PendingViewCounter) {
    var oldUrl;
    oldUrl = void 0;
    $rootScope.$on('$locationChangeStart', function() {
      if (Route.isReady()) {
        return Route.setReady(false);
      }
    });
    return $rootScope.$on('$locationChangeSuccess', function(e, newUrl) {
      var data, eventData, fieldsToUnset, key, match, ref, value;
      if (newUrl === oldUrl) {
        return;
      }
      oldUrl = newUrl;
      PendingViewCounter.reset();
      match = Route.match($location.path());
      if (!match) {
        data = {};
      } else {
        data = Route.extractData(match);
      }
      fieldsToUnset = ObjectHelper.notIn(State.list, data);
      fieldsToUnset = _.difference(fieldsToUnset, Route.getPersistentStates().concat(Route.getFlashStates()));
      eventData = {
        unsetting: fieldsToUnset,
        setting: data
      };
      $rootScope.$emit('bicker_router.beforeStateChange', eventData);
      if (eventData.unsetting.length !== 0) {
        State.unset(eventData.unsetting);
      }
      ref = eventData.setting;
      for (key in ref) {
        value = ref[key];
        State.set(key, value);
      }
      Route.resetFlashStates();
      Route.setReady(true);
    });
  });

}).call(this);

(function() {
  var slice = [].slice;

  angular.module('bicker_router').constant('ObjectHelper', {
    get: function(object, path) {
      var i, key, len, parent, pieces, segment;
      if (path === '') {
        return object;
      }
      pieces = path.split('.');
      key = pieces.pop();
      parent = object;
      for (i = 0, len = pieces.length; i < len; i++) {
        segment = pieces[i];
        parent = parent[segment];
        if (parent === void 0) {
          return void 0;
        }
      }
      return parent[key];
    },
    set: function(object, path, value) {
      var i, key, len, parent, pieces, segment;
      pieces = path.split('.');
      key = pieces.pop();
      parent = object;
      for (i = 0, len = pieces.length; i < len; i++) {
        segment = pieces[i];
        if (parent[segment] === void 0) {
          parent[segment] = {};
        }
        parent = parent[segment];
      }
      return parent[key] = value;
    },
    unset: function(object, path) {
      var i, key, len, parent, pieces, segment;
      if (path === '') {
        return object;
      }
      pieces = path.split('.');
      key = pieces.pop();
      parent = object;
      for (i = 0, len = pieces.length; i < len; i++) {
        segment = pieces[i];
        parent = parent[segment];
        if (parent === void 0) {
          return false;
        }
      }
      if (parent[key] === void 0) {
        return false;
      }
      delete parent[key];
      return true;
    },
    notIn: function(a, b, prefix) {
      var i, key, len, notIn, ref, thisPath;
      if (prefix == null) {
        prefix = '';
      }
      notIn = [];
      prefix = prefix.length > 0 ? prefix + "." : '';
      ref = Object.keys(a);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        thisPath = "" + prefix + key;
        if (b[key] === void 0) {
          notIn.push(thisPath);
        } else if (typeof a[key] === 'object' && (!(a[key] instanceof Array))) {
          notIn = notIn.concat(this.notIn(a[key], b[key], thisPath));
        }
      }
      return notIn;
    },
    "default": function() {
      var defaultSet, defaultSets, key, overrides, result, value;
      overrides = arguments[0], defaultSets = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      result = {};
      if (defaultSets.length === 1) {
        defaultSet = defaultSets[0];
      } else {
        defaultSet = this["default"].apply(this, defaultSets);
      }
      for (key in defaultSet) {
        value = defaultSet[key];
        if (value instanceof Array) {
          result[key] = overrides[key] || value;
        } else if (typeof value === "object" && typeof overrides[key] === "object") {
          result[key] = this["default"](overrides[key], value);
        } else {
          result[key] = overrides[key] || value;
        }
      }
      for (key in overrides) {
        value = overrides[key];
        result[key] = result[key] || value;
      }
      return result;
    }
  });

}).call(this);

(function() {
  angular.module('bicker_router').directive('routeHref', function(Route, $location, $timeout) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, iElement, iAttrs) {
        var ref, writer, writerName;
        if (iAttrs.ignoreHref === void 0) {
          iElement.click(function(event) {
            var url;
            event.preventDefault();
            url = iElement.attr('href');
            if (!Route.isHtml5ModeEnabled()) {
              url = url.replace(/^#/, '');
            }
            return $timeout(function() {
              return $location.url(url);
            });
          });
        }
        ref = Route.getUrlWriters();
        for (writerName in ref) {
          writer = ref[writerName];
          scope[writerName + "UrlWriter"] = writer;
        }
        return scope.$watch(iAttrs.routeHref, function(newUrl) {
          var url;
          if (Route.isHtml5ModeEnabled()) {
            url = newUrl;
          } else {
            url = '#' + newUrl;
          }
          return iElement.attr('href', url);
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('bicker_router').directive('view', function($compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, $templateRequest, Route) {
    var directive;
    directive = {
      restrict: 'E',
      scope: false,
      replace: true,
      template: '<div></div>',
      link: function(viewDirectiveScope, iElement, iAttrs) {
        var bindings, createView, destroyView, fields, getComponentFromBinding, getFieldsToWatch, getMatchingBinding, getStateDataForBinding, getStateFieldsFromBinding, getStateFieldsFromView, hasRequiredData, manageView, previousBinding, previousBoundState, resolve, showResolvingErrorTemplate, showResolvingTemplate, stripNegationPrefix, view, viewCreated, viewManagementPending, viewScope;
        viewCreated = false;
        viewScope = void 0;
        viewManagementPending = false;
        view = ViewBindings.getView(iAttrs.name);
        bindings = view.getBindings();
        iElement.addClass('ng-hide');
        previousBoundState = void 0;
        previousBinding = void 0;
        getStateDataForBinding = function(binding) {
          return _.cloneDeep(State.getSubset(getStateFieldsFromBinding(binding)));
        };
        getComponentFromBinding = function(binding) {
          var source;
          source = binding.component ? $injector.get(binding.component + 'Directive')[0] : binding;
          return _.defaults(_.pick(source, ['controller', 'templateUrl', 'controllerAs']), {
            controllerAs: '$ctrl'
          });
        };
        hasRequiredData = function(binding) {
          var element, i, len, negateResult, requiredState, requirement;
          requiredState = binding.requiredState || [];
          for (i = 0, len = requiredState.length; i < len; i++) {
            requirement = requiredState[i];
            negateResult = false;
            if ('!' === requirement.charAt(0)) {
              requirement = requirement.slice(1);
              negateResult = true;
            }
            element = State.get(requirement);
            if (element == null) {
              return false;
            }
            if (negateResult) {
              element = !element;
            }
            if (!element) {
              return false;
            }
          }
          if (binding.canActivate) {
            if (!$injector.invoke(binding.canActivate)) {
              return false;
            }
          }
          return true;
        };
        manageView = function(element, bindings) {
          var matchingBinding, newState;
          matchingBinding = getMatchingBinding(bindings);
          if (!matchingBinding) {
            if (viewCreated) {
              $animate.addClass(element, 'ng-hide').then((function(_this) {
                return function() {
                  return destroyView(element);
                };
              })(this));
              previousBoundState = void 0;
              previousBinding = void 0;
            }
            return;
          }
          newState = getStateDataForBinding(matchingBinding);
          if (matchingBinding === previousBinding && angular.equals(previousBoundState, newState)) {
            return;
          }
          previousBinding = matchingBinding;
          previousBoundState = newState;
          PendingViewCounter.increase();
          return showResolvingTemplate(element, matchingBinding).then(function(hasResolvingTemplate) {
            var delayForRealTemplateInsertion;
            delayForRealTemplateInsertion = hasResolvingTemplate ? 300 : void 0;
            if (!viewCreated) {
              return $animate.removeClass(element, 'ng-hide').then((function(_this) {
                return function() {
                  return createView(element, matchingBinding, delayForRealTemplateInsertion);
                };
              })(this));
            } else {
              viewScope.$destroy();
              return createView(element, matchingBinding, delayForRealTemplateInsertion);
            }
          });
        };
        getMatchingBinding = function(bindings) {
          var binding, i, len;
          for (i = 0, len = bindings.length; i < len; i++) {
            binding = bindings[i];
            if (hasRequiredData(binding)) {
              return binding;
            }
          }
          return void 0;
        };
        destroyView = function(element) {
          if (viewCreated === false) {
            return;
          }
          viewCreated = false;
          element.html('');
          return viewScope.$destroy();
        };
        createView = function(element, binding, minimumDelay) {
          var component, onResolutionFailure, onSuccessfulResolution, promises, timeStartedMainView;
          timeStartedMainView = Date.now();
          component = getComponentFromBinding(binding);
          onSuccessfulResolution = function(args) {
            var injectMainTemplate, mainTemplateInjectionDelay, resolvingTemplateShownTime;
            if (getMatchingBinding(bindings) !== binding) {
              return;
            }
            viewCreated = true;
            resolvingTemplateShownTime = Date.now() - timeStartedMainView;
            injectMainTemplate = function() {
              var controller, dependencies, link, locals, template;
              dependencies = args.dependencies;
              template = args.template;
              element.html(template);
              link = $compile(element.contents());
              viewScope = viewDirectiveScope.$new();
              if (component.controller) {
                locals = _.merge(dependencies, {
                  $scope: viewScope
                });
                controller = $controller(component.controller, locals);
                locals.$scope[component.controllerAs] = controller;
              }
              link(viewScope);
              return $timeout(function() {
                if (!binding.manualCompletion) {
                  return PendingViewCounter.decrease();
                }
              });
            };
            mainTemplateInjectionDelay = Math.max(0, minimumDelay - resolvingTemplateShownTime);
            if (resolvingTemplateShownTime < minimumDelay) {
              return $timeout(function() {
                return injectMainTemplate();
              }, mainTemplateInjectionDelay);
            } else {
              return injectMainTemplate();
            }
          };
          onResolutionFailure = function() {
            $timeout(function() {
              if (!binding.manualCompletion) {
                return PendingViewCounter.decrease();
              }
            });
            return showResolvingErrorTemplate(element, binding);
          };
          promises = {
            template: $templateRequest(component.templateUrl),
            dependencies: resolve(binding)
          };
          return $q.all(promises).then(onSuccessfulResolution, onResolutionFailure);
        };
        showResolvingTemplate = function(element, binding) {
          var deferred;
          if (!binding.resolvingTemplateUrl || !binding.resolve || Object.keys(binding.resolve).length === 0) {
            deferred = $q.defer();
            deferred.resolve(false);
            return deferred.promise;
          }
          return $templateRequest(binding.resolvingTemplateUrl).then(function(template) {
            element.html(template);
            return $compile(element.contents())($rootScope.$new());
          });
        };
        showResolvingErrorTemplate = function(element, binding) {
          if (!binding.resolvingErrorTemplateUrl) {
            return;
          }
          return $templateRequest(binding.resolvingErrorTemplateUrl).then(function(template) {
            return element.html(template);
          });
        };
        resolve = function(binding) {
          var deferred, dependencyFactory, dependencyName, promises, ref;
          if (!binding.resolve || Object.keys(binding.resolve).length === 0) {
            deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
          }
          promises = {};
          ref = binding.resolve;
          for (dependencyName in ref) {
            dependencyFactory = ref[dependencyName];
            promises[dependencyName] = $injector.invoke(dependencyFactory);
          }
          return $q.all(promises);
        };
        getStateFieldsFromBinding = function(binding) {
          return _.union(binding.requiredState || [], binding.watchedState || []);
        };
        stripNegationPrefix = function(str) {
          if (str.charAt(0) === '!') {
            return str.substr(1);
          } else {
            return str;
          }
        };
        getStateFieldsFromView = function(view) {
          return _.flatten(_.map(view.getBindings(), getStateFieldsFromBinding));
        };
        getFieldsToWatch = function(view) {
          return _.uniq(_.map(getStateFieldsFromView(view), stripNegationPrefix));
        };
        fields = getFieldsToWatch(view);
        return Route.whenReady().then(function() {
          var stateWatcher;
          viewManagementPending = true;
          manageView(iElement, bindings);
          viewManagementPending = false;
          if (fields.length === 0) {
            return;
          }
          stateWatcher = function() {
            if (viewManagementPending) {
              return;
            }
            viewManagementPending = true;
            return $timeout(function() {
              manageView(iElement, bindings);
              return viewManagementPending = false;
            });
          };
          State.watch(fields, stateWatcher);
          return viewDirectiveScope.$on('$destroy', function() {
            return State.removeWatcher(stateWatcher);
          });
        });
      }
    };
    return directive;
  });

}).call(this);

(function() {
  angular.module('bicker_router').factory('PendingViewCounter', function($rootScope) {
    var PendingViewCounter;
    PendingViewCounter = (function() {
      function PendingViewCounter() {}

      PendingViewCounter.prototype.count = 0;

      PendingViewCounter.prototype.initialViewsLoaded = false;

      PendingViewCounter.prototype.get = function() {
        return this.count;
      };

      PendingViewCounter.prototype.increase = function() {
        return this.count += 1;
      };

      PendingViewCounter.prototype.decrease = function() {
        this.count = Math.max(0, this.count - 1);
        if (this.count === 0) {
          if (!this.initialViewsLoaded) {
            $rootScope.$broadcast('bicker_router.initialViewsLoaded');
            return this.initialViewsLoaded = true;
          } else {
            return $rootScope.$broadcast('bicker_router.currentViewsLoaded');
          }
        }
      };

      PendingViewCounter.prototype.reset = function() {
        this.count = 0;
        return this.initialViewsLoaded = false;
      };

      return PendingViewCounter;

    })();
    return new PendingViewCounter();
  });

}).call(this);

(function() {
  angular.module('bicker_router').factory('WatchableListFactory', function(ObjectHelper, WatcherFactory) {
    var WatchableList, factory;
    WatchableList = (function() {
      function WatchableList(list) {
        this.list = list;
        this.watchers = [];
      }

      WatchableList.prototype.get = function(path) {
        return ObjectHelper.get(this.list, path);
      };

      WatchableList.prototype.getAll = function() {
        return this.list;
      };

      WatchableList.prototype.getSubset = function(paths) {
        return _.zipObject(paths, _.map(paths, this.get.bind(this)));
      };

      WatchableList.prototype.set = function(path, value) {
        ObjectHelper.set(this.list, path, value);
        return this._notifyWatchers(path, value);
      };

      WatchableList.prototype.unset = function(paths) {
        var i, len, path, results;
        if (!(paths instanceof Array)) {
          paths = [paths];
        }
        results = [];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          ObjectHelper.unset(this.list, path);
          results.push(this._notifyWatchers(path, void 0));
        }
        return results;
      };

      WatchableList.prototype.watch = function(paths, handler) {
        var i, len, path, results;
        if (!(paths instanceof Array)) {
          paths = [paths];
        }
        results = [];
        for (i = 0, len = paths.length; i < len; i++) {
          path = paths[i];
          results.push(this.watchers.push(WatcherFactory.create(path, handler, this.get(path))));
        }
        return results;
      };

      WatchableList.prototype.removeWatcher = function(watcher) {
        var i, index, newWatchers, ref;
        if (this.watchers.length === 0) {
          return;
        }
        newWatchers = [];
        for (index = i = 0, ref = this.watchers.length - 1; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i) {
          if (this.watchers[index].handler !== watcher) {
            newWatchers.push(this.watchers[index]);
          }
        }
        return this.watchers = newWatchers;
      };

      WatchableList.prototype._notifyWatchers = function(changedPath) {
        var i, len, ref, results, watchedValue, watcher;
        ref = this.watchers;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          watcher = ref[i];
          watchedValue = ObjectHelper.get(this.list, watcher.watchPath);
          if (watcher.shouldNotify(changedPath, watchedValue)) {
            results.push(watcher.notify(changedPath, watchedValue));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };

      return WatchableList;

    })();
    return factory = {
      create: function(data) {
        if (data == null) {
          data = {};
        }
        return new WatchableList(data);
      }
    };
  });

}).call(this);

(function() {
  angular.module('bicker_router').factory('WatcherFactory', function() {
    var Watcher, factory;
    Watcher = (function() {
      function Watcher(watchPath1, handler1, initialValue) {
        this.watchPath = watchPath1;
        this.handler = handler1;
        if (initialValue == null) {
          initialValue = void 0;
        }
        this.currentValue = _.cloneDeep(initialValue);
      }

      Watcher.prototype.shouldNotify = function(changedPath, watchedValue) {
        return !angular.equals(this.currentValue, watchedValue);
      };

      Watcher.prototype.notify = function(changedPath, newValue) {
        this.handler(changedPath, newValue, this.currentValue);
        return this.currentValue = _.cloneDeep(newValue);
      };

      return Watcher;

    })();
    return factory = {
      create: function(watchPath, handler, initialValue) {
        if (initialValue == null) {
          initialValue = void 0;
        }
        return new Watcher(watchPath, handler, initialValue);
      }
    };
  });

}).call(this);

(function() {
  var slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('bicker_router').provider('Route', function(ObjectHelper) {
    var html5Mode, persistentStates, provider, ready, tokens, types, urlWriters, urls;
    tokens = {};
    urlWriters = {};
    urls = [];
    persistentStates = [];
    ready = false;
    types = {};
    html5Mode = false;
    provider = {
      registerType: function(name, config) {
        types[name] = config;
        types[name].regex = new RegExp(types[name].regex.source, 'i');
        return _.extend({
          and: this.registerType
        }, this);
      },
      registerUrlToken: function(name, config) {
        tokens[name] = _.extend({
          name: name
        }, config);
        return _.extend({
          and: this.registerUrlToken
        }, this);
      },
      registerUrlWriter: function(name, fn) {
        urlWriters[name] = fn;
        return _.extend({
          and: this.registerUrlWriter
        }, this);
      },
      registerUrl: function(pattern, config) {
        var urlData;
        if (config == null) {
          config = {};
        }
        urlData = {
          compiledUrl: this._compileUrlPattern(pattern, config),
          pattern: pattern
        };
        urls.unshift(_.extend(urlData, config));
        return _.extend({
          and: this.registerUrl
        }, this);
      },
      setPersistentStates: function() {
        var i, len, results, state, stateList;
        stateList = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        results = [];
        for (i = 0, len = stateList.length; i < len; i++) {
          state = stateList[i];
          if (indexOf.call(persistentStates, state) < 0) {
            results.push(persistentStates.push(state));
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      setHtml5Mode: function(mode) {
        return html5Mode = mode;
      },
      _compileUrlPattern: function(urlPattern, config) {
        var compiledUrl, match, token, tokenList, tokenRegex, urlRegex;
        urlPattern = this._escapeRegexSpecialCharacters(urlPattern);
        urlPattern = this._ensureOptionalTrailingSlash(urlPattern);
        tokenRegex = /\{([A-Za-z\._0-9]+)\}/g;
        urlRegex = urlPattern;
        if (!config.partialMatch) {
          urlRegex = "^" + urlRegex + "$";
        }
        tokenList = [];
        while ((match = tokenRegex.exec(urlPattern)) !== null) {
          token = tokens[match[1]];
          tokenList.push(token);
          urlRegex = urlRegex.replace(match[0], "(" + types[token.type].regex.source + ")");
        }
        urlRegex.replace('.', '\\.');
        return compiledUrl = {
          regex: new RegExp(urlRegex, 'i'),
          tokens: tokenList
        };
      },
      _ensureOptionalTrailingSlash: function(str) {
        if (str.match(/\/$/)) {
          return str.replace(/\/$/, '/?');
        }
        return str + '/?';
      },
      _escapeRegexSpecialCharacters: function(str) {
        return str.replace(/[\-\[\]\/\(\)\*\+\?\\\^\$\|]/g, "\\$&");
      },
      $get: function($location, State, $injector, $q) {
        var flashStates, service;
        _.forIn(urlWriters, function(writer, writerName) {
          return urlWriters[writerName] = function(data) {
            var locals;
            if (data == null) {
              data = {};
            }
            locals = {
              UrlData: data
            };
            return $injector.invoke(writer, {}, locals);
          };
        });
        flashStates = [];
        service = {
          readyDeferred: $q.defer(),
          match: function(urlToMatch) {
            var i, len, match, url;
            for (i = 0, len = urls.length; i < len; i++) {
              url = urls[i];
              if ((match = url.compiledUrl.regex.exec(urlToMatch)) !== null) {
                return {
                  url: url,
                  regexMatch: match
                };
              }
            }
            return null;
          },
          extractData: function(match, searchData) {
            var defaults, path;
            if (searchData == null) {
              searchData = void 0;
            }
            defaults = this.extractDefaultData(match);
            path = this.extractPathData(match);
            searchData = this.extractSearchData(searchData);
            return ObjectHelper["default"](searchData, path, defaults);
          },
          extractSearchData: function(searchData) {
            var data, dataKey, key, newData, ref, ref1, ref2, ref3, ref4, ref5, targetKey, value;
            if (searchData == null) {
              searchData = $location.search();
            }
            data = _.clone(searchData);
            newData = {};
            for (key in data) {
              value = data[key];
              targetKey = _.findKey(tokens, {
                searchAlias: key
              });
              if (targetKey == null) {
                targetKey = key;
              }
              if (!tokens[targetKey] || ((ref = types[(ref1 = tokens[targetKey]) != null ? ref1.type : void 0]) != null ? ref.regex.test(value) : void 0)) {
                if ((ref2 = types[(ref3 = tokens[targetKey]) != null ? ref3.type : void 0]) != null ? ref2.parser : void 0) {
                  value = $injector.invoke((ref4 = types[tokens[targetKey].type]) != null ? ref4.parser : void 0, null, {
                    token: value
                  });
                }
                dataKey = ((ref5 = tokens[targetKey]) != null ? ref5.statePath : void 0) || targetKey;
                ObjectHelper.set(newData, dataKey, value);
              }
            }
            return newData;
          },
          extractDefaultData: function(match) {
            var data, key, ref, value;
            data = {};
            ref = match.url.state;
            for (key in ref) {
              value = ref[key];
              ObjectHelper.set(data, key, (typeof value === 'object' ? _.cloneDeep(value) : value));
            }
            return data;
          },
          extractPathData: function(match) {
            var data, i, n, pathTokens, ref, token, value;
            data = {};
            pathTokens = match.url.compiledUrl.tokens;
            if (pathTokens.length === 0) {
              return {};
            }
            for (n = i = 0, ref = pathTokens.length - 1; 0 <= ref ? i <= ref : i >= ref; n = 0 <= ref ? ++i : --i) {
              token = match.url.compiledUrl.tokens[n];
              value = match.regexMatch[n + 1];
              if (types[token.type].parser) {
                value = $injector.invoke(types[token.type].parser, null, {
                  token: value
                });
              }
              ObjectHelper.set(data, token.statePath || token.name, value);
            }
            return data;
          },
          getUrlWriters: function() {
            return urlWriters;
          },
          getUrlWriter: function(name) {
            return urlWriters[name];
          },
          invokeUrlWriter: function(name, data) {
            if (data == null) {
              data = {};
            }
            return urlWriters[name](data);
          },
          go: function(name, data) {
            if (data == null) {
              data = {};
            }
            return $location.url(this.invokeUrlWriter(name, data));
          },
          getPersistentStates: function() {
            return persistentStates;
          },
          resetFlashStates: function() {
            return flashStates = [];
          },
          addFlashStates: function() {
            var newStates;
            newStates = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return flashStates = flashStates.concat(newStates);
          },
          getFlashStates: function() {
            return flashStates;
          },
          setReady: function(ready) {
            if (!ready) {
              this.readyDeferred = $q.defer();
            } else {
              this.readyDeferred.resolve();
            }
            return this.ready = ready;
          },
          isReady: function() {
            return this.ready;
          },
          isHtml5ModeEnabled: function() {
            return html5Mode;
          },
          whenReady: function() {
            return this.readyDeferred.promise;
          }
        };
        return service;
      }
    };
    provider.registerType('numeric', {
      regex: /\d+/,
      parser: [
        'token', function(token) {
          return parseInt(token);
        }
      ]
    });
    provider.registerType('alpha', {
      regex: /[a-zA-Z]+/
    });
    provider.registerType('any', {
      regex: /.+/
    });
    return provider;
  });

}).call(this);

(function() {
  angular.module('bicker_router').provider('State', function() {
    return {
      $get: function(WatchableListFactory) {
        var stateService;
        stateService = WatchableListFactory.create();
        return stateService;
      }
    };
  });

}).call(this);

(function() {
  angular.module('bicker_router').provider('ViewBindings', function() {
    var View, provider, views;
    views = {};
    View = (function() {
      function View(name1, bindings1) {
        this.name = name1;
        this.bindings = bindings1;
        if (!(this.bindings instanceof Array)) {
          this.bindings = [this.bindings];
        }
      }

      View.prototype.getBindings = function() {
        return this.bindings;
      };

      return View;

    })();
    return provider = {
      bind: function(name, config) {
        var applyCommonRequiredState, applyCommonResolve, newBindings;
        applyCommonRequiredState = function(bindings, commonRequiredState) {
          var binding, i, len, results;
          results = [];
          for (i = 0, len = newBindings.length; i < len; i++) {
            binding = newBindings[i];
            if (!(binding.requiredState instanceof Array)) {
              binding.requiredState = [binding.requiredState];
            }
            results.push(binding.requiredState = binding.requiredState.concat(commonRequiredState));
          }
          return results;
        };
        applyCommonResolve = function(bindings, commonResolve) {
          var binding, i, len, results;
          results = [];
          for (i = 0, len = newBindings.length; i < len; i++) {
            binding = newBindings[i];
            if (!('resolve' in binding)) {
              binding.resolve = {};
            }
            results.push(_.defaults(binding.resolve, commonResolve));
          }
          return results;
        };
        newBindings = [];
        if ('bindings' in config) {
          newBindings = config['bindings'];
        } else {
          newBindings = config instanceof Array ? config : [config];
        }
        if (!(newBindings.length > 0)) {
          throw new Error("Invalid call to ViewBindingsProvider.bind for name '" + name + "'");
        }
        if ('commonRequiredState' in config) {
          applyCommonRequiredState(newBindings, config['commonRequiredState']);
        }
        if ('commonResolve' in config) {
          applyCommonResolve(newBindings, config['commonResolve']);
        }
        return views[name] = new View(name, newBindings);
      },
      $get: function() {
        return {
          getView: function(view) {
            return views[view];
          }
        };
      }
    };
  });

}).call(this);
