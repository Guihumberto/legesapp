import moment from 'moment'
export default {
  methods:{
    dateFormat(date){
      moment.locale('pt-br')
      const dateM = moment(date).format('DD/MM/YYYY')
      return dateM
    },
    order(a, b){
      let title = 'dateCreate'
      if(this.reverse){
        if(`${a}.${title} >  ${b}.${title}`){
          return -1
        } else {
          return true
        }
      } else {
        if(`${a}.${title} < ${b}.${title}`){
          return -1
        } else {
          return true
        }
      }
    },
  },
  filters:{
    searchHighlight(value, search) {
    if (search) {
      let searchRegExp = new RegExp(search, 'ig')
      return value.replace(searchRegExp, (match) => {
        return '<span class="bg-yellow-6">' + match + '</span>'
      })
    }
    return value
  }
  },
}
