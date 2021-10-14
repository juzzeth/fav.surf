<template>
  <div class="col q-px-sm q-py-xs">
    <div class="column full-height">
      <EmptyFolder v-if="true" />
      <template v-if="!loadingBookmarks">
        <CardGrid :title="this.title" />
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "Bookmarks",
  components: {
    EmptyFolder,
    CardGrid,
  },
  props: ["title"],
  setup() {
    return {
      loadingBookmarks: false,
    };
  },
});
</script>

<style lang="sass" scoped></style>
