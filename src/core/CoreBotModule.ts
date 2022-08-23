import TextMatch from "./TextMatch";

export default abstract class CoreBotModule {
  protected textMatch = new TextMatch();

  abstract init(): void;

  getHandler(text: string) {
    return this.textMatch.match(text);
  }
}
