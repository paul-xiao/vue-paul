import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
console.log('---------------------------------')
console.log('%cVue Reactive', 'color:red')
console.log('---------------------------------')
console.log('refs:', 'https://www.cnblogs.com/xujiazheng/p/12120530.html')
console.log('vue在给每一个data的属性执行defineReactive函数，来达到数据绑定的目的')
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
