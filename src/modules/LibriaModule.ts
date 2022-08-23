import CoreBotModule from "../core/CoreBotModule";
import { VkBotContext } from "node-vk-bot-api";
import { Modules, Constants, Types } from "@maxqwars/metaform";
import millify from "millify";
import fetch from "cross-fetch";

global.fetch = fetch;

type LibriaModuleOptions = {
  baseUrl: string;
  timeout: number;
};

export default class LibriaModule extends CoreBotModule {
  private database: Modules.MetaDatabase;
  private search: Modules.Search;

  constructor(options: LibriaModuleOptions) {
    super();

    const metaModuleOptions: Types.MetaModuleOptions = {
      ...options,
      version: Constants.API_VERSION.V2,
      useHttps: true,
    };

    // Init metaform modules
    this.database = new Modules.MetaDatabase(metaModuleOptions);
    this.search = new Modules.Search(metaModuleOptions);

    this.init();
  }

  init() {
    this.textMatch.addCommand(/тека обновления/, this.getUpdates.bind(this));
    this.textMatch.addCommand(
      /(тека|teka)\s(поиск|search)\s(.+)/m,
      this.searchRelease.bind(this)
    );

    this.textMatch.addCommand(
      /(тека|teka)\s(подробнее|details)\s(\d+)$/,
      this.getReleaseDetails.bind(this)
    );
  }

  async getReleaseDetails(context: VkBotContext) {
    const {
      message: { text },
    } = context;
    const groups = text?.match(/(тека|teka)\s(подробнее|details)\s(\d+)$/);

    if (groups) {
      const id = Number(groups["3"]) || 0;

      const { content } = await this.database.getTitle({ id });

      context.reply(
        content?.names?.ru +
          "\n ➡ \n" +
          "В закладка у " +
          millify(content?.inFavorites as number) +
          "\n ➡ \n" +
          content?.description +
          "\n ➡ \n"
      );
    }
  }

  async searchRelease(context: VkBotContext) {
    const {
      message: { text },
    } = context;

    const groups = text?.match(
      /(тека|teka)\s(поиск|search)\s(.+)/m
    ) as string[];

    const search = groups[3];
    const results = await this.search.searchTitles({
      search,
      filter: ["names", "id"],
    });

    const { content } = results;

    if (content?.length === 0) {
      context.reply(`По запросу "${search}", ничего не найдено 🤦‍♂️`);
    } else {
      const info =
        content?.map((release) => `🔎 ${release.names?.ru} | ${release.id}`) ||
        [];
      context.reply(info.join("\n"));
    }
  }

  private async getUpdates(context: VkBotContext) {
    const updates = await this.database.getUpdates({ filter: ["names", "id"] });
    const { content } = updates;
    if (content) {
      const formattedBuffer = content.map((release) => {
        return `🎟 ${release.names?.ru || ""} | #${release.id}`;
      });
      context.reply(formattedBuffer.join("\n"));
    }

    // console.log('TRIGGERRRED')
  }
}
