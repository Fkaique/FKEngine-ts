import { Game } from "./engine/game";
import { Room1 } from "./scenes/room01";

async function main() {
  const jogo = new Game();

  await jogo.init(document.body); // Window Size

  jogo.setScene(new Room1());
}
main();
