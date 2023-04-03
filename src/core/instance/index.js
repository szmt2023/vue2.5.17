import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}

// 通过 mixin 方式给 Vue 的原型定义了不同的属性和方法
// 通过 initGlobal 给 Vue 定义了全局的方法（静态方法）和属性

// 往 Vue 原型挂载方法，所以这里的 Vue 不使用 Class，而是 function
// 通过不同的文件给 Vue 的原型上定义不同的方法
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
