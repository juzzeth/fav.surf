<template>
  <q-popup-edit
    v-model="bookmark.url"
    style="width: 25%"
    :cover="false"
    :offset="[0, 10]"
  >
    <q-input
      v-model="bookmark.url"
      :model-value="bookmark.url"
      color="primary"
      placeholder="https://"
      autofocus
      outlined
      @keyup.enter="addBookmark()"
    >
      <template #prepend>
        <q-icon name="mdi-link" color="primary" />
      </template>
      <template #append>
        <q-icon @click="addBookmark()" name="mdi-content-save" color="green" />
      </template>
    </q-input>
  </q-popup-edit>
</template>

<script>
import { Notify } from "quasar";
import { reactive } from "vue";
import { supabase } from "src/boot/supabase";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import { useStore } from "vuex";

export default {
  setup() {
    const route = useRoute();
    const bookmark = reactive({
      url: "",
    });

    const store = useStore();

    const addBookmark = () => {
      const notif = Notify.create({
        type: "ongoing",
        message: "Getting site metadata...",
      });
      const folderId = parseInt(route.params.id) || null;
      const url = bookmark.url.includes("://")
        ? bookmark.url
        : "https://" + bookmark.url;

      api
        .post("/addbookmark", {
          url: url,
          user_id: supabase.auth.user().id,
          access_token: supabase.auth.session().access_token,
          folder_id: folderId ? folderId : null,
        })
        .then((response) => {
          store.commit("bookmarks/updateBookmarks", [
            ...store.state.bookmarks.bookmarks,
            response.data[0],
          ]);
          notif({
            type: "positive",
            message: "Bookmark added!",
            timeout: 1000,
            icon: "mdi-check-circle-outline",
          });
        })
        .catch((error) => {
          //TODO: more info on why the error occurred
          notif({
            type: "negative",
            message: "Error adding bookmark",
            timeout: 1000,
          });

          console.log(error);
        });
    };

    return {
      bookmark,
      addBookmark,
    };
  },
};
</script>
