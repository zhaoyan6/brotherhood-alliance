/**
 * Created by cl on 14/12/2.
 * @desc 常用工具类库，为widget、plugin等功能性库提供依赖
 *
 */
;(function (root) {

    "use strict";

    var _util = {};
    //缓存原型句柄
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FunProto = Function.prototype;
    //缓存原型句柄中的常用方法
    var slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;
    //原生方法 ECMAScript 5
    var nativeIsArray = Array.isArray,
        nativeKeys = Array.keys;

    /**
     * @method isString
     * @param obj
     * @returns {boolean}
     * @desc 判断传入对象是否是字符串类型
     */
    _util.isString = function (obj) {
        return toString.call(obj) == '[object String]';
    };

    /**
     * @method isArray
     * @type {Function|*|_.isArray}
     * @desc 判断当前对象是否是数组类型
     */
    _util.isArray = nativeIsArray || function (obj) {
        return toString.call(obj) == '[object Array]';
    };

    /**
     * @method isObject
     * @param obj
     * @returns {boolean}
     * @desc 判断当前对象是否是对象类型
     */
    _util.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    /**
     * @method isDate
     * @param obj!
     * @returns {boolean}
     * @desc 判断当前对象是否是时间类型
     */
    _util.isDate = function (obj) {
        return toString.call(obj) == '[object Date]';
    };

    /**
     * @method getQueryVal
     * @param name 参数名
     * @param url (可选)如果从当前页面URL中获取参数值，url参数可以不用指定
     * @returns {string}
     * @desc 根据参数名从当前地址或指定地址中获取参数值
     */
    _util.getQueryVal = function (name,url) {
        var url = location.href;
        var paramstr = url.split('?')[1];
        var paramobj = {};

        if (!paramstr) {
            return;
        }

        var paramsArr = paramstr.split('&');
        for (var i=0,len=paramsArr.length;i<len;i++) {
            var tmp = paramsArr[i].split('=');
            paramobj[tmp[0]] = tmp[1];
        }
        return paramobj[name];
    };

    /**
     * @method trim
     * @param obj
     * @returns {string}
     * @desc 清除字符串两边的空白字符
     */
    _util.trim = function (obj) {
        return _util.isString(obj) ? obj.replace(/^\s+|\s+$/g, '') : '';
    };

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
            return obj;
        }
        var source, prop;
        for (var i = 0, l = arguments.length; i < l; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };

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
        //固定的统计域名地址
        var url = 'https://data.game.xiaomi.com/1px.gif?ac=xm_client&client=sales_pic';
        if (!para) {
            return;
        }
        var str = '', prop;
        for (prop in para) {
            if (hasOwnProperty.call(para, prop)) {
                str += '&' + prop + '=' + para[prop];
            }
        }
        url += str + '&_' + (new Date()).getTime();
        var img = new Image();
        img.error = img.onload = function () {
            next && next();
        };
        img.src = url;
    };

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
        //固定的统计域名地址
        var url = 'https://data.game.xiaomi.com/1px.gif?ac=xm_client&client=sales_pic';
        if (!para) {
            return;
        }
        var str = '', prop;
        for (prop in para) {
            if (hasOwnProperty.call(para, prop)) {
                str += '&' + prop + '=' + para[prop];
            }
        }
        url += str + '&_' + (new Date()).getTime();
        var img = new Image();
        img.error = img.onload = function () {
            next && next();
        };
        img.src = url;
    };

    /**
     * @method isWXPlatform
     * @returns {boolean}
     * @desc 判断当前页面是否在微信平台中
     */
    _util.isWXPlatform = function(){
        return /MicroMessenger/i.test(navigator.userAgent);
    };


    /**
     * @method ajaxReq
     * @param _url 请求地址
     * @param _type 请求类型（可选）
     * @param _param 请求参数
     * @param _successCb 请求成功后要执行的回调方法
     * @param _errCb 请求失败要执行的回调方法
     * @desc 封装的ajax请求
     */
    _util.ajaxReq = function(_url,_type,_param,_successCb,_errCb){
        var option = {
            type:_type ||'get',
            url:_url,
            data:_param,
            dataType:'json',
            cache:false,
            timeout:5000,
            success:function(res,status,xhr){
                if(!res){
                    _errCb &&_errCb(null);
                    return;
                }
                if(res.code!='200'){
                    _errCb &&_errCb(res);
                    return;
                }
                _successCb && _successCb(res);
            },
            error:function(xhr,ts,err){
                _errCb && _errCb(err);
            }
        };
        $.ajax(option);
    };
    /**
     * @desc ajax promise调用
     * @param conf  ajax调用参数，不需要传success error等回调
     * @returns {*}
     * ep:    mi.util.ajax({
                        url: host+'getAllAct',
                        dataType: 'jsonp',
                        jsonpCallback: 'getAllAct'
                    }).then(function(res) {
                           console.log(res);
                        },function(err) {
                            console.log(err);
                        });
     */
    _util.ajax = function (conf) {
        var defer = $.Deferred();
        $.ajax($.extend(conf, {
            success: function (data) {
                defer.resolve(data);
            },
            error: function (xhr, errorType, error) {
                defer.reject(xhr);
            }
        }));
        return defer.promise();
    };
    /**
     * @method checkOperaSys
     * @returns {string}
     * @desc 判断当前客户端系统类型
     */
    _util.checkOperaSys = function(){
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            return 'ios'
        } else if (/(Android)/i.test(navigator.userAgent)) {
            return 'android'
        }
        return 'pc'
    };

    /**
     * @method 创建遮罩
     * @param _conf 遮罩的CSS样式 CSS类名或者JS对象{property: value}
     * @param _content 遮罩内容
     * @param _registerEv 遮罩内容绑定事件
     */
    _util.mask = function (_conf, _content, _registerEv) {
        var is_100 = ($(window).height() > $(document.body).height()) ? true : false;
        var
            $mask = $('<div id="bg_mask"></div>'),
            $maskStyle = {
                "position": "absolute",
                "left": 0,
                "top": 0,
                "height": !is_100 ? '100%' : $(window).height(),
                "bottom": 0,
                'width': '100%',
                "background": "rgba(0, 0, 0, .7)",
                'z-index': 9999
            };
        if (!!_conf) {
            if (_util.isObject(_conf)) {
                _util.extend($maskStyle, _conf);
            } else if (_util.isString(_conf)){
                $mask.addClass(_conf);
            }
        }
        $mask.css($maskStyle);
        $(document.body).css({
            'position': 'relative'
        }).append($mask);

        /***************** 开始向遮罩添加内容 ****************/
        if (!!_content && _util.isArray(_content)) {
            for (var i= 0, size=_content.length; i<size; i++) {
                var $content = '';
                if (_util.isArray(_content[i].content)) {
                    for (var j= 0, len=_content[i].content.length; j<len; j++) {
                        $content += _content[i].content[j];
                    }
                } else {
                    $content = _content[i].content;
                }
                $(_content[i].parentNodeSelector).append($(_content[i].tag).addClass(_content[i].className).html($content));
            }
        }

        /* 防止点透 */
        $mask.on('touchmove', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });

        _util.registerEvent(_registerEv);
    };

    /**
     * @method registerEvent
     * @param _evs 元素监听事件配置对象
     * @desc 注册事件
     */
    _util.registerEvent = function (_evs) {
        if (!!_evs && _util.isArray(_evs)) {
            for (var i= 0, size=_evs.length; i<size; i++) {
                if (_evs[i].eventType === 'swipe') {
                    $(_evs[i].selector).swipe({
                        tap: _evs[i].listener
                    });
                } else if (_evs[i].eventType === 'touch') {
                    $(_evs[i].selector).touch({
                        tap: _evs[i].listener
                    });
                } else {
                    $(_evs[i].selector).on(_evs[i].eventType, _evs[i].listener);
                }
            }
        }
    };

    // 判断是否是米聊
    _util.isMiTalk = function () {
        var client = window.MLJsHandler,
            userId = getCookie('userId') != "" ? true : false,
            nick = getCookie('nick') != "" ? true : false,
            avatar = getCookie('avatar') != "" ? true : false,
            passToken = getCookie('passToken') != "" ? true : false,
            serviceToken = getCookie('serviceToken') != "" ? true : false,
            miVersion = getCookie('miVersion') != "" ? true : false;
        return (client && client.jsCallBack) || userId || miVersion || serviceToken || passToken || nick || avatar;
    };

    /**
     * @desc 生成某个范围内的随机数, eg: random(0, 10)生成0-9的随机整数
     * @param min
     * @param max
     */
    _util.random = function (min, max) {
        return Math.floor(min+Math.random()*(max-min));
    };

    /**
     * @desc 获取指定cookie值
     * @param c_name
     * @returns {string}
     */
    _util.getCookie = function (c_name) {
        var c_start = 0,
            c_end = 0;
        if (document.cookie.length>0) {
            c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1) {
                c_start=c_start + c_name.length+1;
                c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return document.cookie.substring(c_start,c_end);
            }
        }
        return ""
    };
    /**
     * @desc 设置cookie
     * @param cookiename
     * @param cookievalue
     * @param milsecond
     * @param type
     */
    _util.setCookie = function (cookiename, cookievalue, milsecond, type) {
        var date = new Date();
        if (type == 'milsecond') {
            date.setTime(date.getTime() + milsecond);
        } else {
            date.setDate(date.getDate() + milsecond);
        }
        document.cookie = cookiename + "=" + cookievalue + ";expires = " + date.toGMTString();
    };
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    if (typeof define == 'function' && define.amd) {
        // AMD define
        define([], function () {
            return _util;
        });
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = _util;
    } else {
        window.DOWNLOAD = _util;
    }
})();