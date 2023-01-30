<template>
        <q-card class="bg-primary text-white" style="width: 400px">
          <q-bar>
            <q-icon name="warning" />
            <div>Dicas</div>

            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card bordered class="bg-primary text-white q-mx-md q-px-md" style="height: 200px">
            <q-card-section >
              <div v-for="(item, i) in listGeral" :key="i">

                <div style="height: 140px">
                  <span class="text-h6 q-mb-md">{{ item.title }}</span> <br>
                  <p>{{ item.text }}</p>
                </div>
                <div class="row justify-end">
                  <h5 class="q-mt-none text-h6"> {{ item.id }}/{{ geral.length }}</h5>
                </div>
              </div>
            </q-card-section>

          </q-card>
          <q-card-actions>
            <q-checkbox keep-color color="grey" v-model="noShowTips" label="Nao mostrar" @click="desativeTutorial(noShowTips)" />
            <q-space />
            <q-btn v-if="page > 1" flat @click="page = page-1" icon="chevron_left"/>
            <q-btn v-if="geral.length != page" flat @click="page = page+1" icon="chevron_right"/>
            <q-btn v-else flat v-close-popup no-caps>Fechar</q-btn>
          </q-card-actions>
        </q-card>
</template>

<script>
  import { useSettingStore } from 'stores/SettingsStore'
  const settings = useSettingStore()


  export default {
    data(){
        return{
          page: 1,
          perPage:1,
          noShowTips: false,
          geral:[
            {id:1, title: "Bem-vindo ao App do Estudo da Lei", text:"Acompanhe as dicas a seguir para tirar o máximo de proveito do app."},
            {id:2, title: "Menu fixo", text:"Estão listados as principais funcionalidades do app: Estudo da Lei, Planejamento, Revisão e Jurisprudência" },
            {id:3, title: "Leis", text:"Aqui você consiguirá ter acesso ao texto normativo na íntegra, questões, jurisprudência e muito mais. "},
            {id:4, title: "Plan", text:"É uma lista de tarefas voltado para estudo nos concursos, integrado com revisão e resumo."},
            {id:5, title: "Jurispruência", text:"tenha acesso a súmulas e julgados do STF e STJ, com um buscador por disciplina e assunto"},
          ]
        }
    },
    computed:{
      listGeral(){
        let list = this.geral
        let page = this.page -1
        let start = page * this.perPage
        let end = start + this.perPage

        return list.slice(start, end)
      }
    },
    methods:{
      desativeTutorial(value){
        let resp = !value
        console.log('error', resp);
        settings.setTutorialHome(resp)
      }
    }
  }
</script>

<style scoped>

</style>
