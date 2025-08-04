import { BrowserforcePlugin } from '../../plugin.js';

const BASE_PATH = 'omnichannel/settings.apexp';

const AGREE_TO_TERMS_SELECTOR = 'input[id$=":scrt2Form:toggleAcceptAgreement"]';
const ACCEPT_BUTTON_SELECTOR = 'input[id$=":scrt2Form:acceptButton"]';
const CONTINUE_BUTTON_SELECTOR = 'input[id*="scrt2Form"][value="Continue"]';
const ENHANCED_OMNI_CHANNEL_ROUTING_SELECTOR =
  'input[id="toggleScrt2RoutingConnect"]';
const SAVE_BUTTON_SELECTOR = 'input[id$=":save"]';
const STATUS_CAPACITY_TOGGLE_SELECTOR =
  'input[id$=":toggleOmniStatusCapModelPref"]';

type Config = {
  enableEnhancedOmniChannelRouting?: boolean;
  enableStatusBasedCapacityModel?: boolean;
};

export class OmniChannelSettings extends BrowserforcePlugin {
  public async retrieve(definition?: Config): Promise<Config> {
    const response: Config = {};

    if (!definition) {
      return response;
    }

    // Open the omni-channel setup page
    const page = await this.browserforce.openPage(BASE_PATH);

    if ('enableEnhancedOmniChannelRouting' in definition) {
      // Retrieve the enhanced omnichannel routing setting
      await page.waitForSelector(ENHANCED_OMNI_CHANNEL_ROUTING_SELECTOR);
      const enableEnhancedOmniChannelRouting = await page.$eval(
        ENHANCED_OMNI_CHANNEL_ROUTING_SELECTOR,
        (el) => (el.getAttribute('checked') === 'checked' ? true : false)
      );

      response.enableEnhancedOmniChannelRouting =
        enableEnhancedOmniChannelRouting;
    }

    if ('enableStatusBasedCapacityModel' in definition) {
      // Retrieve the service channel config
      await page.waitForSelector(STATUS_CAPACITY_TOGGLE_SELECTOR);
      const enableStatusBasedCapacityModel = await page.$eval(
        STATUS_CAPACITY_TOGGLE_SELECTOR,
        (el) => (el.getAttribute('checked') === 'checked' ? true : false)
      );

      response.enableStatusBasedCapacityModel = enableStatusBasedCapacityModel;
    }

    return response;
  }

  public async apply(config: Config): Promise<void> {
    // Open the omni-channel setup page
    const page = await this.browserforce.openPage(BASE_PATH);

    if ('enableEnhancedOmniChannelRouting' in config) {
      // Click the checkbox
      await page.$eval(
        ENHANCED_OMNI_CHANNEL_ROUTING_SELECTOR,
        (e: HTMLInputElement, v: boolean) => {
          e.checked = v;
        },
        config.enableEnhancedOmniChannelRouting
      );

      // Click the continue button
      const continueButton = await page.waitForSelector(
        CONTINUE_BUTTON_SELECTOR
      );
      await continueButton.click();

      // See if the user needs to agree to the terms and conditions
      try {
        const agreeToTerms = await page.waitForSelector(
          AGREE_TO_TERMS_SELECTOR,
          {
            timeout: 5000,
          }
        );

        const acceptButton = await page.waitForSelector(
          ACCEPT_BUTTON_SELECTOR,
          {
            timeout: 5000,
          }
        );

        await agreeToTerms.click();
        await acceptButton.click();
      } catch (error) {
        // If the terms and conditions are not present, we can skip this step
      }

      // Wait for the page to refresh
      await page.waitForNavigation();
    }

    if ('enableStatusBasedCapacityModel' in config) {
      // Click the checkbox
      const capacityModel = await page.waitForSelector(
        STATUS_CAPACITY_TOGGLE_SELECTOR
      );
      await capacityModel.click();

      // Save the settings
      const saveButton = await page.waitForSelector(SAVE_BUTTON_SELECTOR);
      await saveButton.click();

      // Wait for the page to refresh
      await page.waitForNavigation();
    }

    // Close the page
    await page.close();
  }
}
