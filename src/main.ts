import { Game } from "./engine/game";
import { Room1 } from "./scenes/room01";

const jogo = new Game()

await jogo.init(document.body) // Window Size
let room = new Room1()
room.gravity = 0.003 // padrao 0.001

jogo.setScene(room)


