<template>
  <div class="mi-loading" id="loading" v-if="hideLoading">
    <div class="acer">
      <div class="stars stars0"></div>
      <div class="stars stars1"></div>
      <div class="stars stars2"></div>
      <div class="stars stars3"></div>
      <div class="stars stars4"></div>
      <div class="stars stars5"></div>
      <div class="loading-nbr">{{nbr}}%</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mi-footer',
    props: ['loading'],
    data () {
      return {
        hideLoading: 1,
        nbr: 0
      }
    },
    created () {
      let self = this
      let time1 = setInterval(function () {
        if (self.loading == 1) {
          if (self.nbr > 75) {
          } else {
              self.nbr = self.nbr + Math.ceil(Math.random()*10)
          }
        } else {
          if((self.nbr + 13) > 100){
            self.nbr = 100
            clearInterval(time1);
            let tm2 = setTimeout(function () {
              self.hideLoading = 0
              clearTimeout(tm2)
            },100)
          }else {
              self.nbr = self.nbr + 13
          }
        }
      }, 100)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
  @import "../../common/sass/util.scss";

  .loading-nbr {
    width: 100%;
    position: absolute;
    bottom: -50%;
    left: 0;
    font-size: px2rem(40);
    color: #ffc806;
    text-align: center;
  }

  .stars {
    position: absolute;
    width: px2percent(30, 240);
    padding-top: px2percent(30, 240);
    /*background: url("../assets/imgs/loading/loading_shan.png") no-repeat center;*/
    /*background-size: 100% 100%;*/
  }

  [data-webp="0"] .stars {
    background: url("../assets/img/loading_shan.png") no-repeat center;
    background-size: 100% 100%;
  }

  [data-webp="1"] .stars {
    background: url("../assets/webp/loading_shan.webp") no-repeat center;
    background-size: 100% 100%;
  }

  .stars0 {
    top: 0;
    left: -7%;
    animation: drop1anim 1s ease-in-out infinite;
  }

  .stars1 {
    top: 0;
    right: -5%;
    animation: drop1anim 1s ease-in-out infinite;
    animation-delay: 0.1s
  }

  .stars2 {
    top: -13%;
    left: 50%;
    animation: drop1anim 1s ease-in-out infinite;
    animation-delay: 0.3s
  }

  .stars3 {
    bottom: 0;
    left: 30%;
    animation: drop1anim 1s ease-in-out infinite;
    animation-delay: 0.6s
  }

  .stars4 {
    bottom: 3%;
    left: 0;
    animation: drop1anim 1s ease-in-out infinite;
    animation-delay: 0.9s
  }

  .stars5 {
    bottom: 20%;
    right: -15%;
    animation: drop1anim 1s ease-in-out infinite;
    animation-delay: 1.1s
  }

  .mi-loading {
    background: #af1c24;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
  }

  .acer {
    position: relative;
    width: px2percent(240, 1080);
    padding-top: px2percent(240, 1080);
    /*background: url("../assets/imgs/loading/loading.png") no-repeat center;*/
    /*background-size: 100% 100%;*/
    margin: px2percent(670, 1080) 0 0 px2percent(420, 1080);
  }

  [data-webp="0"] .acer {
    background: url("../assets/img/loading.png") no-repeat center;
    background-size: 100% 100%;
  }

  [data-webp="1"] .acer {
    background: url("../assets/webp/loading.webp") no-repeat center;
    background-size: 100% 100%;
  }

  @keyframes drop1anim {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0);
    }
  }

  @keyframes drop2anim {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0);
    }
  }
</style>
