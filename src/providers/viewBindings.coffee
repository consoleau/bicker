angular.module('bicker_router').provider 'ViewBindings', ->
  views = {}

  class View
    constructor: (@name, @bindings) ->
      @bindings = [@bindings] if not (@bindings instanceof Array)

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

      applyCommonFields = (newBindings) ->
        basicCommonFields = [
          { name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl' },
          { name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent' },
          { name: 'commonErrorComponent', overrideField: 'errorComponent' },
          { name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl' }
        ]

        for commonField in basicCommonFields
          if commonField.name of config
            defaultBindingField newBindings, commonField.overrideField, config[commonField.name]

        if 'commonRequiredState' of config
          applyCommonRequiredState newBindings, config['commonRequiredState']

        if 'commonResolve' of config
          applyCommonResolve newBindings, config['commonResolve']

      defaultBindingField = (bindings, fieldName, defaultValue) ->
        for binding in newBindings
          if not (fieldName of binding)
            binding[fieldName] = defaultValue

      newBindings = []
      if 'bindings' of config
        newBindings = config['bindings']
      else
        newBindings = if (config instanceof Array) then config else [config]

      unless newBindings.length > 0
        throw new Error "Invalid call to ViewBindingsProvider.bind for name '#{name}'"

      applyCommonFields newBindings
      views[name] = new View name, newBindings

    $get: ->
      getView: (view) -> views[view]
