// 创建canvas实例
import * as PIXI from "PIXI.js";

import { stage } from "./config.js";
export const game = initPixi();

function initPixi() {
  let app = new PIXI.Application({
    width: stage.width,
    height: stage.height,
  });
  app.renderer.backgroundColor = 0x061639;
  document.body.appendChild(app.view);
  document.body.style.background = "#343434" 
  return app;
}
