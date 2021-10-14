<template>
  <div class="row">
    <div
      class="
        col-12
        flex flex-center
        text-center text-overline
        message
        text-uppercase
      "
    >
      {{ message.text }}
    </div>
  </div>

  <div class="row">
    <div class="col-12 text-center">
      <q-img
        :src="'images/' + message.picture"
        width="90%"
        class="q-pa-none q-ma-none"
      />
    </div>
  </div>
  <div
    class="flex flex-center message-box"
    style="width: 100%; text-align: center"
  ></div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "EmptyFolder",
  setup() {
    const route = useRoute();
    const message = computed(() => {
      switch (route.params.folder) {
        case "inbox":
          return {
            text: "This must be that 'Inbox Zero' thing I've been hearing about...",
            picture: "catputer.png",
          };

        case "favourites":
          return {
            text: "You don't love any of your bookmarks?!",
            picture: "pancake.png",
          };
        case "":
          return {
            text: "It's time to add your first bookmark!",
            picture: "happycake.png",
          };
        default:
          return {
            text: "I searched this folder far and wide and all I got was this sweet cap",
            picture: "catboat.png",
          };
      }
    });
    return {
      message,
    };
  },
});
</script>

<style lang="sass" scoped>
.message
  color: $accent
  font-size: 12pt
.q-img
  opacity: 0.9
  max-width: 775px
  margin-top: -5%
  transition: all 3s
</style>
