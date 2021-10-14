<template>
  <div class="wrapper q-py-sm q-px-xs">
    <div class="line left"></div>
    <div class="q-px-sm text-grey-7 text-center">
      <slot></slot>
    </div>
    <div class="line right"></div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SeparatorLabel",
});
</script>
<style lang="scss" scoped>
.wrapper {
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Karla";
  font-weight: 600;
}
.line {
  top: 50%;
  width: 45%;
  height: 1px;

  &.left {
    background: linear-gradient(to right, transparent, $accent);
  }
  &.right {
    background: linear-gradient(to left, transparent, $accent);
  }
}
</style>
