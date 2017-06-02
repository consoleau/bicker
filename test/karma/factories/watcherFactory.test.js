describe('WatcherFactory', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  describe('shouldNotify', function() {

    // NB Each entry in the array is a test, each test can be a
    // A: object, containing watchPath, initialValue, changedPath, newValue, shouldNotify
    // B: string, which is interpreted by the DSL and extracts the same keys:
    // '<watchPath>:<initialValue> -> <changedPath>:<newValue> : shouldNotify=<boolean>'
    const tests = [
      'a:undefined -> a:1 : shouldNotify=true',
      'a:undefined -> b:1 : shouldNotify=false',
      'a:undefined -> a:undefined : shouldNotify=false',
      'a:1 -> a:undefined : shouldNotify=true',
      'a:1 -> a:2 : shouldNotify=true',
      'a:1 -> a:1 : shouldNotify=false',
      'a:1 -> b:2 : shouldNotify=false',
      'a.b:1 -> a.b:2 : shouldNotify=true',
      'a.b:1 -> a.b:1 : shouldNotify=false',
      'a:{"b":1} -> a.b:1 : shouldNotify=false',
      'a:{"b":1} -> a.b:2 : shouldNotify=true',
      'a:{"b":{"c":2}} -> a.b.c:2 : shouldNotify=false',
      'a:{"b":{"c":1}} -> a.b.c:2 : shouldNotify=true',
      'a:2 -> a.b.c:2 : shouldNotify=true',
      'a:1 -> a.b.c:2 : shouldNotify=true',
      'a.b.c:1 -> a:{"b":{"c":1}} : shouldNotify=false',
      'a.b.c:1 -> a:{"b":{"c":2}} : shouldNotify=true',
      'a.b.c:1 -> a:2 : shouldNotify=true',
      'a:1 -> ab:2 : shouldNotify=false',
      'a.b.c:1 -> a.b.cx:2 : shouldNotify=false'
    ];

    _(tests).map(normalizeTestDefinition).each(({
      initialValue=undefined, watchPath, changedPath, newValue, shouldNotify, testName='name your test'
    }) => {
      it(testName, inject(function (WatcherFactory) {
        const handler = jasmine.createSpy();
        const watcher = WatcherFactory.create(watchPath, handler, initialValue);
        expect(watcher.shouldNotify(changedPath, newValue)).toBe(shouldNotify);
      }));
    });

    function normalizeTestDefinition(testDefinition) {
      if (_.isString(testDefinition)) {
        return interpretTestDsl(testDefinition);
      } else {
        return testDefinition;
      }
    }

    function interpretTestDsl(inputString) {
      // NB grammar : <watchPath>:<initialValue> -> <changedPath>:<newValue> : shouldNotify:<boolean>
      const dslRegexp = new RegExp(/^([^:]+):(.+) -> ([^:]+):(.+) : shouldNotify=(true|false)$/);
      const indexes = {
        watchPath: 1,
        initialValue: 2,
        changedPath: 3,
        newValue: 4,
        shouldNotify: 5
      };

      const match = inputString.match(dslRegexp);

      if (match) {
        const extractedValues = {
          watchPath: match[indexes.watchPath],
          initialValue: (match[indexes.initialValue] === 'undefined') ? undefined : JSON.parse(match[indexes.initialValue]),
          changedPath: match[indexes.changedPath],
          newValue: (match[indexes.newValue] === 'undefined') ? undefined : JSON.parse(match[indexes.newValue]),
          shouldNotify: (match[indexes.shouldNotify] === 'true'),
          testName: inputString
        };

        return extractedValues;
      } else {
        throw new Error(`Test Setup Error: could not parse test string "${inputString}"`);
      }
    };

  });

  describe('notify', function() {
    it('notifies the handler of changes to data', inject(function (WatcherFactory) {
      const handler = jasmine.createSpy();
      const watcher = WatcherFactory.create('a.b', handler);

      watcher.notify('a.b', 'x');
      expect(handler).toHaveBeenCalledWith('a.b', 'x', undefined);

      watcher.notify('a.b', 'n');
      expect(handler).toHaveBeenCalledWith('a.b', 'n', 'x');
    }));
  });
});
