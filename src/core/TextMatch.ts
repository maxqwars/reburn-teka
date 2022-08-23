import type { VkBotContext } from "node-vk-bot-api";

type CommandHandler = {
  (context: VkBotContext): Promise<void>;
};

type Command = {
  regexp: RegExp;
  handler: CommandHandler;
};

export default class TextMatch {
  private commands: Command[] = [];

  addCommand(regexp: RegExp, handler: CommandHandler) {
    this.commands.push({
      regexp,
      handler,
    });
  }

  match(text: string): CommandHandler | null {
    const commandsCount = this.commands.length;

    for (let i = 0; i < commandsCount; i += 1) {
      const command = this.commands[i];
      const regexp = new RegExp(command.regexp);

      const matched = regexp.test(text);
      if (matched) return command.handler;
    }

    return null;
  }
}
