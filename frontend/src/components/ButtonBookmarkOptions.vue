<template>
  <div class="col-2">
    <q-btn
      text-color="primary"
      icon="mdi-dots-horizontal"
      direction="left"
      round
      dense
      @click.stop
      class="options"
      :size="size"
    >
      <q-menu transition-duration="0s">
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="confirmDelete">
            <q-item-section side><q-icon name="mdi-delete" /></q-item-section>
            <q-item-section>Delete</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { supabase } from "boot/supabase";

export default defineComponent({
  props: ["id", "size"],
  setup(props) {
    const $q = useQuasar();
    const store = useStore();
    const confirmDelete = () => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure you want to delete this bookmark?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        supabase
          .from("bookmarks")
          .delete()
          .match({ id: props.id })
          .then(() => {
            let index = store.state.bookmarks.bookmarks.findIndex(
              (b) => b.id === props.id
            );
            let payload = { index: index };
            store.commit("bookmarks/deleteBookmark", payload);
          });
      });
    };
    return { confirmDelete };
  },
});
</script>

<style lang="sass" scoped>
.options
  position: absolute
  top: 2%
  right: 2%
  transition: all .2s ease
  background-color: rgba(255, 255, 255, .7)
</style>
