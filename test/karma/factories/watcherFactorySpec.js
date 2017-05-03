describe('WatcherFactory', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  describe('shouldNotify', function() {
    it('returns true if the data being watched has changed', inject(function (WatcherFactory) {
      const handler = function () {};
      const watchPath = 'a';
      const watcher = WatcherFactory.create(watchPath, handler);

      expect(watcher.shouldNotify('a', 'b')).toBe(true);
    }));
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
