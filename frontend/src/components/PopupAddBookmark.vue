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
      autofocus
      outlined
      @keyup.enter="addBookmark()"
    >
      <template #prepend>
        <q-icon name="mdi-link" color="primary" />
      </template>
      <template #append>
        <q-icon name="mdi-content-save" color="green" />
      </template>
    </q-input>
  </q-popup-edit>
</template>

<script>
import { Notify } from "quasar";
import { reactive } from "vue";
import { supabase } from "src/boot/supabase";
import { useRoute } from "vue-router";

export default {
  setup() {
    const cheerio = require("cheerio");
    const route = useRoute();
    const bookmark = reactive({
      url: "",
    });

    const addBookmark = () => {
      const notif = Notify.create({
        type: "ongoing",
        message: "Getting site metadata...",
      });
      const folderId = route.params.id || null;
      const metadata = {};
      supabase.rpc("http_get", { uri: bookmark.url }).then((result) => {
        const $ = cheerio.load(result.data.content);

        metadata.title = $('meta[property="og:title"]').attr("content")
          ? $('meta[property="og:title"]').attr("content")
          : $("head title").text()
          ? $("head title").text()
          : null;

        metadata.description = $('meta[name="description"]').attr("content")
          ? $('meta[name="description"]').attr("content")
          : null;

        metadata.image = $('meta[property="og:image"]').attr("content")
          ? $('meta[property="og:image"]').attr("content")
          : $("img")
          ? $("img").attr("src")
          : null;
        metadata.url = bookmark.url;

        supabase
          .from("bookmarks")
          .insert([
            {
              url: metadata.url,
              user_id: supabase.auth.user().id,
              title: metadata.title,
              image: metadata.image,
              description: metadata.description,
              folder_id: folderId,
            },
          ])
          .then(() => {
            bookmark.url = null;
            notif({
              type: "positive",
              message: "Bookmark added!",
              timeout: 1000,
              icon: "mdi-check-circle-outline",
            });
          })
          .catch(() => {
            notif({
              type: "negative",
              message: "Error adding bookmark :(",
              timeout: 1000,
            });
          });
      });
    };

    return {
      bookmark,
      addBookmark,
    };
  },
};
</script>
