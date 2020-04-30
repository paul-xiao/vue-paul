import Vue from '../core/index'


// defind mount methods

Vue.prototype.$mount = function(el, hydrating) {
  // hydrating SSR related
  return mountComponent(el, hydrating)
}