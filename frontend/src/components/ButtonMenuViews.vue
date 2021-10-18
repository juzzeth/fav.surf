<template>
  <div class="q-gutter-x-sm">
    <q-btn dense flat color="accent" :icon="activeView.icon" no-caps>
      <span class="q-pl-xs">{{ activeView.label }}</span>
      <q-menu>
        <q-list>
          <q-item class="flex q-pr-lg">
            <q-item-section side>
              <q-icon name="mdi-magnify-plus-outline" color="accent" />
            </q-item-section>
            <q-item-section>
              <q-slider
                :model-value="cardSize"
                :min="1"
                :max="7"
                color="accent"
                @update:modelValue="setCardSize"
              />
            </q-item-section>
          </q-item>
          <q-item
            v-for="view in views"
            :key="view.id"
            v-close-popup
            clickable
            @click="updateView(view.id)"
          >
            <q-item-section side>
              <q-icon
                :name="view.icon"
                :color="view.enabled ? 'accent' : 'grey-5'"
              />
            </q-item-section>
            <q-item-section
              no-wrap
              :class="view.enabled ? 'text-accent' : 'text-grey-5'"
              >{{ view.label }}</q-item-section
            >
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ButtonMenuViews",
  setup() {
    const changeView = (e) => {
      this.updateView({ id: e.id });
    };
    return { changeView };
  },
  computed: {
    ...mapGetters("settings", ["views", "activeView", "cardSize"]),
  },
  methods: {
    ...mapActions("settings", ["updateView", "setCardSize"]),
  },
});
</script>
<style lang="sass" scoped></style>
