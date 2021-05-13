import TWEEN from "@tweenjs/tween.js";
import Map from "../Map.js";
import { game } from "../game.js";
import {
    h,
    reactive,
    defineComponent,
    onMounted,
    onUnmounted,
  } from "../init/index.js";
import Plane, { PlaneInfo } from "../plane.js";
import { stage } from "../config.js";
import { keyboardMove } from "../control";
// 生成我方战机function
const createSelfPlane = ({ x, y, speed }) => {
    const selfPlane = reactive({
      x,
      y,
      speed,
      width: PlaneInfo.width,
      height: PlaneInfo.height,
    });
    // 绑定上下左右移动
    const { x: selfPlaneX, y: selfPlaneY } = keyboardMove({
        x: selfPlane.x,
        y: selfPlane.y,
        speed: selfPlane.speed,
    });
    // 缓动出场
    var tween = new TWEEN.Tween({
      x,
      y,
    })
      .to({ y: y - 250 }, 500)
      .start();
    tween.onUpdate((obj) => {
      console.log('obj', obj);
      selfPlane.x = obj.x;
      selfPlane.y = obj.y;
    });
  
    const handleTicker = () => {
      TWEEN.update();
    };
  
    onUnmounted(() => {
      game.ticker.remove(handleTicker);
    });
  
    onMounted(() => {
      game.ticker.add(handleTicker);
    });
    selfPlane.x = selfPlaneX;
    selfPlane.y = selfPlaneY;
    return selfPlane;
};
export default defineComponent({
    props: ["onNextPage"],
    setup(props) {
      const selfPlane = createSelfPlane({
        x: stage.width / 2 - 60,
        y: stage.height,
        speed: 7,
      });
      console.log('selfPlane', selfPlane)
      return {
        selfPlane
      };
    },
    render(ctx) {
        const createSelfPlane = () => {
            return h(Plane, {
              x: ctx.selfPlane.x,
              y: ctx.selfPlane.y,
              speed: ctx.selfPlane.speed
            });
        };
        return h("Container", [
            h(Map),
            createSelfPlane()
        ]);
    }
});
  