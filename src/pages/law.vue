<template>
  <div class="q-pa-md absolute full-width full-height column">
    <template v-if="downloadComplete">
      <q-scroll-area class="scroll-area-task">
        <q-list>
          <q-list-item v-for="(item, i) in textLawComplete" :key="i">
            <q-list-section>
              <p class="textLawFont">{{ item.textLaw }}</p>
            </q-list-section>
          </q-list-item>
        </q-list>
      </q-scroll-area>

    </template>
    <template v-else>
      <span class="absolute-center">
          <q-spinner
            color="primary"
            size="5em"
          />
        </span>
    </template>

  </div>
</template>

<script>
  import { useTextLawStore } from 'stores/TextLawStore'
  const textLawStore = useTextLawStore()


  export default {
    data(){
      return {
        idLaw: this.$route.params.id
      }
    },
    computed:{
      downloadComplete(){
        if(textLawStore.readCompleteDownload == this.idLaw){
          return true
        }
        return false
      },
      textLawComplete(){
        return textLawStore.readTextLaw
      }
    },
    mounted(){
      textLawStore.cargaTextLaw(this.$route.params.id)
    }
  }
</script>

<style scoped>
.scroll-area-task{
  display: flex;
  flex-grow: 1;
}

.textLawFont{
  font-family: 'Times New Roman', Times, serif;
  font-size: 16px !important;
  letter-spacing: normal;
  line-height: 1.6em;
}

</style>
