import { h, ref, computed } from "../init/index.js";
import StartPage from "../page/StartPage";

export const PAGE = {
  start: "startPage",
  game: "gamePage",
  end: "endPage",
};
const pageMap = {
  [PAGE.start]: StartPage,
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
    return h("Container", [
      h(ctx.currentPage, {
        onNextPage: ctx.handleNextPage,
      }),
    ]);
  },
};
