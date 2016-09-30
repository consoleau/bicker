# Overview

# Install Instructions

1. `npm install`
1. `bower install`

# Dev Guide

1. Ensure tests pass via `grunt test`
1. Ensure dist is run before final checkin via `grunt dist`

## Gotchas

1. The tests require port 8080, so if you are running anything (e.g. saas docker stack) on 8080 tests will fail

### Low-level Process - How does this work?
1. Angular loads in config mode
2. Application registers url tokens, urls, url writers and view bindings
3. Router registers a $locationChangeSuccess listener
4. Angular switches to run mode
5. Router receives $locationChangeSuccess event from Angular
6. Router extracts state from the URL and stores it in the State service
7. Router removes any obsolete state from the State service
8. Angular compiles the templates
9. Angular encounters a &lt;view&gt; directive
10. View directive checks all the bindings for that named view to see if the requisite State exists for any of them
11. View directive initialises based off the first binding found to have its requisite State (there should only be one!)
12. View directive increments the global pending view counter
13. View directive injects the resolving template into the view, if one has been defined
14. View directive resolves the promises defined by _resolve_ property of the view binding, if applicable
15. View directive injects the error template if one has been defined and any of the _resolve_ promises are rejected
15. View directive leaves the resolving template in place if an any promise is rejected and no error template has been defined (you should always define an error template!)
16. View directive compiles the main view template
17. View directive instantiates the view controller, injecting any resolved data, if a view controller is defined
18. View directive decrements the global pending view counter (whether view loading is successful or not) if the _manualCompletion_ property of the view binding is not set to true
19. If the _manualCompletion_ property of the view binding is set to true, the view _must_ call _PendingViewCounter.decrease()_ when it has finished rendering
20. If the global pending view counter hits zero for the first time the 'bicker_router.initialViewsLoaded' is broadcast from $rootScope
21. If the global pending view counter his zero again the 'bicker_router.currentViewsLoaded' is broadcast from $rootScope

Note that a view can contain another view, and the view directive works in such a way that the global pending view counter
of the child will be incremented before the parent is decremented, meaning that we can tell when the page is "done" by
listening for the "bicker_router.initialViewsLoaded" event.

Of course, being a single page application, the page being "done" happens many times. The router manages this by
resetting this state after each change to the URL, as a change to the URL constitutes an effective page load. A view whose state
is maintained between $location changes, that is, none of its requisite values change, is left open between these transitions. A view
whose state is lost is destroyed. Any animation linked to the destruction of that view will be enacted.

The view directives also watch State. If the requisite state for a view becomes available the view will be initialised.
Additionally, if the state changes such that it no longer has the requisite state for a view currently displayed, the
view will be destroyed. Views without requisite state are hidden using ng-hide and animations can be used to create
transitions when initially displaying or closing a view.

#Portability Issues
1. Requires jquery
2. Requires angular 1.2 (?)
3. Requires lodash

#TODO
1. Identify minimum version of Angular required
1. Style example
1. Document how to run examples
1. Tests shouldn't rely on port 8080
