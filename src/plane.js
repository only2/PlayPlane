import { game } from "./game.js";
import {
    h,
    defineComponent,
    watch,
    ref,
    onMounted,
    onUnmounted,
  } from "./init/index.js";
  import planeImagePath from './assets/imgs/plane.png'
export const PlaneInfo = {
    width:258,
    height:364
}
// 我方飞机模型
export default defineComponent({
    props: ["x", "y", "speed"],
    setup(props, ctx) {
      const x = ref(props.x);
      const y = ref(props.y);
      watch(props, (newProps) => {
        x.value = newProps.x;
        y.value = newProps.y;
      });
      return {
        x,
        y,
      };
    },
    render(ctx) {
      return h("Sprite", {
        x: ctx.x,
        y: ctx.y,
        texture: planeImagePath,
      });
    },
});