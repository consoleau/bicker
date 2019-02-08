angular.module('bicker_router').provider('ViewBindings', function () {
  const views = [];

  class View {
    constructor(name, bindings) {
      this.name = name;
      this.bindings = bindings;
      if (!(this.bindings instanceof Array)) {
        this.bindings = [this.bindings];
      }
    }

    getBindings() {
      return this.bindings;
    }
  }

  return {

    bind(name, config) {

      function applyCommonRequiredState(bindings, commonRequiredState) {
        const result = [];
        for (const binding of Array.from(newBindings)) {
          if (!(binding.requiredState instanceof Array)) {
            binding.requiredState = [binding.requiredState];
          }
          result.push(binding.requiredState = binding.requiredState.concat(commonRequiredState));
        }
        return result;
      }

      function applyCommonResolve(bindings, commonResolve) {
        const result = [];
        for (const binding of Array.from(newBindings)) {
          if (!('resolve' in binding)) {
            binding.resolve = {};
          }
          result.push(_.defaults(binding.resolve, commonResolve));
        }
        return result;
      }

      function applyCommonFields(newBindings) {
        const basicCommonFields = [
          {name: 'commonResolvingTemplateUrl', overrideField: 'resolvingTemplateUrl'},
          {name: 'commonResolvingPermissionDeniedTemplateUrl', overrideField: 'resolvingPermissionDeniedTemplateUrl'},
          {name: 'commonResolvingPermissionDeniedComponent', overrideField: 'resolvingPermissionDeniedComponent'},
          {name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl'},
          {name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent'},
          {name: 'commonErrorComponent', overrideField: 'errorComponent'},
          {name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl'}
        ];

        for (const commonField of Array.from(basicCommonFields)) {
          if (commonField.name in config) {
            defaultBindingField(newBindings, commonField.overrideField, config[commonField.name]);
          }
        }

        if ('commonRequiredState' in config) {
          applyCommonRequiredState(newBindings, config['commonRequiredState']);
        }

        if ('commonResolve' in config) {
          return applyCommonResolve(newBindings, config['commonResolve']);
        }
      }

      function defaultBindingField(bindings, fieldName, defaultValue) {
        const result = [];
        for (const binding of Array.from(newBindings)) {
          let item;
          if (!(fieldName in binding)) {
            item = binding[fieldName] = defaultValue;
          }
          result.push(item);
        }
        return result;
      }

      let newBindings = [];
      if ('bindings' in config) {
        newBindings = config['bindings'];
      } else {
        newBindings = (config instanceof Array) ? config : [config];
      }

      if (!(newBindings.length > 0)) {
        throw new Error(`Invalid call to ViewBindingsProvider.bind for name '${name}'`);
      }

      applyCommonFields(newBindings);
      return views[name] = new View(name, newBindings);
    },

    $get() {
      return {
        getView(view) {
          return views[view];
        }
      };
    }
  };
});
