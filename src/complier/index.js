
import {mountComponent} from '../core/instance/lifecycle'
function complier (Vue) {
  Vue.prototype.$mount= function(el) {
    console.log('5. calling $mounted')
    return mountComponent(this, el)

  }
}

export default complier