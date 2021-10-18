<template>
  <q-btn round :class="btnClass" dense :size="size" @click.stop="toggle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 23"
      stroke-width="1.5"
      focusable="false"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="toggle-favorite__icon"
      :class="iconClasses"
      @animationend="onIconAnimationEnds"
    >
      <path
        d="M17.5 2.9c-2.1 0-4.1 1.3-5.4 2.8C10.5 4.1 8.3 2.5 5.9 3 4.4 3.2 3 4.2 2.3 5.6c-2.3 4.1 1 8.3 3.9 11.1 1.4 1.3 2.8 2.5 4.3 3.6.4.3 1.1.9 1.6.9s1.2-.6 1.6-.9c3.2-2.3 6.6-5.1 8.2-8.8 1.5-3.4 0-8.6-4.4-8.6"
        stroke-linejoin="round"
      ></path>
    </svg>

    <transition name="favorite-particles-transition">
      <div
        v-if="animating"
        class="toggle-favorite__particles"
      ></div> </transition
  ></q-btn>
</template>
<script>
import { ref, computed, defineComponent } from "vue";
import { supabase } from "boot/supabase";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
export default defineComponent({
  props: ["favourite", "id", "size"],
  setup(props) {
    const animating = ref(false);
    const $q = useQuasar();
    const store = useStore();
    const isFavourite = ref(props.favourite);
    const iconClasses = computed(() => {
      return {
        "toggle-favorite__icon--favorited": isFavourite.value,
        "toggle-favorite__icon--animate": animating.value,
      };
    });

    const btnClass = computed(() => {
      return $q.dark.isActive
        ? "toggle-favorite--dark"
        : "toggle-favorite--light";
    });

    const toggleFavourite = async (e) => {
      const bookmarkId = props.id;
      supabase
        .from("bookmarks")
        .update({ favourite: !isFavourite.value })
        .match({ id: bookmarkId })
        .then((b) => {
          let index = store.state.bookmarks.bookmarks.findIndex(
            (b) => b.id === bookmarkId
          );
          let payload = { index: index, bookmark: b.data[0] };
          store.commit("bookmarks/updateBookmark", payload);
        });
    };

    const toggle = () => {
      // Only animate on favoriting.
      if (!isFavourite.value) {
        animating.value = true;
      }
      toggleFavourite();
      isFavourite.value = !isFavourite.value;
    };

    const onIconAnimationEnds = () => {
      animating.value = false;
    };

    return {
      animating,
      isFavourite,
      iconClasses,
      btnClass,
      onIconAnimationEnds,
      toggle,
      toggleFavourite,
    };
  },
});
</script>
<style lang="sass" scoped>
// Thanks to mindstorm on codepen for the spreading the love https://codepen.io/mindstorm/pen/aZZvKq
$particles-animation-duration: .5s
$icon-animation-duration: 0.5s
$icon-color: hsl(1, 85%, 50%)
$icon-border-color: hsl(1, 75%, 70%)

@keyframes favorite-icon-animation
  1%
    opacity: 1
    transform: scale(0.1)

  50%
    opacity: 1
    transform: scale(1.1)

  80%
    opacity: 1
    transform: scale(0.8)

  100%
    opacity: 1
    transform: scale(1)

@keyframes favorite-particles-animation
  0%
    background-position: left center

  100%
    background-position: right center

.favorite-particles-transition-enter-active
  background-image: url("/images/particles-sprite.png")
  background-size: 2500%
  background-position: center
  background-repeat: no-repeat

  animation-duration: $particles-animation-duration
  animation-timing-function: steps(24)
  animation-name: favorite-particles-animation
.toggle-favorite--light
  background-color: white !important
.toggle-favorite--dark
  background-color: $dark !important
.toggle-favorite
  transition: all .2s ease


  &__icon
    height: 1.75em
    width: 1.75em

    // Transition mainly for when un-favoriting
    transition: fill-opacity 0.4s, stroke 0.2s
    fill: $icon-color
    fill-opacity: 0
    stroke: $icon-border-color

    &--favorited
      fill-opacity: 1
      stroke: $icon-color

    &--animate
      opacity: 0
      transform: scale(0)
      animation-duration: $icon-animation-duration
      animation-delay: $particles-animation-duration - $icon-animation-duration
      animation-name: favorite-icon-animation

  &__particles
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 5em
    height: 5em
</style>
