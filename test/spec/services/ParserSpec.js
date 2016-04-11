/*
 * ParserSpec.js
 * @ndaidong
 */

/* eslint func-names: 0 */

describe('Parser', function() {
  var ParserFake;

  beforeEach(function() {
    ParserFake = Box.Application.getServiceForTest('parser');
  });

  it('ParserFake service must be defined', function() {
    expect(ParserFake).toBeDefined();
    expect(ParserFake.parse).toBeDefined();
  });

});
