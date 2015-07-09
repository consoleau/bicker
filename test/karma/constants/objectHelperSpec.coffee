describe 'ObjectHelper', ->
  beforeEach -> window.angular.mock.module 'bicker_router'

  it 'gets out what is put in', ->
    a = {}
    inject (ObjectHelper) ->
      object = {}
      ObjectHelper.set object, 'key', a
      expect(ObjectHelper.get object, 'key').toBe a

  it 'allows dot notation to access nested values', ->
    b1 = { c: 22 }
    b2 = {}

    inject (ObjectHelper) ->
      object = {}
      ObjectHelper.set object, 'a.b.b1', b1
      ObjectHelper.set object, 'a.b.b2', b2

      expect(ObjectHelper.get object, 'a.b').toEqual(jasmine.objectContaining(b1: b1, b2: b2))
      expect(ObjectHelper.get object, 'a.b.b1.c').toEqual b1.c

  describe 'notIn', ->
    it 'recursively compares two objects, returning an array of dot notation strings representing the paths in a not in b', ->
      a = { user: { id: 1234, address: { suburb: 'Royston' }}}
      b = { user: { address: { }}}

      inject (ObjectHelper) ->
        expect(ObjectHelper.notIn a, b).toEqual ['user.id', 'user.address.suburb' ]

  describe 'unset', ->
    it 'returns true if the field exists and was removed', ->
      inject (ObjectHelper) ->
        object = {}
        ObjectHelper.set object, 'a.b.c', true
        expect(ObjectHelper.unset object, 'a.b.c.d').toBe false
        expect(ObjectHelper.unset object, 'a.b.c').toBe true
        expect(object.a.b.c).toBeUndefined()

  describe 'default', ->
    it 'defaults values', ->
      inject (ObjectHelper) ->
        overrides = a: b: c: 'x'
        defaults = a: b: d: 'z'
        expect(ObjectHelper.default overrides, defaults).toEqual a: b: c: 'x', d: 'z'

    it 'overrides arrays', ->
      inject (ObjectHelper) ->
        overrides = a: b: ['c', 'd', 'e']
        defaults = a: b: ['x']
        expect(ObjectHelper.default overrides, defaults).toEqual a: b: ['c', 'd', 'e']

    it 'allows multiple default sets', ->
      inject (ObjectHelper) ->
        overrides = a: b: c: 'x'
        defaults1 = a: b: d: 'z'
        defaults2 = a: b: c: 'w', e: 'y'
        expect(ObjectHelper.default overrides, defaults1, defaults2).toEqual a: b: c: 'x', d: 'z', e: 'y'
