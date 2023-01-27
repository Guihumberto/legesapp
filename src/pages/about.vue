<template>
  <q-page class="q-pa-lg">
    <h5 class="q-mt-none q-mb-md text-weight-bold text-grey-8">App Leges - Estudo da Lei</h5>
    <transition
          appear
          enter-active-class="animated fadeIn slower"
          leave-active-class="animated fadeOut slower"
    >
    <div>
      <p class="text-body1">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde culpa assumenda tempora vel?
        Sapiente, quasi, saepe quam voluptatem aut recusandae qui modi dignissimos ab
        nisi quidem exercitationem dolorem laboriosam facere.
      </p>
      <p class="text-body1">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde culpa assumenda tempora vel?
        Sapiente, quasi, saepe quam voluptatem aut recusandae qui modi dignissimos ab
        nisi quidem exercitationem dolorem laboriosam facere.
      </p>
    </div>

    </transition>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageAbout'
})
</script>
