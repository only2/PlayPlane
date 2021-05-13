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
import Bullet, { SelfBulletInfo } from "../bullet.js";
import { moveSelfBullets } from "../moveSelfBullets";
import { stage } from "../config.js";
import { keyboardMove } from "../control";
import { moveEnemyPlane } from "../moveEnemyPlane";
import { hitTestRectangle } from "../utils/hitTestRectangle";
let hashCode = 0;
const createHashCode = () => {
	return hashCode++;
};

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
    let tween = new TWEEN.Tween({
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
// 我方子弹
const createSelfBullet = () => {
	// 子弹的数据
	const selfBullets = reactive([]);
	// 创建子弹
	const addSelfBullet = (x, y) => {
		const id = createHashCode();
		const width = SelfBulletInfo.width;
		const height = SelfBulletInfo.height;
		const rotation = SelfBulletInfo.rotation;
		const dir = SelfBulletInfo.dir;
		selfBullets.push({ x, y, id, width, height, rotation, dir });
	};
	// 销毁子弹
	const destroySelfBullet = (id) => {
		const index = selfBullets.findIndex((info) => info.id == id);
		if (index !== -1) {
			selfBullets.splice(index, 1);
		}
	};
	return {
		selfBullets,
		addSelfBullet,
		destroySelfBullet,
	};
};
// 战斗相关逻辑
const startFighting = ({selfPlane, enemyPlanes, selfBullets, gameOverCallback}) => {
    const handleTicker = () => {
		moveSelfBullets(selfBullets);
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
		// 检测敌方飞机是否与我方飞机发生碰撞
        enemyPlanes.forEach((enemyPlane) => {
            hitSelfHandle(enemyPlane);
		});
		// 先遍历自己所有的子弹
		selfBullets.forEach((bullet, selfIndex) => {
			// 检测我方子弹是否碰到了敌机
			enemyPlanes.forEach((enemyPlane, enemyPlaneIndex) => {
			  	const isIntersect = hitTestRectangle(bullet, enemyPlane);
			  	if (isIntersect) {
					selfBullets.splice(selfIndex, 1);
					// 敌机需要减血
					enemyPlane.life--;
					if (enemyPlane.life <= 0) {
						enemyPlanes.splice(enemyPlaneIndex, 1);
					}
			  	}
			});
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
		const {
			selfBullets,
			addSelfBullet,
			destroySelfBullet,
		} = createSelfBullet();
      	startFighting({
			selfPlane,
			enemyPlanes,
			selfBullets,
			gameOverCallback() {
				props.onNextPage('endPage');
			}
		});
      	return {
			selfBullets,
			addSelfBullet,
			destroySelfBullet,
			destroySelfBullet,
        	selfPlane,
        	enemyPlanes
      	};
    },
    render(ctx) {
		const createBullet = (info, index) => {
			return h(Bullet, {
			  key: "Bullet" + info.id,
			  x: info.x,
			  y: info.y,
			  id: info.id,
			  width: info.width,
			  height: info.height,
			  rotation: info.rotation,
			  dir: info.dir,
			  onDestroy({ id }) {
				ctx.destroySelfBullet(id);
			  },
			});
		};
        const createSelfPlaneCom = () => {
            return h(Plane, {
                x: ctx.selfPlane.x,
                y: ctx.selfPlane.y,
				speed: ctx.selfPlane.speed,
				onAttack({ x, y }) {
					ctx.addSelfBullet(x, y);
				},
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
			...ctx.selfBullets.map(createBullet),
        ]);
    }
});
  