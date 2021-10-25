<template>
  <q-item
    clickable
    v-if="folder.id"
    class="menu-item"
    :class="draggedOverClass"
    @mouseenter="folderHovered = true"
    @mouseleave="folderHovered = false"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    exact-active-class="menu-item__active-route"
    :to="'/bookmarks/folder/' + folder.id"
    :style="'border-color: ' + folder.icon_color"
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
        v-if="rename"
        dense
        autofocus
        @keydown.enter.prevent="validateRename"
        square
        height="24px"
        @click.prevent
        v-model="folderName"
        ref="newFolderName"
      >
        <template v-slot:append>
          <q-icon
            name="mdi-check"
            style="max-width: 24px; height: 24px"
            @click="validateRename"
            @focus.stop
            @keydown.enter.prevent="validateRename"
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
        @click.prevent
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
import { ref, defineComponent, computed, nextTick } from "vue";
import { useStore } from "vuex";
import DialogIconPicker from "components/DialogIconPicker.vue";
import { supabase } from "boot/supabase";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "ItemCustomFolder",
  props: ["folder"],
  components: {},
  setup(props) {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const folderHovered = ref(false);
    const rename = ref(false);
    const store = useStore();
    const draggedOver = ref(false);
    const newFolderName = ref(null); // https://v3.vuejs.org/guide/composition-api-template-refs.html
    const folderName = ref(props.folder.name);
    const draggedOverClass = computed(() =>
      draggedOver.value && !store.state.customFolders.drag
        ? "menu-item__folder-hovered"
        : ""
    );
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

    const handleDragOver = () => {
      draggedOver.value = true;
      store.commit("customFolders/setDragHoveredFolder", props.folder.id);
    };
    const handleDragLeave = () => {
      draggedOver.value = false;
      store.commit("customFolders/setDragHoveredFolder", null);
    };
    const handleDrop = () => {
      draggedOver.value = false;
    };

    const cancelRename = () => {
      rename.value = false;
      let index = store.state.customFolders.folders.findIndex(
        (f) => f.id === props.folder.id
      );
      folderName.value = store.state.customFolders.folders[index].name;
    };

    const validateRename = () => {
      let index = store.state.customFolders.folders.findIndex(
        (f) => f.id === props.folder.id
      );
      let currentFolderName = store.state.customFolders.folders[index].name;
      if (!folderName.value) {
        folderName.value = currentFolderName;
        rename.value = false;
        return false;
      } else if (currentFolderName === folderName.value) {
        rename.value = false;
        return false;
      }
      let payload = {
        index: index,
        name: folderName.value,
      };

      supabase
        .from("folders")
        .update({ name: folderName.value })
        .match({ id: props.folder.id })
        .then(() => {
          store.commit("customFolders/renameFolder", payload);
        });
      rename.value = false;
    };

    const validateIcon = () => {
      let index = store.state.customFolders.folders.findIndex(
        (f) => f.id === props.folder.id
      );
      let currentIcon = store.state.customFolders.folders[index].icon || null;
      let currenticon_color =
        store.state.customFolders.folders[index].icon_color || null;
      if (
        data.value.value === currentIcon &&
        data.value.icon_color === currenticon_color
      ) {
        data.value.value = null;
        return false;
      }
      let payload = {
        index: index,
        icon: data.value.value,
        icon_color: data.value.icon_color,
      };

      supabase
        .from("folders")
        .update({ icon: data.value.value, icon_color: data.value.icon_color })
        .match({ id: props.folder.id })
        .then(() => {
          store.commit("customFolders/changeIcon", payload);
          data.value.value = null;
        });
    };

    const showIconDialog = () => {
      $q.dialog({
        component: DialogIconPicker,
        componentProps: {
          startIcon: props.folder.icon,
          startColor: props.folder.icon_color,
        },
      }).onOk((payload) => {
        data.value.value = payload.value.value;
        data.value.icon_color = payload.value.icon_color;
        validateIcon();
      });
    };

    const confirmDelete = (folderId) => {
      $q.dialog({
        title: "Confirm",
        message:
          "Are you sure you want to delete this folder and move it's contents to your Inbox?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        let index = store.state.customFolders.folders.findIndex(
          (f) => f.id === folderId
        );

        supabase
          .from("folders")
          .delete()
          .match({ id: folderId })
          .then(() => {
            if (route.params.id === folderId) {
              router.push("/bookmarks");
            }
            store.commit("customFolders/deleteFolder", index);
          });
      });
    };

    const showFolderInput = () => {
      rename.value = true

      // Will run callback function after the next render cycle
      nextTick(newFolderName.value.select)
    };

    return {
      data,
      rename,
      folderName,
      folderHovered,
      newFolderName,
      handleDragLeave,
      handleDragOver,
      cancelRename,
      validateRename,
      validateIcon,
      showIconDialog,
      confirmDelete,
      draggedOverClass,
      handleDrop,
      showFolderInput,
    };
  },
});
</script>

<style lang="sass" scoped>
.menu-label--light
  color: $dark !important

.menu-label--dark
  color: $light !important

.menu-item
  height: 100%
  .q-item__section--side
      .q-icon
        color: $primary

  .q-item__label
    font-size: 14px
    font-weight: 500
    opacity: 1

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
</style>
