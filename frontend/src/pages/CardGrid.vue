<template>
  <draggable
    class="row"
    v-bind="dragOptions"
    :model-value="props.bookmarks"
    @end="handleDragEnd"
    item-key="id"
    style="width: 100%"
  >
    <template #item="{ element }">
      <div :class="classCardColumns">
        <CardPrimary
          :id="element.id"
          :key="element.id"
          :bookmark="element"
          :card-size="Math.min(cardSize, 3)"
        />
      </div>
    </template>
  </draggable>
</template>

<script>
import CardPrimary from "src/components/CardPrimary.vue";
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { draggable } from "boot/vuedraggable";
import { supabase } from "boot/supabase";

export default defineComponent({
  name: "CardGrid",
  components: { CardPrimary, draggable },
  props: ["title", "bookmarks"],

  setup(props) {
    const store = useStore();
    const cardSize = computed(() => store.getters["settings/cardSize"]);

    const handleDragEnd = (e) => {
      if (store.state.customFolders.dragHovered) {
        let bookmarkId = props.bookmarks[e.oldIndex].id;
        let index = store.state.bookmarks.bookmarks.findIndex(
          (b) => b.id === bookmarkId
        );
        let payload = {
          index: index,
          folder_id: store.state.customFolders.dragHovered,
        };

        supabase
          .from("bookmarks")
          .update({ folder_id: payload.folder_id })
          .match({ id: bookmarkId })
          .then(() => {
            store.commit("bookmarks/updateBookmarkFolder", payload);
          });
      }
    };

    const classCardColumns = computed(() => {
      let adjustedSize;
      if (cardSize.value === 5) {
        adjustedSize = 6;
      } else if (cardSize.value > 6) {
        adjustedSize = 12;
      } else {
        adjustedSize = cardSize.value;
      }
      return (
        "cards q-pa-xs col-xs-12 col-sm-6 col-md-" +
        adjustedSize +
        " col-lg-" +
        adjustedSize
      );
    });

    return {
      classCardColumns,
      cardSize,
      props,
      handleDragEnd,

      dragOptions: {
        animation: 0.1,
        group: { name: "bookmarks", pull: true, put: false },
        disabled: false,
        ghostClass:
          props.title === "All Bookmarks" || props.title === "Favourites"
            ? "ghost-visible"
            : "ghost",
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.cards {
  transition: all 0.1s;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0;
}
.ghost-visible {
  opacity: 0.5;
}

.highlighted {
  background-color: #9ab6f1;
}

.dragging {
  transform: scale(0.3) !important;
  transition: transform 0.18s ease;
}
</style>
