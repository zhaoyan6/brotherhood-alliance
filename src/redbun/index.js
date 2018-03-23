/**
 * Created by zy on 18/3/21.
*/
import Vue from 'vue'
import store from './vuex/store.js'
var App = Vue.extend(require('./app.vue'));


var app = new Vue({
    store,
    render:h=>h(App)
}).$mount('#main');


document.addEventListener('JsBridgeReady', function () {
    var session= clientApi.getSessionData();
    app.$store.dispatch('changeSessionInfo',session);
});
//刷新的时候需要重新请求数据
document.addEventListener('JsBridgeRefresh',function(){
    var session= clientApi.getSessionData();
    app.$store.dispatch('changeSessionInfo',session);
});