describe('ObjectHelper', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  it('gets out what is put in', function() {
    const a = {};
    inject(function(ObjectHelper) {
      const object = {};
      ObjectHelper.set(object, 'key', a);
      expect(ObjectHelper.get(object, 'key')).toBe(a);
    });
  });

  it('allows dot notation to access nested values', function() {
    const b1 = { c: 22 };
    const b2 = {};

    inject(function(ObjectHelper) {
      const object = {};
      ObjectHelper.set(object, 'a.b.b1', b1);
      ObjectHelper.set(object, 'a.b.b2', b2);

      expect(ObjectHelper.get(object, 'a.b')).toEqual(jasmine.objectContaining({b1, b2}));
      expect(ObjectHelper.get(object, 'a.b.b1.c')).toEqual(b1.c);
    });
  });

  describe('notIn', function() {
    it('recursively compares two objects, returning an array of dot notation strings representing the paths in a not in b', function () {
      const a = {user: {id: 1234, address: {suburb: 'Royston'}}};
      const b = {user: {address: {}}};

      inject(ObjectHelper => expect(ObjectHelper.notIn(a, b)).toEqual(['user.id', 'user.address.suburb']));
    });
  });

  describe('unset', function() {
    it('returns true if the field exists and was removed', function () {
      inject(function (ObjectHelper) {
        const object = {};
        ObjectHelper.set(object, 'a.b.c', true);
        expect(ObjectHelper.unset(object, 'a.b.c.d')).toBe(false);
        expect(ObjectHelper.unset(object, 'a.b.c')).toBe(true);
        expect(object.a.b.c).toBeUndefined();
      });
    });
  });

  describe('default', function() {
    it('defaults values', function() {
      inject(function(ObjectHelper) {
        const overrides = {a: {b: {c: 'x'}}};
        const defaults = {a: {b: {d: 'z'}}};
        expect(ObjectHelper.default(overrides, defaults)).toEqual({a: {b: {c: 'x', d: 'z'}}});
      });
    });

    it('overrides arrays', function() {
      inject(function (ObjectHelper) {
        const overrides = {a: {b: ['c', 'd', 'e']}};
        const defaults = {a: {b: ['x']}};
        expect(ObjectHelper.default(overrides, defaults)).toEqual({a: {b: ['c', 'd', 'e']}});
      });
    });

    it('allows multiple default sets', function() {
      inject(function (ObjectHelper) {
        const overrides = {a: {b: {c: 'x'}}};
        const defaults1 = {a: {b: {d: 'z'}}};
        const defaults2 = {a: {b: {c: 'w', e: 'y'}}};
        expect(ObjectHelper.default(overrides, defaults1, defaults2)).toEqual({a: {b: {c: 'x', d: 'z', e: 'y'}}});
      });
    });
  });
});
