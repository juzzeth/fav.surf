<template>
  <q-form class="q-gutter-md" @submit="submitForm">
    <q-input
      v-model="formData.email"
      outlined
      dense
      color="light-blue"
      label="Email"
      type="email"
      hide-bottom-space
      lazy-rules
      :rules="[
        (val) => !!val || 'A valid email address is required',
        isValidEmail,
      ]"
    >
      <template #prepend>
        <q-icon name="mdi-at" color="accent" />
      </template>
    </q-input>

    <q-input
      v-model="formData.password"
      dense
      outlined
      lazy-rules
      hide-bottom-space
      type="password"
      color="light-blue"
      label="Password"
      :rules="[(val) => !!val || 'A password is required']"
    >
      <template #prepend>
        <q-icon name="mdi-key" color="accent" />
      </template>
    </q-input>
    <template v-if="tab === 'register'">
      <q-input
        v-model="formData.confirmPassword"
        dense
        outlined
        lazy-rules
        hide-bottom-space
        type="password"
        color="primary"
        label="Confirm Password"
        :rules="[
          (val) => val == formData.password || 'Both passwords must match',
        ]"
      >
        <template #prepend>
          <q-icon name="mdi-check" color="accent" />
        </template>
      </q-input>
    </template>
    <div>
      <q-btn
        :label="tab"
        dense
        type="submit"
        color="light-blue"
        class="button-login"
        :loading="loadingLogin"
      />
    </div>
  </q-form>
</template>
<style lang="scss">
.button-login {
  border-radius: 10px 10px 10px 10px;
  width: 100%;
}
</style>
<script>
import { ref } from "vue";
import { mapActions, mapGetters } from "vuex";
import { supabase } from "boot/supabase";

export default {
  name: "AuthComponent",
  components: {},
  props: ["tab"],
  setup() {
    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Please enter a valid email address";
    };
    const formData = ref({
      email: "",
      password: "",
      confirmPassword: "",
    });
    return {
      formData,
      isValidEmail,
    };
  },
  computed: {
    ...mapGetters("settings", ["loadingLogin"]),
  },
  methods: {
    ...mapActions("settings", ["setUserDetails", "setLoadingLogin"]),
    submitForm() {
      this.setLoadingLogin(true);
      if (this.tab === "login") {
        supabase.auth
          .signIn({
            email: this.formData.email,
            password: this.formData.password,
          })
          .then((response) => {
            if (response.error) {
              this.$q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: response.error.message,
              });
            } else {
              this.$router.push("/bookmarks");
              this.setUserDetails(supabase.auth.user());
            }
          })
          .catch((error) => {
            this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Unexpected error",
            });
            console.log(error);
          });
      } else {
        supabase.auth
          .signUp({
            email: this.formData.email,
            password: this.formData.password,
          })
          .then((response) => {
            if (response.error) {
              this.$q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: response.error.message,
              });
            } else {
              this.$router.push("/bookmarks");
            }
          })
          .catch((error) => {
            this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Unexpected error",
            });
            console.log(error);
          });
      }
      this.setLoadingLogin(false);
    },
  },
};
</script>
