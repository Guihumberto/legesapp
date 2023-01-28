<template>
  <q-layout view="lHr lpR fFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-weight-bold">
          <span class="gt-sm">{{ $route.name }}</span>
          <q-icon
            size="sm"
            color="primary"
            name="fas fa-ghost"
            class="header-icon lt-md q-pa-md"
          />
        </q-toolbar-title>
        <div>
          <q-btn
            flat
            v-if="!auth.readLoggedIn"
            color="primary"
            no-caps
            label="Entrar"
            to="/auth"
          />
          <q-btn
            v-else
            flat
            color="primary"
            no-caps
            label="Sair"
            @click="auth.logOut()"
          />

        </div>
        <q-btn dense flat round icon="article" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>
    <transition
      appear
      enter-active-class="animated slideInUp slower"
      leave-active-class="animated fadeOutDown slower"
    >
      <q-footer v-if="settings.readSettings.showFooter">
        <q-tabs
          class="text-white"
          dense
        >
          <q-route-tab
            v-for="item, i in menu.filter(x => x.footer)" :key="i"
            :icon="item.icon"
            :label="item.title"
            :to="item.to"
            />
        </q-tabs>
      </q-footer>
    </transition>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      :width="300"
      side="left"
      bordered
      class="bg-grey-3"
    >
      <div class="q-pa-md text-center bg-grey-5">
        <q-icon
          size="lg"
          color="primary"
          name="fas fa-ghost" />
          <div>
            <span class="text-h6">Leges</span><br>
            <span>Estudo da lei</span>
          </div>
          <div>
            <q-icon name="account_circle" />
            <span
              class="text-overline q-ml-sm"
              v-if=" auth.readUser.name">{{ auth.readUser.name }}</span>
          </div>
      </div>

      <q-separator></q-separator>

      <q-list class="text-grey-8">
        <q-item-label header>Menu</q-item-label>
        <q-item
          clickable
          v-ripple
          exact
          v-for="item, i in menu" :key="i"
          :to="item.to">
          <q-item-section avatar>
            <q-icon :name="item.icon" size="md" />
          </q-item-section>

          <q-item-section class="text-h6">{{item.title}}</q-item-section>
        </q-item>
      </q-list>
      <div class="text-center fixed-bottom q-pa-md">
        <q-btn
          :color="!auth.readLoggedIn ? 'primary' : 'red'"
          icon="person"
          class="full-width"
          block
          no-caps
          rounded
          :label="!auth.readLoggedIn ? 'Entrar' : 'Sair'"
          @click="!auth.readLoggedIn ? '/auth' : auth.logOut()"
        />
      </div>
    </q-drawer>

    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      bordered>
      <q-input
        class="q-ma-md"
        outlined rounded dense
        v-model="search"
        label="Busca"
        placeholder="Busca..."
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-list padding separator>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label
              class="grey-text"
              overline>Planejamento</q-item-label>
            <q-item-label class="text-weight-bold">Planjemaneto da semana</q-item-label>
            <q-item-label caption>Tópico de ultimas leis abertas e estudadas, ultimos comentarios, ultimas decisoes judicias, ultimas resultados de busca, questoes erradas.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label
              class="grey-text"
              overline>Planejamento</q-item-label>
            <q-item-label class="text-weight-bold">Lei acessada</q-item-label>
            <q-item-label caption>Tópico de ultimas leis abertas e estudadas, ultimos comentarios, ultimas decisoes judicias, ultimas resultados de busca, questoes erradas.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label
              class="grey-text"
              overline>Planejamento</q-item-label>
            <q-item-label class="text-weight-bold">Erros nas questôes</q-item-label>
            <q-item-label caption>Tópico de ultimas leis abertas e estudadas, ultimos comentarios, ultimas decisoes judicias, ultimas resultados de busca, questoes erradas.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label
              class="grey-text"
              overline>Planejamento</q-item-label>
            <q-item-label class="text-weight-bold">Jurisprudência</q-item-label>
            <q-item-label caption>Tópico de ultimas leis abertas e estudadas, ultimos comentarios, ultimas decisoes judicias, ultimas resultados de busca, questoes erradas.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label
              class="grey-text"
              overline>Tuotorias</q-item-label>
            <q-item-label class="text-weight-bold">Aprendendo sobre o app</q-item-label>
            <q-item-label caption>Tópico de ultimas leis abertas e estudadas, ultimos comentarios, ultimas decisoes judicias, ultimas resultados de busca, questoes erradas.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useLawStore } from 'stores/LawsStore'
import { useSettingStore } from 'stores/SettingsStore'
import { useAuthStore } from 'stores/AuthStore'
import { useCommentsStore } from 'stores/CommentsStore'
import { userMarkrevStore } from 'stores/MarkRevStore'



const law = useLawStore()
const settings = useSettingStore()
const auth = useAuthStore()
const commentStore = useCommentsStore()
const markrevStore = userMarkrevStore()

export default {
  setup () {
    auth.handlerAuthStateChange()
    law.cargaLawList()

    setTimeout(() => {
      commentStore.cargaComments()
      markrevStore.cargaMarkRev()
    }, 2000)

    settings.cargaSettings()

    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const search = ref()

    const menu = [
      {title: "Início", icon: "home", to:"/", footer: true},
      {title: "Plan", icon: "turned_in_not", to:"/plan", footer: true},
      {title: "Revisão", icon: "task", to:"/rev", footer: true},
      {title: "Configurações", icon: "settings", to:"/settings", footer: false},
      {title: "Sobre", icon: "info", to:"/about", footer: true},
    ]

    return {
      settings,
      auth,
      menu,
      search,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  },
}
</script>

<style>
  .header-icon{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
  }
  @media screen and (min-width: 768px) {
    .q-footer {
      display: none;
    }
  }
</style>
