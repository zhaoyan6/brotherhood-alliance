<!--
    @Description: 组件统计tip
    @Author:levin
-->

<template>
    <div class="tip_wrapper">
        <!--<transition name="fade" mode="out-in" appear>-->
            <p :class="['c-tip-info', $store.state.tipHint ? 'active' : '']">
                {{$store.state.tipHint}}
            </p>
        <!--</transition>-->
    </div>

</template>

<script type="text/ecmascript-6">
    module.exports = {
    };
</script>
<style lang="sass" scoped>
    @import'../../sass/util.scss';
    /*.fade-enter-active, .fade-leave-active {
        transition: all 2.0s ease;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
    }
    .fade-enter, .fade-leave-active {
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
    }*/
    .c-tip-info {
        position:fixed;
        bottom:5%;
        opacity:0;
        left: 50%;
        z-index:99999;
        color:#ffffff;
        background-color:rgba(0,0,0,0.8);
        font-size: px2rem(40px);
        padding:4% 3%;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        min-width: 30%;
        text-align: center;
        -webkit-transform:translate(-50%,-50%);
        transform:translate(-50%,-50%);
    }
    .c-tip-info.active{
        bottom:12%;
        opacity:1;
        transition: all .2s;
        -webkit-transition: all .2s;
    }
</style>
