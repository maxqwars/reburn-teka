import VkBot, { VkBotContext } from "node-vk-bot-api";
import dotenv from "dotenv";
import AlephBot from "./core/ABot";
import LibriaModule from "./modules/LibriaModule";
import FuckYouModule from "./modules/FuckYouModule";

dotenv.config();
const token = process.env.TOKEN || "";

if (!token) {
  console.error('Create .env file and set "TOKEN" key before run');
  process.exit();
}

const vkBot = new VkBot({ token });
const aleph = new AlephBot();

aleph.attachModule(
  new LibriaModule({ baseUrl: "api.anilibria.tv", timeout: 6000 })
);

aleph.attachModule(new FuckYouModule());

vkBot.event("message_new", async (context: VkBotContext) => {
  const {
    date,
    // from_id,
    // id,
    // attachments,
    // conversation_message_id,
    // fwd_messages,
    // important,
    // peer_id,
    // random_id,
    text,
  } = context.message;

  const d = new Date(date * 1000).toLocaleString("ru").split(" ");

  console.log(`📧 ${d[1]} ${text}`);

  await aleph.onNewMessage(context);
});

vkBot.startPolling((err) => {
  if (err) {
    console.error(err);
    process.exit();
  }
  console.clear();
  console.log("Bot running...");
  return {};
});
