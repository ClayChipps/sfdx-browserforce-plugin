import assert from 'assert';
import { OmniChannelSettings } from './index.js';

describe(OmniChannelSettings.name, function () {
  this.timeout('10m');
  let plugin: OmniChannelSettings;
  before(() => {
    plugin = new OmniChannelSettings(global.bf);
  });

  const configEnableEnhancedOmniChannelRouting = {
    enhancedOmniChannelRouting: {
      agreeToTermsAndConditions: true,
      enableEnhancedOmniChannelRouting: true,
    },
  };
  const configDisableEnhancedOmniChannelRouting = {
    enhancedOmniChannelRouting: {
      agreeToTermsAndConditions: false,
      enableEnhancedOmniChannelRouting: false,
    },
  };

  const configEnableStatusBasedCapacityModel = {
    enableStatusBasedCapacityModel: true,
  };
  const configDisableStatusBasedCapacityModel = {
    enableStatusBasedCapacityModel: false,
  };

  it('should enable status based capacity model', async () => {
    await plugin.run(configEnableStatusBasedCapacityModel);
    const res = await plugin.retrieve();
    assert.deepStrictEqual(res, configEnableStatusBasedCapacityModel);
  });

  it('should disable status based capacity model', async () => {
    await plugin.run(configDisableStatusBasedCapacityModel);
    const res = await plugin.retrieve();
    assert.deepStrictEqual(res, configDisableStatusBasedCapacityModel);
  });

  it('should enable enhanced omni channel routing', async () => {
    await plugin.run(configEnableEnhancedOmniChannelRouting);
    const res = await plugin.retrieve();
    assert.deepStrictEqual(res, configEnableEnhancedOmniChannelRouting);
  });

  it('should disable enhanced omni channel routing', async () => {
    await plugin.run(configDisableEnhancedOmniChannelRouting);
    const res = await plugin.retrieve();
    assert.deepStrictEqual(res, configDisableEnhancedOmniChannelRouting);
  });
});
