import { initRuntimeCanvas } from "./init";
import gameComponent from "./component/GameContainer";
import { game } from "./game";
const { renderer } = initRuntimeCanvas();

console.log(renderer)
const root = renderer.createApp(gameComponent);
console.log('game', game)
root.mount(game.stage);