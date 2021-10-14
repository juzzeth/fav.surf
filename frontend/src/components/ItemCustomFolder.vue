<template>
  <q-item
    clickable
    v-if="folder.id"
    class="menu-item"
    exact
    @mouseenter="folderHovered = true"
    @mouseleave="folderHovered = false"
    exact-active-class="GNL__active-route"
    :to="'/bookmarks/folder/' + folder.id"
    :style="'border-color: ' + this.folder.icon_color"
  >
    <q-item-section side>
      <q-icon
        :name="folder.icon ? folder.icon : 'mdi-folder'"
        :style="folder.icon_color ? 'color: ' + folder.icon_color : 'secondary'"
      />
    </q-item-section>
    <q-item-section style="max-height: 24px; height: 100%">
      <q-item-label
        v-if="!rename"
        :class="$q.dark.isActive ? 'menu-label--dark' : 'menu-label--light'"
        class="ellipsis q-py-xs"
        style="max-width: 120px"
        >{{ folder.name }}</q-item-label
      >
      <q-input
        v-show="rename"
        dense
        ref="newFolderName"
        autofocus
        @keydown.enter.prevent="this.validateRename"
        square
        height="24px"
        @click.prevent
        v-model="folderName"
      >
        <template v-slot:append>
          <q-icon
            name="mdi-check"
            style="max-width: 24px; height: 24px"
            @click="this.validateRename"
            @focus.stop
            @keydown.enter.prevent="this.validateRename"
            class="cursor-pointer"
          />
          <q-icon
            name="mdi-close"
            style="max-width: 24px; height: 24px"
            @click="cancelRename"
            @focus.stop
            class="cursor-pointer"
          />
        </template>
      </q-input>
    </q-item-section>
    <q-item-section side>
      <q-btn
        icon-right="mdi-dots-vertical"
        flat
        dense
        v-show="folderHovered && !rename"
        padding="none"
        class="q-pa-none text-accent"
        :style="
          folder.icon_color ? 'color: ' + folder.icon_color + ' !important' : ''
        "
        v-on:click.prevent
      >
        <q-menu
          transition-duration="0s"
          :style="
            data.showIconPicker ? 'opacity: 0; z-index: -1' : 'opacity: 1'
          "
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="showIconDialog">
              <q-item-section>Change Icon</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="showFolderInput">
              <q-item-section>Rename</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="confirmDelete(folder.id)">
              <q-item-section>Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-item-section>
  </q-item>
</template>

<script>
import { ref, defineComponent } from "vue";
import { useQuasar } from "quasar";
import { mapGetters, mapActions } from "vuex";
import DialogIconPicker from "components/DialogIconPicker.vue";
import { supabase } from "boot/supabase";

export default defineComponent({
  name: "ItemCustomFolder",
  props: ["folder"],
  components: {},
  setup(props) {
    const folderHovered = ref(false);
    const rename = ref(false);
    const folderName = ref(props.folder.name);
    const data = ref({
      value: "",
      filter: "",
      showIconPicker: false,
      pagination: {
        itemsPerPage: 25,
        page: 0,
        "icon-first": "mdi-skip_previous",
        "icon-last": "mdi-skip_next",
        "icon-prev": "mdi-fast_rewind",
        "icon-next": "mdi-fast_forward",
      },
      icon_color: "var(--q-accent)",
    });

    const $q = useQuasar();

    return {
      data,
      rename,
      folderName,
      folderHovered,
    };
  },

  computed: {
    ...mapGetters("customFolders", ["folders", "foldersId", "hoveredFolder"]),
  },
  methods: {
    ...mapActions("customFolders", [
      "deleteFolder",
      "renameFolder",
      "changeIcon",
    ]),
    showFolderInput() {
      this.rename = true;
      setTimeout(() => {
        this.$refs.newFolderName.select();
      }, 20);
    },
    cancelRename() {
      this.rename = false;
      let index = this.folders.findIndex((f) => f.id === this.folder.id);
      this.folderName = this.folders[index].name;
    },
    validateRename() {
      let index = this.folders.findIndex((f) => f.id === this.folder.id);
      let currentFolderName = this.folders[index].name;
      if (!this.folderName) {
        this.folderName = currentFolderName;
        this.rename = false;
        return false;
      } else if (currentFolderName === this.folderName) {
        this.rename = false;
        return false;
      }
      let payload = {
        index: index,
        name: this.folderName,
      };

      supabase
        .from("folders")
        .update({ name: this.folderName })
        .match({ id: this.folder.id })
        .then(() => {
          this.renameFolder(payload);
        });
      this.rename = false;
    },
    validateIcon() {
      let index = this.folders.findIndex((f) => f.id === this.folder.id);
      let currentIcon = this.folders[index].icon || null;
      let currenticon_color = this.folders[index].icon_color || null;
      if (
        this.data.value === currentIcon &&
        this.icon_color === currenticon_color
      ) {
        this.data.value = null;
        return false;
      }
      let payload = {
        index: index,
        icon: this.data.value,
        icon_color: this.data.icon_color,
      };

      supabase
        .from("folders")
        .update({ icon: this.data.value, icon_color: this.data.icon_color })
        .match({ id: this.folder.id })
        .then(() => {
          this.changeIcon(payload);
          this.data.value = null;
        });
    },
    showIconDialog() {
      this.$q
        .dialog({
          component: DialogIconPicker,
          componentProps: {
            startIcon: this.folder.icon,
            startColor: this.folder.icon_color,
          },
        })
        .onOk((payload) => {
          this.data.value = payload.value.value;
          this.data.icon_color = payload.value.icon_color;
          this.validateIcon();
        });
    },
    confirmDelete(folderId) {
      this.$q
        .dialog({
          title: "Confirm",
          message:
            "Are you sure you want to delete this folder and move it's contents to your Inbox?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          let index = this.folders.findIndex((f) => f.id === folderId);

          supabase
            .from("folders")
            .delete()
            .match({ id: folderId })
            .then(() => {
              if (this.$route.params.id === folderId) {
                this.$router.push("/bookmarks");
              }
              this.deleteFolder(index);
            });
        });
    },
  },
});
</script>

<style lang="sass" scoped>
.menu-label--light
  color: $dark !important

.menu-label--dark
  color: $light !important

.body
  font-family: "karla"
.menu-item
  height: 100%
  .q-item__section--side
      .q-icon
        color: $primary

  .q-item__label
    font-size: 14px
    font-weight: 500
    opacity: 1

.GNL
  &__toolbar
    height: 64px
  &__folder-hovered
    opacity: .5
    border-style: dotted
    font-size: 14px
    font-weight: 500
    font-family: "karla"

  &__active-route
    .q-item__label
      opacity: 1 !important
      font-weight: 900 !important

  &__drawer-footer-link
    text-decoration: none
    font-weight: 500
    font-size: .75rem
</style>
