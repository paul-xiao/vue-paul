import { initMixin } from './init'
import {lifecycleMixin} from './lifecycle'
import {renderMixin} from './render'
import complier from '../../complier/index'


function Vue(options) {
  console.log('--First init steps:--')
  this._init(options) // prototype
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
complier(Vue)


export default Vue