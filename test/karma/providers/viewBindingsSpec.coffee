describe 'ViewBindings', ->
  beforeEach -> window.angular.mock.module 'bicker_router'

  describe 'bind called with array:', ->
    it 'get should return array', ->

      window.angular.mock.module (ViewBindingsProvider) ->
        ViewBindingsProvider.bind 'name1', [1,2,3]
        return

      inject (ViewBindings) ->
        expect(ViewBindings.getView('name1').getBindings()).toEqual [1,2,3]

  describe 'bind called with object:', ->
    it 'get should return one element array containing object', ->

      window.angular.mock.module (ViewBindingsProvider) ->
        ViewBindingsProvider.bind 'name1', { 'x' : 'y' }
        return

      inject (ViewBindings) ->
        expect(ViewBindings.getView('name1').getBindings()).toEqual [{ 'x' : 'y' }]

  describe 'bind called with object containing bindings array:', ->
    it 'get should return bindings array', ->

      window.angular.mock.module (ViewBindingsProvider) ->
        ViewBindingsProvider.bind 'name1', { 'bindings' : [1,2] }
        return

      inject (ViewBindings) ->
        expect(ViewBindings.getView('name1').getBindings()).toEqual [1,2]

  describe 'bind adds commonRequiredState:', ->
    
    it 'when commonRequiredState is a string and existing requiredState is an array', ->

      window.angular.mock.module (ViewBindingsProvider) ->
        ViewBindingsProvider.bind 'name1',
          'bindings' : [{ requiredState: ['a']}, { requiredState: ['b']}]
          'commonRequiredState': 'c'
        return

      inject (ViewBindings) ->
        expect(ViewBindings.getView('name1').getBindings()).toEqual [{ requiredState: ['a', 'c']}, { requiredState: ['b', 'c']}]

    it 'when commonRequiredState is a string and existing requiredState is a string', ->

      window.angular.mock.module (ViewBindingsProvider) ->
        ViewBindingsProvider.bind 'name1',
          'bindings' : [{ requiredState: 'a'}, { requiredState: 'b'}]
          'commonRequiredState': 'c'
        return

      inject (ViewBindings) ->
        expect(ViewBindings.getView('name1').getBindings()).toEqual [{ requiredState: ['a', 'c']}, { requiredState: ['b', 'c']}]

    it 'when commonRequiredState is an array and existing requiredState is an array', ->

      window.angular.mock.module (ViewBindingsProvider) ->
        ViewBindingsProvider.bind 'name1',
          'bindings' : [{ requiredState: ['a']}, { requiredState: ['b']}]
          'commonRequiredState': ['c', 'd']
        return

      inject (ViewBindings) ->
        expect(ViewBindings.getView('name1').getBindings()).toEqual [{ requiredState: ['a', 'c', 'd']}, { requiredState: ['b', 'c', 'd']}]

  describe 'commonResolve:', ->

    it 'merges with existing resolve section', ->

      window.angular.mock.module (ViewBindingsProvider) ->
        ViewBindingsProvider.bind 'name1',
          'bindings' : [ { resolve: { 'a' : 'a', 'b': 'b' } } ]
          'commonResolve': { 'b' : 'override', 'c': 'c' }
        return

      inject (ViewBindings) ->
        expect(ViewBindings.getView('name1').getBindings()).toEqual [{ resolve: { 'a': 'a', 'b': 'b', 'c': 'c' } }]

    it 'creates resolve section if missing', ->

      window.angular.mock.module (ViewBindingsProvider) ->
        ViewBindingsProvider.bind 'name1',
          'bindings' : [ {} ]
          'commonResolve': { 'a' : 'a' }
        return

      inject (ViewBindings) ->
        expect(ViewBindings.getView('name1').getBindings()).toEqual [{ resolve: { 'a': 'a' } }]

  describe 'when bind called with empty array:', ->

    it 'throws an error', ->

      throwsError = () ->
        window.angular.mock.module (ViewBindingsProvider) ->
          ViewBindingsProvider.bind 'name1', []

        inject (ViewBindings) ->
          bindings = ViewBindings.getView 'name1'

      expect(throwsError).toThrow()

#XXX TODO test for commonResolve 