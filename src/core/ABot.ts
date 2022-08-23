import { VkBotContext } from "node-vk-bot-api";
import CoreBotModule from "./CoreBotModule";

export default class AlephBot {
  private modules: CoreBotModule[] = [];

  attachModule(module: CoreBotModule) {
    this.modules.push(module);
    return this;
  }

  async onNewMessage(context: VkBotContext): Promise<void> {
    let currentHandler = null;

    const {
      message: { text },
    } = context;

    const modulesCount = this.modules.length;

    for (let i = 0; i < modulesCount; i += 1) {
      const module = this.modules[i];
      const messageHandler = module.getHandler(text || "");

      if (messageHandler !== null) {
        currentHandler = messageHandler;
        break;
      }
    }

    if (currentHandler !== null) {
      await currentHandler(context);
    }
  }
}
