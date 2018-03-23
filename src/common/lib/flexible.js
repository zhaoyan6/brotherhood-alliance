;(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var os = '';
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    
    if (metaEl) {
        //console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
            os = 'ios';
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
            os = 'android';
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    docEl.setAttribute('data-os', os);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem(){
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }
    var elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
        document.documentElement.setAttribute('data-webp',elem.toDataURL('image/webp').indexOf('data:image/webp')===0 ?1:0);
        window.webp =elem.toDataURL('image/webp').indexOf('data:image/webp')===0;
    } else {
        document.documentElement.setAttribute('data-webp','0');
        window.webp = false;
    }

    //清除缓存，防止缓存
    function clearCache(key) {
        function updateTimeStamp(key) {
            key = key || 'clearCache';
            var d = new Date().getTime(),
                url = location.href,
                reg = new RegExp(key + '=(\\d+)(&|$)', 'i'),
                matches = reg.exec(url),
                value = '';
            if (matches) {
                value = matches[1];
                if (value) { //如果已经存在相同的KEY，则替换，
                    url = url.replace(key + '=' + value, key + '=' + d)
                }
            } else { //如果已经有其他参数，则追加
                if (url.indexOf('?') > - 1) {
                    url += '&' + key + '=' + d;
                } else { //否则直接添加时间戳
                    url += '?' + key + '=' + d;
                }
            }

            if (history.replaceState) {
                history.replaceState({
                        page: d
                    },
                    document.title, url);
            }
        }
        window.addEventListener('load', function(e) {
            //由于bfcache原因，按返回键时候不执行onload事件，但是会执行onpageshow事件，但是onpageshow事件兼容性不好，在IE，opera等浏览器上支持，好的方法是添加onunload事件。
            updateTimeStamp(key);
        });
        window.addEventListener('unload', function(e) {
            //如果不添加unload事件，在通过返回键返回的时候，不会执行onload事件，也就无法更新history的地址，无法达到清除缓存的目的
        });
    }

    clearCache();
})(window, window['lib'] || (window['lib'] = {}));