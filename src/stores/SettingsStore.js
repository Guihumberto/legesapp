import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settings:{
      show12h: false,
      notifiication: false,
      showTaskOneList: false,
      showFooter: true
    }
  }),
  getters: {
    readSettings(){
      return this.settings
    }
  },
  actions: {
    setShow12h(value){
      this.settings.show12h = value
      this.saveSettings()
    },
    setNotifiication(value){
      this.settings.notifiication = value
      this.saveSettings()
    },
    setShoeTaskOneList(value){
      this.settings.showTaskOneList = value
      this.saveSettings()
    },
    saveSettings(){
      LocalStorage.set('settings', this.settings)
    },
    cargaSettings(){
     let setting = LocalStorage.getItem('settings')

     if(setting){
      this.settings.show12h = setting.show12h
      this.settings.notifiication = setting.notifiication
      this.settings.showTaskOneList = setting.showTaskOneList
     }
    },
    setShowFooter(value){
      this.settings.showFooter = value
    },
  },
});
