<template>
  <q-layout view="lHr lpR fFf">
    <q-header bordered class="bg-white text-black">
        <q-bar dark class="bg-primary text-white">
          <q-btn flat color="white" icon="chevron_left"  to="/" />
            <div class="col text-center text-weight-bold">
              Nome da Lei
            </div>
          <q-btn color="white" flat icon="list" />
        </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {


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
