
var $ = require('webpack-zepto');
function update(el, option) {
    var attr = option.arg || 'src';
    if (el.tagName.toLowerCase() === 'img' && option.value) {
        if (option.value.indexOf('data:image') < 0) {
            var tmp = option.value.substring(0, option.value.lastIndexOf('.')) + '.webp';
            el.setAttribute(attr, webp ? tmp : option.value);
        } else {
            el.setAttribute(attr, option.value);
        }
    }else{
        Vue.nextTick(function () {
            var fileName,fileType,$this,size;
            $('.webpbg').each(function () {
                $this = $(this);
                size = $this.css('background-size');
                fileName = $this.css('background-image').replace(/url\(\"*/gi,'').replace(/\"*\)/gi,'');
                fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

                if(window.webp){
                    $this.css({'background':'url('+fileName.replace(fileType,'webp')+') no-repeat','background-size':size});
                }
            });
        });
    }
};
var Vue = require('Vue');
var isVueNext = Vue.version.split('.')[0] === '2';
// console.log(isVueNext);
if (isVueNext) {
    Vue.directive('webp', function(el, binding) {
        update(el, {
            arg: binding.arg,
            value: binding.value
        });
    })
} else {
    Vue.directive('webp', {
        bind: function() {},
        update: function(val, old) {
            update(this.el, {
                arg: this.arg,
                value: val
            });
        },
        unbind: function() {}
    })
}