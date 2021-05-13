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
import EnemyPlane, { EnemyPlaneInfo } from "../enemyPlane.js";
import { stage } from "../config.js";
import { keyboardMove } from "../control";
import { moveEnemyPlane } from "../moveEnemyPlane";
import { hitTestRectangle } from "../utils/hitTestRectangle";
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
// 生成敌方战机生成我方战机function
const createEnemyPlanes = () => {
    //生产敌机
    const createEnemyPlaneData = (x) => {
		return {
			x,
			y: -100,
			width: EnemyPlaneInfo.width,
			height: EnemyPlaneInfo.height,
			life: EnemyPlaneInfo.life,
		};
    };
  
    const enemyPlanes = reactive([]);
  
    setInterval(() => {
    	const x = Math.floor((1 + stage.width) * Math.random());
    	enemyPlanes.push(createEnemyPlaneData(x));
    }, 600);
    return enemyPlanes;
};
// 战斗相关逻辑
const startFighting = ({selfPlane, enemyPlanes, gameOverCallback}) => {
    const handleTicker = () => {
        moveEnemyPlane(enemyPlanes);
        // 遍历敌军
		// 我方和敌军碰撞也会结束游戏
		const hitSelfHandle = (enemyObject) => {
            const isIntersect = hitTestRectangle(selfPlane, enemyObject);
            if (isIntersect) {
                // 碰到我方飞机
                // 直接 game over
                // 跳转到结束页面
                gameOverCallback && gameOverCallback();
            }
        };
        enemyPlanes.forEach((enemyPlane) => {
            hitSelfHandle(enemyPlane);
        });
        
      };
    
    onUnmounted(() => {
        game.ticker.remove(handleTicker);
    });
    
    onMounted(() => {
        game.ticker.add(handleTicker);
    });
}
export default defineComponent({
    props: ["onNextPage"],
    setup(props) {
    	const selfPlane = createSelfPlane({
        	x: stage.width / 2 - 60,
        	y: stage.height,
        	speed: 7,
      	});
      	const enemyPlanes = createEnemyPlanes();
      	console.log('enemyPlanes', enemyPlanes)
      	startFighting({
			selfPlane, 
			enemyPlanes, 
			gameOverCallback() {
				props.onNextPage('endPage');
			}
		});
      	return {
        	selfPlane,
        	enemyPlanes
      	};
    },
    render(ctx) {
        const createSelfPlaneCom = () => {
            return h(Plane, {
                x: ctx.selfPlane.x,
                y: ctx.selfPlane.y,
                speed: ctx.selfPlane.speed
            });
        };
        const createEnemyPlaneCom = (info, index) => {
            return h(EnemyPlane, {
                key: "EnemyPlane" + index,
                x: info.x,
                y: info.y,
                height: info.height,
                width: info.width
            });
        };
        return h("Container", [
            h(Map),
            createSelfPlaneCom(),
            ...ctx.enemyPlanes.map(createEnemyPlaneCom),
        ]);
    }
});
  