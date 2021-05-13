import enemyImagePath from "./assets/imgs/enemy.png";
import {
  h,
  defineComponent,
  ref,
  watch
} from "./init/index";

export const EnemyPlaneInfo = {
  width: 308,
  height: 207,
  life: 3,
};
// 敌方飞机
export default defineComponent({
  props: ["x", "y"],
  setup(props, ctx) {
    const x = ref(props.x);
    const y = ref(props.y);

    watch(props, (newValue) => {
      x.value = newValue.x;
      y.value = newValue.y;
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
      texture: enemyImagePath,
    });
  },
});
