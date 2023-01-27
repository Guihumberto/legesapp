<template>
   <transition
    appear
    enter-active-class="animated fadeIn slower"
    leave-active-class="animated fadeOut slower"
  >
  <q-banner :class="bgColor">
      <template v-slot:avatar>
        <q-icon :name="icon" color="primary" />
      </template>
      {{ text }}
    </q-banner>
   </transition>
</template>

<script>
  export default {
    props:{
      icon: true,
      text: true,
      bgColor: true
    }
  }
</script>

<style scoped>

</style>
