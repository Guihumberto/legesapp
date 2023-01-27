<template>
  <q-page padding>
    <q-list bordered>
      <q-item-label header>Configurações</q-item-label>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Formato de 12 horas</q-item-label>
          <q-item-label caption>Será mostrado o formato de 12:00</q-item-label>
        </q-item-section>
        <q-item-section side >
          <q-toggle color="blue" v-model="show12h" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Notiticações</q-item-label>
          <q-item-label caption>Ativado</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-toggle color="green" v-model="notification" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Lista única de Tarefas</q-item-label>
          <q-item-label caption>As listas de tarefas concluídas e pendentes serão mostradas em uma única lista</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-toggle color="red" v-model="showTaskOneList" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-list class="q-mt-sm" bordered padding>
      <q-item-label header>Mais</q-item-label>
      <q-item v-ripple tag="label" clickable to="/about">
        <q-item-section>
          <q-item-label>Sobre</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item v-ripple tag="label" clickable to="/settings/helpe">
        <q-item-section>
          <q-item-label>Ajuda</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item
        v-ripple
        tag="label"
        clickable
        @click="visitWebsite()"
      >
        <q-item-section>
          <q-item-label>Visite nosso website </q-item-label>
          <q-item-label caption>www.estudodalei.com.br</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item v-ripple tag="label" clickable @click="emailUs()">
        <q-item-section>
          <q-item-label>Contato</q-item-label>
          <q-item-label caption>leges.estudo@gmail.com</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
  import { useSettingStore } from 'stores/SettingsStore'
  import { openURL } from 'quasar'
  const setting = useSettingStore()


  export default {
    data(){
      return{
        setting
      }
    },
    computed:{
      show12h:{
        get() {
          return this.setting.readSettings.show12h
        },
        set(value){
          this.setting.setShow12h(value)
        }
      },
      notification:{
        get() {
          return this.setting.readSettings.notifiication
        },
        set(value){
          this.setting.setNotifiication(value)
        }
      },
      showTaskOneList:{
        get() {
          return this.setting.readSettings.showTaskOneList
        },
        set(value){
          this.setting.setShoeTaskOneList(value)
        }
      }
    },
    methods:{
      visitWebsite(){
        openURL('https://estudodalei.com.br/')
      },
      emailUs(){
        window.location.href = 'mailto:leges.estudo@gmail.com?subject=Leges Estudo - informações'
      }
    }
  }
</script>

<style scoped>

</style>
