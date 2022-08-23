import { VkBotContext } from "node-vk-bot-api";
import CoreBotModule from "../core/CoreBotModule";

export default class FuckYouModule extends CoreBotModule {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.textMatch.addCommand(
      /.+(тека|теки)\s(сдохла|больше\sнет)$/gm,
      async (context: VkBotContext) => {
        // console.log("TRIGGERED");
        if (context.message.from_id < 0) {
          context.reply("Пошел нахуй бот тупорылый, я жива");
        } else {
          context.reply("Пошел нахуй, я жива");
        }
      }
    );

    this.textMatch.addCommand(
      /(Я|я)кира лох/gm,
      async (context: VkBotContext) => {
        context.reply("Согласна");
      }
    );
  }
}
