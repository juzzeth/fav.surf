<template>
  <q-layout view="hHh lpR fFf" style="overflow: hidden">
    <q-header
      elevated
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
      class="header"
      height-hint="50"
    >
      <q-toolbar
        class="toolbar q-gutter-x-sm q-pl-sm lt-sm"
        style="width: 100%"
      >
        <q-btn
          flat
          dense
          style="max-width: 20px"
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="mdi-chevron-left"
          to=""
        />
        <div
          shrink
          style="width: 100%"
          class="row items-center no-wrap ellipsis q-py-sm header bg-primary"
        >
          <q-space />
          <span class="mobile-title">{{ pageTitle || "" }}</span>
          <q-icon
            v-if="route.meta.info"
            name="mdi-information-outline"
            color="secondary"
            class="q-px-sm"
            size="xs"
          >
            <q-tooltip class="text-body2">
              {{ route.meta.info }}
            </q-tooltip>
          </q-icon>
          <q-space />
          <q-icon
            class="q-pr-sm"
            style="font-size: 16pt"
            :name="
              !route.params.id
                ? folderIcon.icon
                : currentFolder()
                ? currentFolder().icon
                : null
            "
            :color="route.params.id ? null : folderIcon.color"
            :style="iconStyle"
          />
        </div>
      </q-toolbar>
      <q-toolbar class="toolbar q-gutter-x-sm q-pl-md gt-xs">
        <q-btn
          flat
          dense
          class="toolbar-button"
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="mdi-menu"
        />
        <div class="container-logo q-py-sm">
          <q-img
            src="images/favsurf.png"
            no-spinner
            fit="scale-down"
            position="left"
            class="q-ml-md"
          />
        </div>

        <q-space />

        <q-btn
          flat
          dense
          round
          :class="
            'toolbar-button ' + $q.dark.isActive
              ? 'theme-switcher--dark'
              : 'theme-switcher--light'
          "
          :icon="
            $q.dark.isActive ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
          "
          @click="$q.dark.toggle()"
        />

        <div class="q-pr-sm">
          <q-btn round dense flat>
            <q-avatar size="md">
              <img :src="gravatar" />
            </q-avatar>
            <q-menu :offset="[20, 9]">
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="signOut">
                  <q-item-section side
                    ><q-icon name="mdi-exit-run"
                  /></q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'"
      style="overflow-x: hidden"
    >
      <q-list class="q-pt-sm">
        <EssentialLink
          v-for="link in mainMenu"
          :key="link.text"
          :link="link"
          :dark="$q.dark.isActive"
        />
      </q-list>
      <SeparatorLabel>
        <q-btn
          dense
          flat
          no-caps
          label="Folders"
          no-wrap
          size="md"
          color="accent"
          aria-label="Add Folder"
          icon="mdi-folder-plus"
          @click="newFolder.display = !newFolder.display"
        />
      </SeparatorLabel>
      <!-- new folder input -->
      <q-item v-if="newFolder.display">
        <q-item-section side>
          <q-spinner-grid
            color="primary"
            size="24px"
            v-if="newFolder.loading"
          />
          <q-icon name="mdi-folder" color="accent" v-else />
        </q-item-section>
        <q-item-section>
          <q-input
            dense
            square
            @keydown.enter.prevent="addFolder"
            v-model="newFolder.name"
            autofocus
          >
            <template v-slot:append>
              <q-icon
                name="mdi-check"
                style="max-width: 24px; height: 24px"
                @click="addFolder"
                @focus.stop
                class="cursor-pointer"
              />
              <q-icon
                name="mdi-close"
                @click="newFolder.display = !newFolder.display"
                class="cursor-pointer"
                style="max-width: 24px; height: 24px"
              />
            </template>
          </q-input>
        </q-item-section>
      </q-item>

      <!-- custom folders -->
      <draggable
        v-bind="dragOptions"
        :component-data="{
          name: !drag ? 'flip-list' : null,
        }"
        :model-value="folders"
        @start="drag = true"
        @end="reorder"
        item-key="id"
      >
        <template #item="{ element }">
          <ItemCustomFolder :folder="element" />
        </template>
      </draggable>

      <!-- Custom Folder Loading Skeleton -->
      <q-item v-show="newFolder.loading" class="GNL__drawer-item" clickable>
        <q-item-section side>
          <q-skeleton size="24px" type="circle" />
        </q-item-section>
        <q-item-section>
          <q-skeleton height="24px" width="75%" animation="wave" type="QBtn" />
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <q-page class="column faded" :style-fn="styleFn">
        <q-scroll-area
          content-style="max-width:100%"
          :thumb-style="thumbStyle"
          class="col q-px-sm q-pt-none"
        >
          <div
            shrink
            v-if="$q.screen.gt.xs"
            class="
              row
              items-center
              no-wrap
              ellipsis
              q-px-md q-pt-md q-pb-sm
              header
            "
          >
            <q-btn
              no-caps
              size="md"
              glossy
              round
              color="orange"
              aria-label="Add Bookmark"
              icon="mdi-bookmark-plus"
            >
              <PopupAddBookmark />
            </q-btn>
            <q-separator vertical class="q-mx-sm" />
            <q-icon
              class="q-pr-sm"
              size="md"
              :name="
                !route.params.id
                  ? folderIcon.icon
                  : currentFolder()
                  ? currentFolder().icon
                  : null
              "
              :color="route.params.id ? null : folderIcon.color"
              :style="iconStyle"
            />
            <span class="folder-title">{{ pageTitle || "" }}</span>

            <q-space />

            <ButtonMenuViews class="q-px-sm" />
          </div>
          <router-view />
        </q-scroll-area>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { supabase } from "boot/supabase";

import { draggable } from "boot/vuedraggable";
import EssentialLink from "components/EssentialLink.vue";
import SeparatorLabel from "components/SeparatorLabel";
import ButtonMenuViews from "components/ButtonMenuViews";
import PopupAddBookmark from "src/components/PopupAddBookmark";
import ItemCustomFolder from "components/ItemCustomFolder";

import md5 from "md5";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    SeparatorLabel,
    ButtonMenuViews,
    PopupAddBookmark,
    ItemCustomFolder,
    draggable,
  },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const leftDrawerOpen = ref(false);

    const drag = ref(false);

    const newFolder = reactive({
      display: false,
      loading: false,
      name: null,
    });

    const reorder = async (e) => {
      // direction should be -1 or 1 and is the value affected folders will be adjusted
      // if the folder is moved down the list, which is in ascending order
      // the new position will be greater and affected folders will decrement their position
      var direction = -1;
      drag.value = false;

      if (e.oldIndex === e.newIndex) {
        return;
      } else if (e.oldIndex > e.newIndex) {
        direction = 1;
      }

      await supabase.rpc("reorder", {
        moved_id: folders.value[e.oldIndex].id,
        new_position: e.newIndex,
        old_position: e.oldIndex,
        direction: direction,
      });
      //TODO: return from postgres function?
      supabase
        .from("folders")
        .select()
        .then((f) => {
          store.commit(
            "customFolders/updateFolders",
            f.body.sort((a, b) => a.position - b.position)
          );
        });
    };

    const folders = computed({
      get: () => {
        return store.state.customFolders.folders;
      },
      set: (f) => {
        store.dispatch[("customFolders/updateFolders", f)];
      },
    });

    const iconStyle = computed(() => {
      if (route.params.id) {
        return "color: " + iconColor.value + " !important";
      }
      return "";
    });

    const folderIcon = computed(() => {
      if (!route.params.id && !route.params.folder) {
        return { icon: "mdi-bookmark-multiple", color: "orange" };
      }
      switch (route.params.folder) {
        case "inbox":
          return { icon: "mdi-inbox", color: "blue" };
        case "favourites":
          return { icon: "mdi-heart-multiple", color: "red" };
        default:
          return { icon: null, color: null };
      }
    });

    const gravatar = `https://www.gravatar.com/avatar/${md5(
      supabase.auth.user().email.trim().toLowerCase()
    )}?d=monsterid`;

    const styleFn = (offset, height) => {
      let pageheight = height - offset;
      return "height: " + pageheight + "px";
    };

    const pageTitle = computed(() => {
      return route.params.id && currentFolder()
        ? currentFolder().name
        : route.params.folder || "All Bookmarks";
    });

    const iconColor = computed(() => {
      return route.params.id && currentFolder()
        ? currentFolder().icon_color
        : null;
    });

    const currentFolder = () => {
      if (folders.value) {
        let folderId = route.params.id;
        let folder = folders.value.find((f) => f.id == folderId);
        if (folder) {
          return folder;
        }
      }
      return null;
    };

    const signOut = () => {
      store.commit("settings/setUserDetails", {});
      supabase.auth.signOut();
      router.push("/login");
    };

    const addFolder = () => {
      newFolder.display = !newFolder.display;
      newFolder.loading = true;
      // TODO: should set a settings page that includes default icon + icon color etc
      let folder = {
        name: newFolder.name,
        user_id: supabase.auth.user().id,
        icon: "mdi-folder",
        icon_color: "var(--q-accent)",
        position: folders.value.length || 0,
      };
      supabase
        .from("folders")
        .insert(folder)
        .then((f) => {
          store.commit("customFolders/updateFolders", [
            ...folders.value,
            f.data[0],
          ]);

          newFolder.loading = false;
          newFolder.name = null;
        });
    };

    onMounted(() => {
      supabase
        .from("folders")
        .select()
        .then((f) => {
          store.commit(
            "customFolders/updateFolders",
            f.body.sort((a, b) => a.position - b.position)
          );
        });

      supabase
        .from("bookmarks")
        .select()
        .then((b) => {
          store.commit("bookmarks/updateBookmarks", b.body);
        });
    });

    return {
      newFolder,
      leftDrawerOpen,
      currentFolder,
      gravatar,
      pageTitle,
      styleFn,
      folderIcon,
      iconStyle,
      addFolder,
      signOut,
      drag,
      route,
      reorder,
      folders,

      dragOptions: {
        animation: 200,
        group: { name: "bookmarks", pull: false, put: true },
        disabled: false,
        direction: "vertical",
        delay: 200,
        delayOnTouchOnly: true,
        ghostClass: "ghostFolder",
      },

      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#006d77",
        width: "5px",
        opacity: 0.75,
      },

      mainMenu: [
        {
          icon: "mdi-inbox",
          text: "Inbox",
          to: "/bookmarks/inbox",
          color: "blue",
        },
        {
          icon: "mdi-heart-multiple",
          text: "Favourites",
          to: "/bookmarks/favourites",
          color: "red",
        },
        {
          icon: "mdi-bookmark-multiple",
          text: "All Bookmarks",
          to: "/bookmarks",
          color: "orange",
        },
      ],
    };
  },
});
</script>

<style lang="scss" scoped>
.container-logo {
  height: 50px;
  width: 110px;
}
.container-logo .q-img {
  height: 36px;
}
.folder-title {
  font-family: "Karla";
  font-size: 20px;
  font-weight: 700;
  text-transform: capitalize;
}

.toolbar-button {
  max-width: 24px;
}

.theme-switcher--dark:hover {
  color: yellow;
  transition: all 0.5s;
  transform: rotate(360deg);
}

.theme-switcher--light:hover {
  color: $accent;
  transition: all 0.5s;
}
.q-item {
  min-height: 20px;
  padding: 6px 16px;
}

.ghostFolder {
  opacity: 0;
}

.folder-hovered .q-item__label {
  font-size: 25px;
  font-weight: 900;
  opacity: 1;
}
</style>
