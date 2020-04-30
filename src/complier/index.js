
import {mountComponent} from '../core/instance/lifecycle'
function complier (Vue) {
  Vue.prototype.$mount= function(el) {
    console.log('mounted')
    return mountComponent(this, el)

  }
}

export default complier