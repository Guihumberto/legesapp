<template>
  <q-page style="max-width: 1080px; margin: 30px auto">
    <div class="q-px-md absolute full-width full-height column" >
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
  </q-page>
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300&family=Roboto:ital,wght@1,100&display=swap');

.scroll-area-task{
  display: flex;
  flex-grow: 1;
}

.textLawFont{
  font-family: 'Montserrat', sans-serif;
  font-size: 16px !important;
  letter-spacing: normal;
  line-height: 1.6em;
  text-align: left;
}

</style>
