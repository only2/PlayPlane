import { h, defineComponent } from "../init/index";

import startPageAsset from "../assets/imgs/start_page.jpg";
import startBtn from "../assets/imgs/startBtn.png";

export default defineComponent({
  props: ["onNextPage"],
  setup(props, ctx) {
    const handleGoToGame = () => {
      props.onNextPage('gamePage');
    };

    return {
      handleGoToGame,
    };
  },
  render(ctx) {
    return h("Container", [
      h("Sprite", {
        texture: startPageAsset,
        key: "1",
      }),
      h("Text", {x: 100, y:100,}, '已经消灭多少个了'),
      h("Sprite", {
        x: 230,
        y: 515,
        texture: startBtn,
        key: "2",
        on: {
          pointertap: ctx.handleGoToGame,
        },
        interactive: true,
        buttonMode: true,
      }),
    ]);
  },
});
