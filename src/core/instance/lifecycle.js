

import {createEmptyVNode} from '../vdom/vnode'
import Watcher from '../observer/watcher'
export function initLifecycle(vm) {
   const options = vm.$options
   // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}

export function callHook(vm, hook) {
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook) // emit event
  }
}


export function lifecycleMixin(Vue) {

  Vue.prototype._update = function (vnode) {
    console.log('--Vue.prototype._update--')
    const vm = this
    const prevVnode = vm._vnode
    if (!prevVnode) {
      // initial render
      console.log('job: excuting vm.__patch__ ==> change VNode to DOM')
      vm.$el = vm.__patch__(vm.$el, vnode, false, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
  }
}
/*
*
* vm: this
*
**/ 
export function mountComponent(vm, el) {
  console.log('mountComponent')
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
  }
  callHook(vm, 'beforeMount')
  const updateComponent = () => {
    console.log('calling vm._update(vm._render(), false)')
    vm._update(vm._render(), false)
  }
   // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  let noop = () => { }  // unknow yet
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}