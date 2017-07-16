describe('route-class directive', function() {
  beforeEach(function () {
    window.angular.mock.module('bicker_router');
  });

  it('adds the specified class to the element when the view has the matching binding rendered within it', function () {
    const template =
      `<a route-class="{ className: 'active',  viewName: 'main', bindingName: 'bindingName' }">link text</a>`

    inject(($compile, $rootScope, Route) => {
      Route.setCurrentBinding('main', { name: 'bindingName'})
      const element = $compile(template)($rootScope.$new())
      $rootScope.$digest()

      expect(element.hasClass("active")).toBeTruthy()
    })
  })

  it('supports regex for the binding name', function () {
    // NB: You can't inline a regexp in AngularJS expressions, thus the indirection
    const template =
      `<a route-class="$ctrl.getRouteClassObject()">link text</a>`

    inject(($compile, $rootScope, Route) => {
      const scope = $rootScope.$new()

      scope.$ctrl = {
        getRouteClassObject () {
          return { className: 'active', viewName: 'main', bindingName: /^b[in]{2}dingName/ }
        }
      }

      Route.setCurrentBinding('main', { name: 'bindingName'})
      const element = $compile(template)(scope)
      $rootScope.$digest()

      expect(element.hasClass("active")).toBeTruthy()
    })
  })

  it('removes the specified class from the element when the view has a different binding rendered within it', function () {
    const template =
      `<a route-class="{ className: 'active',  viewName: 'main', bindingName: 'bindingName' }">link text</a>`

    inject(($compile, $rootScope, Route) => {
      Route.setCurrentBinding('main', {name: 'bindingName'})
      const element = $compile(template)($rootScope.$new())
      $rootScope.$digest()

      expect(element.hasClass("active")).toBeTruthy()

      Route.setCurrentBinding('main', {name: 'someOtherBinding'})
      $rootScope.$digest()
      expect(element.hasClass("active")).toBeFalsy()
    })
  })

  it('removes the specified class from the element when the view has no binding rendered within it', function () {
    const template =
      `<a route-class="{ className: 'active',  viewName: 'main', bindingName: 'bindingName' }">link text</a>`

    inject(($compile, $rootScope, Route) => {
      Route.setCurrentBinding('main', { name: 'bindingName'})
      const element = $compile(template)($rootScope.$new())
      $rootScope.$digest()

      expect(element.hasClass("active")).toBeTruthy()

      Route.deleteCurrentBinding('main')
      $rootScope.$digest()
      expect(element.hasClass("active")).toBeFalsy()
    })
  })
})