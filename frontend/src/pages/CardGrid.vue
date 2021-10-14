<template>
  <div class="row" style="width: 100%">
    <div v-for="bookmark in bookmarks" :key="bookmark.id">
      <CardPrimary
        v-if="false"
        :id="bookmark.id"
        :key="bookmark.id"
        :bookmark="bookmark"
        :card-size="3"
      />
    </div>
  </div>
</template>

<script>
import CardPrimary from "src/components/CardPrimary.vue";
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "CardGrid",
  components: { CardPrimary },
  props: ["title"],
  setup() {
    const $q = useQuasar();
    //TODO: get from db obviously
    const bookmarks = ref([
      {
        id: 0,
        name: "placeholder",
        url: "https://example.org",
      },
    ]);
    return {
      bookmarks,
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
