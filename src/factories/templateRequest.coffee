# Temporary shim for $templateRequest angular service in place until we can upgrade to 1.3
# doesn't throw exceptions and thus doesn't have the second parameter as in the angular version
angular.module('bicker_router').factory '$templateRequest', ($templateCache, $http, $q) ->
  (url) ->
    template = $templateCache.get url

    if template?
      deferred = $q.defer()
      deferred.resolve template
      return deferred.promise

    $http.get(url).then (response) ->
      $templateCache.put url, response.data
      response.data
