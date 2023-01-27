<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-md q-px-md row items-end q-col-gutter-md bg-primary text-white" >
        <transition
            appear
            enter-active-class="animated fadeInDown slower"
            leave-active-class="animated fadeInDown slower"
          >
            <h5 class="text-h5 q-py-0">O que vamos estudar hoje?</h5>
          </transition>
      </div>
      <q-separator
        class="separator"
        size="10px"
        color="grey-2"
      />
      <q-list
        separator
      >
        <transition-group
            appear
            enter-active-class="animated fadeIn slower"
            leave-active-class="animated fadeOut slower"
          >
            <q-item
              v-for="law in law.laws.slice(0, 10)"
              :key="law.id"
              clickable
              v-ripple
              @click="lawTo(law)"
            >
              <q-item-section center avatar>
                <q-avatar color="grey-5" text-color="white" square icon="gavel" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ law.nickname}}</q-item-label>
                <q-item-label caption>{{ law.nro }}</q-item-label>
              </q-item-section>

              <q-item-section side center>
                <q-icon name="star" color="yellow-8" />
            </q-item-section>
            </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useLawStore } from 'stores/LawsStore'
const law = useLawStore()


export default defineComponent({
  name: 'PageHome',
  data(){
    return{
      law
    }
  },
  methods:{
    lawTo(item){
      console.log(item)
    }
  },
})
</script>

<style lang="scss">
.textRev textarea{
  font-size: 19px;
  line-height: 1.4 !important;
}
.separator{
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: $grey-4;
}
.revContent {
  white-space: pre-line;
}
.comment:not(:first-child){
  border-top: 1px solid rgba(0, 0, 0, 0.12)
}
</style>
