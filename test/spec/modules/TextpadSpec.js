/*
 * TextpadSpec.js
 * @ndaidong
 */

/* eslint func-names: 0 */
/* global sinon */

describe('Textpad', function() {
  var TextpadFake;

  beforeEach(function() {
    var wordlist = Box.Application.getServiceForTest('wordlist');
    var contextFake = new Box.TestServiceProvider({
      wordlist: wordlist
    });
    TextpadFake = Box.Application.getModuleForTest('textpad', contextFake);
    TextpadFake.init();
    sinon.sandbox.create();
  });

  it('TextpadFake module must be defined', function() {
    expect(TextpadFake).toBeDefined();
    expect(TextpadFake.init).toBeDefined();
    expect(TextpadFake.load).toBeDefined();
  });

});
