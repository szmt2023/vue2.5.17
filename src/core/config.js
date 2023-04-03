/* @flow */

import { no, noop, identity } from "shared/util";

import { LIFECYCLE_HOOKS } from "shared/constants";

export type Config = {
  // user
  optionMergeStrategies: { [key: string]: Function }, // 自定义合并策略
  silent: boolean, // 取消 Vue 所有的日志与警告。
  productionTip: boolean, // 设置为 false 以阻止 vue 在启动时生成生产提示。
  performance: boolean, // 在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。 performance.mark API
  devtools: boolean, // 是否允许 vue-devtools 检查代码。开发版本默认为 true，生产版本默认为 false
  errorHandler: ?(err: Error, vm: Component, info: string) => void, // 指定组件的渲染和观察期间未捕获错误的处理函数。
  warnHandler: ?(msg: string, vm: Component, trace: string) => void,
  ignoredElements: Array<string | RegExp>,
  keyCodes: { [key: string]: number | Array<number> }, // 给 v-on 自定义键位别名。

  // platform
  isReservedTag: (x?: string) => boolean,
  isReservedAttr: (x?: string) => boolean,
  parsePlatformTagName: (x: string) => string,
  isUnknownElement: (x?: string) => boolean,
  getTagNamespace: (x?: string) => string | void,
  mustUseProp: (tag: string, type: ?string, name: string) => boolean,

  // legacy
  _lifecycleHooks: Array<string>,
};

export default ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings. 取消 Vue 所有的日志与警告。
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== "production",

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== "production",

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS,
}: Config);
