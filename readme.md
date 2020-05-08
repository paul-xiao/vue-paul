#### Mock Vue 源码

> 目标：Vue MVVM step by step

#### Vue 初始化过程分析

#first init process：

-------------------------
 1. define Vue class
 2. call _init
 3. call initLifecycle
 4. call initEvents
 5. call initRender  
 call defineReactive  
 call defineReactive  
 callHook beforeCreate
 6. call initInjections
 7. call initState  
 call defineReactive
 8. call initProvide  
 callHook created
 9. call $mount
 10. call mountComponent   
 callHook beforeMount
 11. call updateComponent
 12. call _render ==> return Vnode
 13. call _update
 14. call _patch_  
 callHook mounted  
 --------------------------------
 
#first init done
 
#### refs

[github](https://github.com/search?q=vue+%E6%BA%90%E7%A0%81)
