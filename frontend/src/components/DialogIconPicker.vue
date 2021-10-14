<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-input
        v-model="data.filter"
        label="Filter"
        outlined
        clearable
        clear-icon="mdi-close"
        dense
        style="width: 100%"
        class="q-pa-sm"
      >
      </q-input>
      <q-icon-picker
        v-model="data.value"
        :tooltips="true"
        :filter="data.filter"
        icon-set="mdi-v5"
        :paginationProps="{
          maxPages: 2,
          'direction-links': true,
          'boundary-links': false,
          'icon-prev': 'mdi-chevron-left',
          'icon-next': 'mdi-chevron-right',
        }"
        v-model:model-pagination="data.pagination"
        :selectedColor="'grey-2'"
        :selectedTextColor="data.icon_color"
        :style="
          'height: 230px; width: 300px; padding-bottom: 10px; color: ' +
          data.icon_color
        "
      ></q-icon-picker>
      <q-color no-footer v-model="data.icon_color" />
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from "quasar";
import { QIconPicker } from "@quasar/quasar-ui-qiconpicker/src/index";
import "@quasar/quasar-ui-qiconpicker/src/index.sass";
import { ref } from "vue";

export default {
  props: ["startColor", "startIcon"],

  components: {
    QIconPicker,
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup(props) {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const data = ref({
      value: props.startIcon || "mdi-folder",
      filter: props.startIcon || "",
      pagination: {
        itemsPerPage: 25,
        page: 0,
        "icon-first": "mdi-skip_previous",
        "icon-last": "mdi-skip_next",
        "icon-prev": "mdi-fast_rewind",
        "icon-next": "mdi-fast_forward",
      },
      icon_color: props.startColor || "var(--q-accent)",
    });
    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,
      data,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK(data);
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
};
</script>
