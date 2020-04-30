(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function initState() {
    console.log('3. initState');
  }

  function handleError(){
    console.log('handleError');
  }

  class VNode{
    constructor(tag,
      data,
      children,
      text,
      elm,
      context,
      componentOptions,
      asyncFactory) {
      this.tag = tag;
      this.data = data;
      this.children = children;
      this.text = text;
      this.elm = elm;
      this.ns = undefined;
      this.context = context;
      this.fnContext = undefined;
      this.fnOptions = undefined;
      this.fnScopeId = undefined;
      this.key = data && data.key;
      this.componentOptions = componentOptions;
      this.componentInstance = undefined;
      this.parent = undefined;
      this.raw = false;
      this.isStatic = false;
      this.isRootInsert = true;
      this.isComment = false;
      this.isCloned = false;
      this.isOnce = false;
      this.asyncFactory = asyncFactory;
      this.asyncMeta = undefined;
      this.isAsyncPlaceholder = false;
    }
  }


  function createEmptyVNode(text) {
    const node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  }

  function initRender(vm){
  console.log('1. initRender');
    
  }
  function renderMixin(Vue){
    // 返回 VNode
    Vue.prototype._render = function() {
      console.log('9. --Vue.prototype._render--');
      const vm = this;
      const { render, _parentVnode } = vm.$options;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      let vnode, currentRenderingInstance;
      try {
        // There's no need to maintain a stack because all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError();
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError();
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if (Array.isArray(vnode)) {
          warn(
            'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
            vm
          );
        }
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    const listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  let uid = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  class Watcher {

    constructor (
      vm,
      expOrFn,
      cb,
      options,
      isRenderWatcher
    ) {
      this.vm = vm;
      if (isRenderWatcher) {
        vm._watcher = this;
      }
      vm._watchers= [];
      vm._watchers.push(this);
      // options
      if (options) {
        this.deep = !!options.deep;
        this.user = !!options.user;
        this.lazy = !!options.lazy;
        this.sync = !!options.sync;
        this.before = options.before;
      } else {
        this.deep = this.user = this.lazy = this.sync = false;
      }
      this.cb = cb;
      this.id = ++uid; // uid for batching
      this.active = true;
      this.dirty = this.lazy; // for lazy watchers
      this.deps = [];
      this.newDeps = [];
      this.depIds = new Set();
      this.newDepIds = new Set();
      this.expression =  '';
      // parse expression for getter
      if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
      } else {
        this.getter = parsePath(expOrFn);
        if (!this.getter) {
          this.getter = noop;
          process.env.NODE_ENV !== 'production' && warn(
            `Failed watching path: "${expOrFn}" ` +
            'Watcher only accepts simple dot-delimited paths. ' +
            'For full control, use a function instead.',
            vm
          );
        }
      }
      this.value = this.lazy
        ? undefined
        : this.get();
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get () {
      let value;
      const vm = this.vm;
      try {
        console.log('7. calling this.getter : this.getter 对应就是 updateComponent 函数，这实际上就是在执行：vm._update(vm._render(), hydrating)');
        value = this.getter.call(vm, vm); //this.getter 对应就是 updateComponent 函数，这实际上就是在执行：vm._update(vm._render(), hydrating)
      } catch (e) {
        if (this.user) {
          handleError(e, vm, `getter for watcher "${this.expression}"`);
        } else {
          throw e
        }
      } finally {
        // "touch" every property so they are all tracked as
        // dependencies for deep watching
        if (this.deep) {
          traverse(value);
        }
        this.cleanupDeps();
      }
      return value
    }

    /**
     * Add a dependency to this directive.
     */
    addDep (dep) {
      const id = dep.id;
      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
          dep.addSub(this);
        }
      }
    }

    /**
     * Clean up for dependency collection.
     */
    cleanupDeps () {
      let i = this.deps.length;
      while (i--) {
        const dep = this.deps[i];
        if (!this.newDepIds.has(dep.id)) {
          dep.removeSub(this);
        }
      }
      let tmp = this.depIds;
      this.depIds = this.newDepIds;
      this.newDepIds = tmp;
      this.newDepIds.clear();
      tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
      this.newDeps.length = 0;
    }

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update () {
      /* istanbul ignore else */
      if (this.lazy) {
        this.dirty = true;
      } else if (this.sync) {
        this.run();
      } else {
        queueWatcher(this);
      }
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run () {
      if (this.active) {
        const value = this.get();
        if (
          value !== this.value ||
          // Deep watchers and watchers on Object/Arrays should fire even
          // when the value is the same, because the value may
          // have mutated.
          isObject(value) ||
          this.deep
        ) {
          // set new value
          const oldValue = this.value;
          this.value = value;
          if (this.user) {
            try {
              this.cb.call(this.vm, value, oldValue);
            } catch (e) {
              handleError(e, this.vm, `callback for watcher "${this.expression}"`);
            }
          } else {
            this.cb.call(this.vm, value, oldValue);
          }
        }
      }
    }

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    evaluate () {
      this.value = this.get();
      this.dirty = false;
    }

    /**
     * Depend on all deps collected by this watcher.
     */
    depend () {
      let i = this.deps.length;
      while (i--) {
        this.deps[i].depend();
      }
    }

    /**
     * Remove self from all dependencies' subscriber list.
     */
    teardown () {
      if (this.active) {
        // remove self from vm's watcher list
        // this is a somewhat expensive operation so we skip it
        // if the vm is being destroyed.
        if (!this.vm._isBeingDestroyed) {
          remove(this.vm._watchers, this);
        }
        let i = this.deps.length;
        while (i--) {
          this.deps[i].removeSub(this);
        }
        this.active = false;
      }
    }
  }

  function initLifecycle(vm) {
     const options = vm.$options;
     // locate first non-abstract parent
    let parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function callHook(vm, hook) {
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook); // emit event
    }
  }


  function lifecycleMixin(Vue) {

    Vue.prototype._update = function (vnode) {
      console.log('10. --Vue.prototype._update--');
      const vm = this;
      const prevVnode = vm._vnode;
      if (!prevVnode) {
        // initial render
        console.log('11. excuting vm.__patch__ ==> change VNode to DOM');
        vm.$el = vm.__patch__(vm.$el, vnode, false, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
    };
  }
  /*
  *
  * vm: this
  *
  **/ 
  function mountComponent(vm, el) {
    console.log('6. calling mountComponent');
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
    }
    callHook(vm, 'beforeMount');
    const updateComponent = () => {
      console.log('8. calling vm._update(vm._render(), false)');
      vm._update(vm._render(), false);
    };
     // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    let noop = () => { };  // unknow yet
    new Watcher(vm, updateComponent, noop, {
      before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function initInjections () {
    console.log('2. initInjections');
  }
  function initProvide () {
    console.log('4. initProvide');
  }

  function initMixin(Vue) {
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
      initRender();
      callHook(vm, "beforeCreate");
      initInjections(); // resolve injections before data/props
      initState();
      initProvide(); // resolve provide after data/props
      callHook(vm, "created");

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function complier (Vue) {
    Vue.prototype.$mount= function(el) {
      console.log('5. calling $mounted');
      return mountComponent(this, el)

    };
  }

  function Vue(options) {
    console.log('--First init steps:--');
    this._init(options); // prototype
  }

  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
  complier(Vue);

  window.Vue = Vue;

})));
