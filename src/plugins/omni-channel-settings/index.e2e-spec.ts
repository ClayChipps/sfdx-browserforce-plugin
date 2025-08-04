import assert from 'assert';
import { OmniChannelSettings } from './index.js';

describe(OmniChannelSettings.name, function () {
  this.timeout('10m');
  let plugin: OmniChannelSettings;
  before(() => {
    plugin = new OmniChannelSettings(global.bf);
  });

  const configEnableEnhancedOmniChannelRouting = {
    enableEnhancedOmniChannelRouting: true,
  };

  it('should enable enhanced omni channel routing', async () => {
    await plugin.run(configEnableEnhancedOmniChannelRouting);
    const res = await plugin.retrieve(configEnableEnhancedOmniChannelRouting);
    assert.deepStrictEqual(res, configEnableEnhancedOmniChannelRouting);
  });
});
