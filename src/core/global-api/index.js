/* @flow */

import config from "../config";
import { initUse } from "./use";
import { initMixin } from "./mixin";
import { initExtend } from "./extend";
import { initAssetRegisters } from "./assets";
import { set, del } from "../observer/index";
import { ASSET_TYPES } from "shared/constants";
import builtInComponents from "../components/index";

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from "../util/index";

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;
  // 不能修改 Vue.config 对象
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Vue, "config", configDef); // 定义 Vue 全局属性 config 配置

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 不建议外面使用，因为不稳定
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  // 定义 Vue 全局方法
  Vue.set = set; // 添加一个响应式数据
  Vue.delete = del; // 删除对象属性（包括响应式数据）
  Vue.nextTick = nextTick; // 在下次 DOM 更新循环结束之后执行延迟回调。

  // 定义全局属性 options
  Vue.options = Object.create(null);
  // ASSET_TYPES 定义了  ['component',"directive", "filter"]
  ASSET_TYPES.forEach((type) => {
    // => Vue.options = { components:{},directives:{},filters:{} }
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  // 将内置组件 keep-alive 复制到 Vue.options.components 中
  extend(Vue.options.components, builtInComponents); // builtInComponents 内置组件

  initUse(Vue); // 创建全局 use 方法
  initMixin(Vue); // 创建全局 mixin 方法
  initExtend(Vue); // 创建全局 extend 方法
  initAssetRegisters(Vue); // 给Vue定义全局方法（component,directive,filter）
}
