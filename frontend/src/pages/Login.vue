<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="row justify-center" style="height: 150px">
          <q-card flat style="max-width: 500px; width: 100%" class="q-px-md">
            <q-card-section>
              <div class="row">
                <div class="col-12">
                  <q-img src="images/favsurf.png" />
                </div>
              </div>
            </q-card-section>
            <q-card-section v-if="supabase.auth.user()">
              <q-btn
                :label="'Continue as ' + supabase.auth.user().email"
                dense
                to="/bookmarks"
                type="button"
                color="light-blue"
                class="button-login"
                :loading="loadingLogin"
              />
              <SeparatorLabel>OR</SeparatorLabel>
              <q-btn
                label="Logout"
                @click="signOut"
                dense
                type="button"
                color="grey"
                class="button-login"
                :loading="loadingLogin"
              />
            </q-card-section>
            <div v-else>
              <q-tabs
                v-model="tab"
                no-caps
                active-color="primary"
                indicator-color="transparent"
                class="text-grey gt-xs"
              >
                <q-tab name="login" label="Login" />
                <q-tab name="register" label="Register" />
              </q-tabs>
            </div>
            <q-tab-panels
              v-model="tab"
              animated
              transition-next="slide-left"
              transition-prev="slide-right"
              v-if="!supabase.auth.user()"
            >
              <q-tab-panel name="login">
                <FormAuthentication :tab="tab" />
              </q-tab-panel>

              <q-tab-panel name="register">
                <FormAuthentication :tab="tab" />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary">
      <q-tabs
        v-model="tab"
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey lt-sm"
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { supabase } from "boot/supabase";
import FormAuthentication from "components/FormAuthentication";
import SeparatorLabel from "components/SeparatorLabel";

export default defineComponent({
  components: { FormAuthentication, SeparatorLabel },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const loadingLogin = computed(() => {
      return $store.getters["settings/loadingLogin"];
    });

    const signOut = () => {
      $store.commit("settings/setUserDetails", {});
      let supabaseSubscriptions = supabase.getSubscriptions();
      supabaseSubscriptions.forEach((s) => {
        s.unsubscribe();
      });
      supabase.auth.signOut();
      $router.go();
    };
    const tab = ref("login");
    return {
      tab,
      supabase,
      signOut,
      loadingLogin,
    };
  },
});
</script>

<style lang="scss" scoped></style>
