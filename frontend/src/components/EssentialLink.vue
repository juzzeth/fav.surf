<template>
  <q-item
    exact
    :key="link.text"
    class="drawer-item"
    exact-active-class="active-route"
    clickable
    :to="link.to"
  >
    <q-item-section side>
      <q-icon :name="link.icon" :color="link.color">
        <q-badge
          v-show="link.text === 'Inbox'"
          rounded
          floating
          color="red"
          v-if="inboxCount > 0"
          class="inbox-badge"
        ></q-badge>
      </q-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label :class="dark ? 'menu-label--dark' : 'menu-label--light'">{{
        link.text
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainMenu",
  props: {
    link: {
      type: Object,
      default: null,
    },

    dark: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const inboxCount = ref(0);
    return {
      inboxCount,
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-label--light {
  color: $dark !important;
}
.menu-label--dark {
  color: $light !important;
}
.drawer-item .q-item__section--side .q-icon {
  color: $primary;
}

.active-route .q-item__label {
  opacity: 1 !important;
  font-weight: 900 !important;
}
.q-item__label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.7;
}

.inbox-badge {
  padding: 1px 5px;
  top: -1px;
  right: -1px;
  min-height: 8px;
}
</style>
