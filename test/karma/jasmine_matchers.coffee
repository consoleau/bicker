beforeEach ->

  jasmine.addMatchers
    toBeInstanceOf: ->
      compare: (actual, expected) ->
        pass: actual instanceof expected
