/*
 * WordlistSpec.js
 * @ndaidong
 */

/* eslint func-names: 0 */

describe('Wordlist', function() {
  var WordlistFake;

  beforeEach(function() {
    WordlistFake = Box.Application.getServiceForTest('wordlist');
  });

  it('WordlistFake service must be defined', function() {
    expect(WordlistFake).toBeDefined();
  });

});
