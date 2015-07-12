angular.module('bicker_router').provider 'ViewBindings', ->
  views = {}

  class View
    constructor: (@name, @bindings) ->
      @bindings = [bindings] if not (@bindings instanceof Array)

    getBindings: -> @bindings

  provider =

    bind: (name, config) ->

      applyCommonRequiredState = (bindings, commonRequiredState) ->
        for binding in newBindings
          if not (binding.requiredState instanceof Array)
            binding.requiredState = [binding.requiredState]
          binding.requiredState = binding.requiredState.concat commonRequiredState

      applyCommonResolve = (bindings, commonResolve) ->
        for binding in newBindings
          if not ('resolve' of binding)
            binding.resolve = {}
          _.defaults binding.resolve, commonResolve

      newBindings = []
      if 'bindings' of config
        newBindings = config['bindings']
      else
        newBindings = if (config instanceof Array) then config else [config]

      unless newBindings.length > 0
        throw new Error "Invalid call to ViewBindingsProvider.bind for name '#{name}'"

      if 'commonRequiredState' of config
        applyCommonRequiredState newBindings, config['commonRequiredState']

      if 'commonResolve' of config
        applyCommonResolve newBindings, config['commonResolve']

      views[name] = new View name, newBindings

    $get: ->
      getView: (view) -> views[view]
