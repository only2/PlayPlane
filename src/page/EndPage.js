import { h, defineComponent } from "../init/index";
import endPageAsset from "../assets/imgs/end_page.jpg";
import restartBtn from "../assets/imgs/restartBtn.png";

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
        texture: endPageAsset,
        key: "1",
      }),
      h("Sprite", {
        x: 230,
        y: 515,
        texture: restartBtn,
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
