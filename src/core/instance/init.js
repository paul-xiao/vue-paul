import { initProxy } from "./proxy";
import { initState } from "./state";
import { initRender } from "./render";
import { initEvents } from "./events";
import { initLifecycle, callHook } from "./lifecycle";
import { initProvide, initInjections } from "./inject";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;

    if (options) {
      vm.$options = options; // 简化
    }

    // if (process.env.NODE_ENV !== "production") {
    //   initProxy(vm); // 不是生产环境 初始化代理
    // } else {
    //   vm._renderProxy = vm;
    // }

    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, "beforeCreate");
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, "created");

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  };
}
