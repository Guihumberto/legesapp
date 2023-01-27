<template>
  <q-page padding class="bg-grey-3">
    <transition
      appear
      enter-active-class="animated zoomIn slower"
      leave-active-class="animated zoomOut slower"
    >
      <q-card class="auth-tabs" v-if="auth.readLoggedIn">
          <q-banner class="bg-green-3 text-white">
            <template v-slot:avatar>
              <q-icon name="cloud" color="white" />
            </template>
              <h5 class="text-h5"> Você já está conectado!!</h5>
          </q-banner>
          <q-card-section>
            <div class="text-overline text-orange-9">link</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Leis</div>
            <div class="text-caption text-grey">
              Estude pela lei seca, jursirprudência e questôes.
            </div>
          </q-card-section>
          <q-card-actions>
            <q-space />
            <q-btn
              color="grey"
              rounded
              label="Estudo da Lei"
              to="/"
            />
          </q-card-actions>
          <q-separator class="q-mb-md"></q-separator>
          <q-card-section>
            <div class="text-overline text-orange-9">link</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Jurisprudência</div>
            <div class="text-caption text-grey">
              Julgados e súmulas do STF e STJ
            </div>
          </q-card-section>
          <q-card-actions>
            <q-space />
            <q-btn
              color="grey"
              rounded
              label="Jurisprudência"
              to="/todo"
            />
          </q-card-actions>
          <q-separator class="q-mb-md"></q-separator>
          <q-card-section>
            <div class="text-overline text-orange-9">link</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Planejamento</div>
            <div class="text-caption text-grey">
              Planjeamento, revisão e resumo em uma única ferramenta integrada.
            </div>
          </q-card-section>
          <q-card-actions>
            <q-space />
            <q-btn
              color="grey"
              rounded
              label="Planejamento"
              to="/todo"
            />
          </q-card-actions>
      </q-card>
    </transition>
    <transition
      appear
      enter-active-class="animated zoomIn slower"
      leave-active-class="animated zoomOut slower"
    >
      <q-card class="auth-tabs" v-if="!auth.readLoggedIn">
          <q-tabs
            v-model="login"
            dense
            class="bg-grey-3 text-grey-7"
            active-color="primary"
            indicator-color="purple"
            align="justify"
          >
            <q-tab name="entrar" label="Entrar"  />
            <q-tab name="cadastrar" label="Cadastrar" />
          </q-tabs>

          <q-tab-panels v-model="login" animated>
            <q-tab-panel name="entrar">
              <login :tab="login" @register="login = 'cadastrar'" />
            </q-tab-panel>

            <q-tab-panel name="cadastrar">
              <register :tab="login" />
            </q-tab-panel>

          </q-tab-panels>
      </q-card>
    </transition>
  </q-page>
</template>

<script>
  import { useAuthStore } from '../stores/AuthStore'
  const auth = useAuthStore()

  import register from '../components/auth/register.vue'
  import login from '../components/auth/login.vue'
  export default {
    data(){
      return{
        auth,
        login: 'entrar',
        log: false
      }
    },
    components:{
      register,
      login
    }
  }
</script>

<style lang="scss" scoped>
  .auth-tabs{
    max-width: 500px;
    margin: 0 auto;
  }

</style>
