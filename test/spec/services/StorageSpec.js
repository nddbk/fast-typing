/*
 * StorageSpec.js
 * @ndaidong
 */

/* eslint func-names: 0 */

describe('Storage', function() {
  var StorageFake;

  beforeEach(function() {
    StorageFake = Box.Application.getServiceForTest('storage');
  });

  it('StorageFake service must be defined', function() {
    expect(StorageFake).toBeDefined();
    expect(StorageFake.set).toBeDefined();
    expect(StorageFake.get).toBeDefined();
    expect(StorageFake.remove).toBeDefined();
    expect(StorageFake.me).toBeDefined();
  });

});
