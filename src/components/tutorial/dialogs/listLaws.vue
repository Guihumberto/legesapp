<template>
        <q-card class="bg-primary text-white">
          <q-bar>
            <q-icon name="warning" />
            <div>Dicas</div>

            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card bordered class="bg-primary text-white q-mx-md q-px-md">
            <q-card-section >
              <div v-for="(item, i) in listGeral" :key="i">

                <div>
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
            <q-checkbox keep-color color="grey" v-model="noShowTips" label="Nao mostrar" />
            <q-space />
            <q-btn v-if="page > 1" flat @click="page = page-1" icon="chevron_left"/>
            <q-btn v-if="geral.length != page" flat @click="page = page+1" icon="chevron_right"/>
            <q-btn v-else flat v-close-popup no-caps>Fechar</q-btn>
          </q-card-actions>
        </q-card>
</template>

<script>
  export default {
    data(){
        return{
          page: 1,
          perPage:1,
          noShowTips: false,
          geral:[
            {id:1, title: "lorem plala", text:"lorem blabla bkaad dsldsa dsadsa dsa dsadsa dsadsa"},
            {id:2, title: "lorem plala", text:"lorem blabla bkaad dsldsa dsadsa dsa dsadsa dsadsa"},
            {id:3, title: "lorem plala", text:"lorem blabla bkaad dsldsa dsadsa dsa dsadsa dsadsa"},
            {id:4, title: "lorem plala", text:"lorem blabla bkaad dsldsa dsadsa dsa dsadsa dsadsa"},
            {id:5, title: "lorem plala", text:"lorem blabla bkaad dsldsa dsadsa dsa dsadsa dsadsa"},
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

    }
  }
</script>

<style scoped>

</style>
