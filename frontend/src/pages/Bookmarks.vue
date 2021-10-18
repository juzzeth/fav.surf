<template>
  <div class="col q-px-sm q-py-xs">
    <div class="column full-height">
      <EmptyFolder v-if="activeBookmarks.length === 0" :title="title" />
      <template v-if="!loadingBookmarks">
        <CardGrid :title="title" :bookmarks="activeBookmarks" />
      </template>

      <template v-else>
        <div class="flex flex-center q-mt-xl">
          <q-spinner-ball color="primary" size="5em" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import CardGrid from "src/pages/CardGrid.vue";
import EmptyFolder from "pages/EmptyFolder.vue";
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "Bookmarks",
  components: {
    EmptyFolder,
    CardGrid,
  },
  props: ["title"],
  setup(props) {
    const route = useRoute();
    const store = useStore();

    const activeBookmarks = computed(() => {
      if (route.params.id) {
        return store.state.bookmarks.bookmarks.filter(
          (bookmark) => bookmark.folder_id === parseInt(route.params.id)
        );
      } else if (route.params.folder === "favourites") {
        return store.state.bookmarks.bookmarks.filter(
          (bookmark) => bookmark.favourite
        );
      } else if (route.params.folder === "inbox") {
        return store.state.bookmarks.bookmarks.filter(
          (bookmark) => !bookmark.folder_id
        );
      } else {
        return store.state.bookmarks.bookmarks;
      }
    });

    return {
      loadingBookmarks: false,
      activeBookmarks,
    };
  },
});
</script>

<style lang="sass" scoped></style>
