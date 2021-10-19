<template>
  <q-card
    :key="id"
    class="bookmark-card"
    flat
    :bordered="true"
    style="overflow: hidden; outline: 0; width: 100%"
    @mouseenter="this.isHovered = true"
    @mouseleave="this.isHovered = false"
  >
    <div
      v-ripple
      @click="openBookmark"
      class="cursor-pointer relative-position q-hoverable full-height"
    >
      <div class="row items-center">
        <q-img
          no-spinner
          :src="bookmark.image"
          fit="cover"
          :ratio="16 / 9"
          style="height: 40%"
        />
        <ButtonBookmarkOptions
          :id="id"
          :size="cardSize * 40 + '%'"
          v-show="this.isHovered"
        />
      </div>
      <div>
        <q-separator />

        <q-card-section class="q-px-sm q-py-xs" style="height: 52%">
          <div class="button-options q-pa-none q-ma-none q-gutter-x-xs">
            <ButtonFavourite
              :id="id"
              :favourite="bookmark.favourite"
              :size="cardSize * 40 + '%'"
              v-show="this.showFavourite || this.isHovered"
              @click="toggleFavourite"
            />
          </div>
          <div class="text-bold ellipsis-2-lines q-mt-sm q-mb-xs title">
            {{ bookmark.title }}
          </div>
          <div class="text-caption d ellipsis-3-lines description">
            {{ bookmark.description }}
          </div>
        </q-card-section>
        <q-card-section class="q-px-sm q-py-none">
          <div class="text-caption ellipsis">
            <span v-if="!this.$route.params.id">
              <span v-if="this.folderData.folderName">
                <q-icon
                  :name="this.folderData.folderIcon || 'mdi-folder'"
                  :style="'color: ' + this.folderData.icon_color"
                  size="xs"
                />
                <span class="q-pa-xs" style="font-weight: 600">{{
                  this.folderData.folderName
                }}</span>
              </span>
              <span v-else>
                <q-icon
                  :name="this.folderData.folderIcon || 'mdi-inbox'"
                  color="primary"
                />
                <span class="q-pa-xs" style="font-weight: 600">Inbox</span>
              </span>
              <br />
            </span>

            {{
              bookmark.url.split("://")[1]
                ? bookmark.url.split("://")[1]
                : bookmark.url
            }}
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import ButtonFavourite from "components/ButtonFavourite";
import ButtonBookmarkOptions from "components/ButtonBookmarkOptions";
import { openURL } from "quasar";
import { mapGetters } from "vuex";

export default {
  components: { ButtonFavourite, ButtonBookmarkOptions },
  props: ["bookmark", "id", "cardSize"],
  data() {
    return {
      isHovered: false,
      showFavourite: this.bookmark.favourite,
    };
  },
  setup() {
    return {};
  },
  computed: {
    ...mapGetters("customFolders", ["folders"]),
    folderData() {
      let folderIndex = this.folders.findIndex(
        (f) => f.id === this.bookmark.folder_id
      );
      if (this.folders[folderIndex] != null) {
        return {
          folderName: this.folders[folderIndex].name,
          folderIcon: this.folders[folderIndex].icon,
          icon_color: this.folders[folderIndex].icon_color,
        };
      }
      return {
        folderName: null,
        folderIcon: null,
        icon_color: null,
      };
    },
  },
  methods: {
    openBookmark() {
      openURL(this.bookmark.url);
    },
    toggleFavourite() {
      this.showFavourite = !this.showFavourite;
    },
  },
};
</script>

<style lang="sass" scoped>
.bookmark-card
  height: 100%
  width: 100%
  cursor: pointer
.title
  font-family: "Karla",
.description
  font-family: "Merriweather",
  font-size: 8pt
.button-options
  position: absolute
  top: 0
  right: 2%
  transform: translateY(-70%)
  transition: all .2s ease
  background-color: rgba(255, 255, 255, 0)
</style>
