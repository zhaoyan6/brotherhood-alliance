/**
 * Created by chenlei on 2017/12/27.
 */
;(function (root) {
  var _util = {}
  // var ArrayProto = Array.prototype, ObjProto = Object.prototype, FunProto = Function.prototype
  var ObjProto = Object.prototype
  // var slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty
  var toString = ObjProto.toString
  var hasOwnProperty = ObjProto.hasOwnProperty
  // var nativeIsArray = Array.isArray, nativeKeys = Array.keys
  var nativeIsArray = Array.isArray

  /**
   * @method isString
   * @param obj
   * @returns {boolean}
   * @desc 判断传入对象是否是字符串类型
   */
  _util.isString = function (obj) {
    return toString.call(obj) === '[object String]'
  }

  /**
   * @method isArray
   * @type {Function|*|_.isArray}
   * @desc 判断当前对象是否是数组类型
   */
  _util.isArray = nativeIsArray || function (obj) {
    return toString.call(obj) === '[object Array]'
  }

  /**
   * @method isObject
   * @param obj
   * @returns {boolean}
   * @desc 判断当前对象是否是对象类型
   */
  _util.isObject = function (obj) {
    var type = typeof obj
    return (type === 'function' || type === 'object') && !!obj
  }

  /**
   * @method isDate
   * @param obj!
   * @returns {boolean}
   * @desc 判断当前对象是否是时间类型
   */
  _util.isDate = function (obj) {
    return toString.call(obj) === '[object Date]'
  }

  /**
   * @method getQueryVal
   * @param name 参数名
   * @param url (可选)如果从当前页面URL中获取参数值，url参数可以不用指定
   * @returns {string}
   * @desc 根据参数名从当前地址或指定地址中获取参数值
   */
  _util.getQueryVal = function (name, url) {
    var urlAddress = location.href
    var paramstr = urlAddress.split('?')[1]
    var paramobj = {}

    if (!paramstr) {
      return
    }

    var paramsArr = paramstr.split('&')
    for (var i = 0, len = paramsArr.length; i < len; i++) {
      var tmp = paramsArr[i].split('=')
      paramobj[tmp[0]] = tmp[1]
    }
    return paramobj[name]
  }

  /**
   * @method trim
   * @param obj
   * @returns {string}
   * @desc 清除字符串两边的空白字符
   */
  _util.trim = function (obj) {
    return _util.isString(obj) ? obj.replace(/^\s+|\s+$/g, '') : ''
  }

  /**
   * @method extend
   * @param obj
   * @returns {*}
   * @desc 对象属性的扩展
   * @example _util.extend({aa:'abc',cc:'like that'},{aa:'cba',bb:'like this'})
   *          结果：{aa:'cba',bb:'like this',cc:'like that'}
   */
  _util.extend = function (obj) {
    if (!_util.isObject(obj)) {
      return obj
    }
    var source, prop
    for (var i = 0, l = arguments.length; i < l; i++) {
      source = arguments[i]
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop]
        }
      }
    }
    return obj
  }

  /**
   * @method sendStatistic
   * @param para 统计属性
   * @param next 发送统计后要执行的方法
   * @desc 发送统计请求，原理创建一个img对象，图片源为一个1*1像素的图片，这样可以解决统计请求域与功能页存放的域不一致的问题。
   * @example
   *      //统计属性参数
   *      var opt = {
     *          curpageid:xxx, //活动ID
     *          type:xxx,//页面名称
     *          fuid:xxx,//页面展现或某个操作名称，如：页面展示-> show; 查看按钮点击操作：view_click(可自定义)
     *          uid:xxx,//用户ID
     *          cid:xxx//渠道ID
     *      };
   *      //统计发送后要执行的方法(一般发送完统计再进行跳转页面的情况居多)
   *      var next = function(){
     *          window.location = 'www.mi.com';
     *      }
   *      //发送统计
   *      _util.sendStatistic(opt,next);
   */
  _util.sendStatistic = function (para, next) {
    var url = 'https://data.game.xiaomi.com/1px.gif?ac=xm_client&client=sales_pic'
    if (!para) {
      return
    }
    var str, prop
    for (prop in para) {
      if (hasOwnProperty.call(para, prop)) {
        str += '&' + prop + '=' + para[prop]
      }
    }
    url += str + '&_' + (new Date()).getTime()
    var img = new Image()
    img.error = img.onload = function () {
      next && next()
    }
    img.src = url
  }
  /**
   * @method sendPerformance
   * @param para 统计活动加载时间等详细信息
   * @param next 发送统计后要执行的方法
   * @desc 发送统计请求，原理创建一个img对象，图片源为一个1*1像素的图片，这样可以解决统计请求域与功能页存放的域不一致的问题。
   * @example
   *      //统计属性参数
   *      var opt = {
     *          curpageid:xxx, //活动ID
     *          type:xxx,//页面名称
     *          fuid:xxx,//页面展现或某个操作名称，如：页面展示-> show; 查看按钮点击操作：view_click(可自定义)
     *          uid:xxx,//用户ID
     *          cid:xxx//渠道ID
     *      };
   *      //统计发送后要执行的方法(一般发送完统计再进行跳转页面的情况居多)
   *      var next = function(){
     *          window.location = 'www.mi.com';
     *      }
   *      //发送统计
   *      _util.sendStatistic(opt,next);
   */
  _util.sendPerformance = function (para, next) {
    var url = 'https://data.game.xiaomi.com/1px.gif?ac=xm_client&client=sales_pic'
    if (!para) {
      return
    }
    var str, prop
    for (prop in para) {
      if (hasOwnProperty.call(para, prop)) {
        str += '&' + prop + '=' + para[prop]
      }
    }
    url += str + '&_' + (new Date()).getTime()
    var img = new Image()
    img.error = img.onload = function () {
      next && next()
    }
    img.src = url
  }

  /**
   * @method isWXPlatform
   * @returns {boolean}
   * @desc 判断当前页面是否在微信平台中
   */
  _util.isWXPlatform = function () {
    return /MicroMessenger/i.test(navigator.userAgent)
  }
  /**
   * @method checkOperaSys
   * @returns {string}
   * @desc 判断当前客户端系统类型
   */
  _util.checkOperaSys = function () {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      return 'ios'
    } else if (/(Android)/i.test(navigator.userAgent)) {
      return 'android'
    }
    return 'pc'
  }
  /**
   * @desc 生成某个范围内的随机数, eg: random(0, 10)生成0-9的随机整数
   * @param min
   * @param max
   */
  _util.random = function (min, max) {
    return Math.floor(min + Math.random() * (max - min))
  }

  /**
   * @desc 获取指定cookie值
   * @param cName
   * @returns {string}
   */
  _util.getCookie = function (cName) {
    var cStart = 0
    var cNnd = 0
    if (document.cookie.length > 0) {
      cStart = document.cookie.indexOf(cName + '=')
      if (cStart !== -1) {
        cStart = cStart + cName.length + 1
        cNnd = document.cookie.indexOf(';', cStart)
        if (cNnd === -1) cNnd = document.cookie.length
        return document.cookie.substring(cStart, cNnd)
      }
    }
    return ''
  }
  /**
   * @desc 设置cookie
   * @param cookiename
   * @param cookievalue
   * @param milsecond
   * @param type
   */
  _util.setCookie = function (cookiename, cookievalue, milsecond, type) {
    var date = new Date()
    if (type === 'milsecond') {
      date.setTime(date.getTime() + milsecond)
    } else {
      date.setDate(date.getDate() + milsecond)
    }
    document.cookie = cookiename + '=' + cookievalue + ';expires = ' + date.toGMTString()
  }
  if (typeof define === 'function' && define.amd) {
    // AMD define
    define([], function () {
      return _util
    })
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = _util
  } else {
    window.DOWNLOAD = _util
  }
})()
