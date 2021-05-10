import * as PIXI from "PIXI.js";
export const nodeOps = {
  insert: (child, parent, anchor) => {
    console.log('insert')
    parent.addChild(child);
  },

  remove: (child) => {
    console.log('remove')
    const parent = child.parent;
    if (parent) {
      parent.removeChild(child);
    }
  },

  createElement: (tag, isSVG, is) => {
    console.log('createElement')
    let element;
    if (tag === "Rectangle") {
      // 创建一个矩形
      element = new PIXI.Graphics();
      element.lineStyle(4, 0xff3300, 1);
      element.beginFill(0x66ccff);
      element.drawRect(0, 0, 64, 64);
      element.endFill();
      element.x = 0;
      element.y = 0;
      // Opt-in to interactivity
      element.interactive = true;
      // Shows hand cursor
      element.buttonMode = true;
    } else if (tag === "Sprite") {
      element = new PIXI.Sprite();
      element.x = 0;
      element.y = 0;
    } else if (tag === "Container") {
      element = new PIXI.Container();
      element.x = 0;
      element.y = 0;
    }else if(tag === "Text"){
      element = new PIXI.Text()
      element.x = 0;
      element.y = 0;
    }
    console.log('element', element)
    return element;
  },

  createText: (text) => document.createTextNode(text),

  createComment: (text) => {},

  setText: (node, text) => {
    console.log('setText')
    node.nodeValue = text;
  },

  setElementText: (el, text) => {
    el.textContent = text;
  },

  parentNode: (node) => node.parentNode,

  nextSibling: (node) => node.nextSibling,

  querySelector: (selector) => document.querySelector(selector),

  setScopeId(el, id) {
    el.setAttribute(id, "");
  },

  cloneNode(el) {
    return el.cloneNode(true);
  },
};
