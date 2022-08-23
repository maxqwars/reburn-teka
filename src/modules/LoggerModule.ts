import { VkBotContext } from 'node-vk-bot-api';
import CoreBotModule from '../core/CoreBotModule';

export default class LoggerModule extends CoreBotModule {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.textMatch.addCommand(/(\w+)/gm, this.printInConsole);
  }

  // eslint-disable-next-line class-methods-use-this
  private async printInConsole(context: VkBotContext) {
    console.log(context.message.text);
  }
}
