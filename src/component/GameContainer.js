import { h, ref, computed } from "../init/index.js";
import StartPage from "../page/StartPage";
import GamePage from "../page/GamePage";
import EndPage from "../page/EndPage";
export const PAGE = {
  start: "startPage",
  game: "gamePage",
  end: "endPage",
};
const pageMap = {
  [PAGE.start]: StartPage,
  [PAGE.game]: GamePage,
  [PAGE.end]: EndPage
};

export default {
  setup() {
    const currentPageName = ref(PAGE.start);
    const currentPage = computed(() => {
      return pageMap[currentPageName.value];
    });
    const handleNextPage = (nextPage) => {
      currentPageName.value = nextPage;
    };

    return {
      currentPage,
      handleNextPage,
    };
  },

  render(ctx) {
    console.log('ctx.currentPage', ctx.currentPage)
    return h("Container", [
      h(ctx.currentPage, {
        onNextPage: ctx.handleNextPage,
      }),
    ]);
  },
};
