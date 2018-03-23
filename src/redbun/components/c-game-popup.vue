<!--弹窗组件-->
<template>
  <div class="mi-game-popup" v-if="showAlert">
    <div class="mi-popup-mask" @click="close"></div>
    <div class="mi-dig-wrap">
      <div class="mi-dig-content" v-if="type == 1">
        <h3>活动规则</h3>
        <div class="template">
          <p class="rule-pmt1">活动时间</p>
          <p class="rule-pmt2" v-if="dataTime">2月19日-2月22日</p>
          <p class="rule-pmt2" v-else>2月15日-2月18日</p>
          <p class="rule-pmt1">活动规则</p>
          <p class="rule-pmt2">
            （1）活动期间，用户首次下载并试玩指定游戏即可获得1次抽红包机会，最多3次；<br/>
            （2）开红包获得米币礼券、游戏礼包、实物等奖品。
          </p>
          <p class="rule-pmt1">注意事项</p>
          <p class="rule-pmt2">
            （1）用户首次下载并登录1个指定游戏可抽1次，最多抽3次；<br/>
            （2）活动期间下载游戏时中途取消下载之后，再次下载完成后，将不能获得抽奖机会；<br/>
            （3）每下载一款指定游戏只能获得一次抽奖机会，请勿重复下载；<br/>
            （4）实物奖品需要填写姓名，联系方式，地址，活动期间没有填写相关信息的视为放弃奖励；<br/>
            （5）活动中，一旦发现存在任何形式的刷奖行为，则获奖者奖励自动无效，活动方有权免责拒绝发放对应奖励；<br/>
            （6）如因个人填写错误收货信息导致快递退回，不予补发；<br/>
            （7）实物奖品发放时间为活动结束后的15个工作日；<br/>
            （8）米币礼券将直接发放到账户中。
          </p>
        </div>
      </div>


        <!--奖品列表-->
        <div class="mi-dig-content" v-if="type == 2">
          <h3>奖品列表</h3>
          <div class="template2">
            <div class="rule-content2" v-if="!prizeList[0]">
              <p class="no-data">参与活动<br>可以获得丰厚奖品~</p>
            </div>
            <ul class="rule-content2" v-else>
              <li class="prize-li" v-for="item in prizeList">
                <!--实物：type=1-->
                <div v-if="item.prize_type==1">
                  {{item.prize_name}}
                  <div @click="addressEvent(item.prize_id)" class="btn-add">填写地址</div>
                  <p class="gift-pmt">请在活动结束前填写地址信息</p>
                </div>
                <!--虚拟奖品：type=2-->
                <div v-if="item.prize_type==2">
                  {{item.prize_name}}
                  <div @click="copyCode(item.prize_code)" class="btn-add2">复制</div>
                  <p class="gift-pmt">请点击复制按钮复制礼包码在对应游戏中使用</p>
                </div>
                <!--米币：type=3-->
                <div v-if="item.prize_type==3">
                  {{item.prize_name}}
                  <p class="gift-pmt">奖品已经发放至您的小米账户</p>
                </div>
              </li>
            </ul>
          </div>
        </div>


      <!--抽奖结果窗口1-->
      <div class="mi-dig-content" v-if="type == 3">
        <h3>恭喜获得</h3>
        <div class="template">
          <!--实物-->
          <div class="rule-content2" v-if="superPrize.prize_type==1">
            <p class="no-data2">{{superPrize.prize_name}}</p>
            <div class="address">
              <span @click="addressEvent(superPrize.prize_id)">填写地址</span>
            </div>
          </div>
          <!--礼包码-->
          <div class="rule-content2" v-if="superPrize.prize_type==2">
            <p class="no-data2">{{superPrize.prize_name}}</p>
            <div class="address">
              <span @click="copyCode(superPrize.prize_code)">复制礼包码</span>
            </div>
          </div>
          <!--礼券-->
          <div class="rule-content2" v-if="superPrize.prize_type==3">
            <p class="no-data2">{{superPrize.prize_name}}</p>
            <div class="address">
              <span @click="close">确定</span>
            </div>
          </div>
        </div>
      </div>
      <!--抽奖结果窗口2-->
      <div class="mi-dig-content" v-if="type == 4">
        <h3>很遗憾</h3>
        <div class="template">
          <div class="rule-content2">
            <p class="no-data2">很遗憾<br>您没有抽到奖励~</p>
            <div class="address">
              <span @click="close">确定</span>
            </div>
          </div>

        </div>
      </div>
      <div class="closed" @click="close"></div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'popup',
    data () {
      return {
        type:-1,
        actId: '2018_newYear_redPack',
        showAlert: false,
        prizeList: [0],
        superPrize:{}
      }
    },
    props: ["dataTime"],
    methods: {
      /*
      * 复制礼包码
      * */
      copyCode:function (code){
        var self=this
        self.$store.dispatch('sendStatistic', {fuid: 'down_copy'})
        try {
          clientApi.copy(code+'',function(e){
            self.$store.dispatch('changeTipHint', '复制成功！')
          })
        }catch (e){
          self.$store.dispatch('changeTipHint', '复制失败..')
        }
      },
      /*
       * 填写地址
       * */
      addressEvent: function (id) {
        let self = this
        self.$store.dispatch('sendStatistic', {fuid: 'address_lottery'})
        window.location.href = 'http://static.g.mi.com/pages/address-new/index.html?flag=1&prizeId=' + id + '&actId=' + self.actId + '&db=1&from=' + window.location.href
      },
      /*
       * 显示窗口
       * */
      show (type,data) {
        let self=this
        self.type=type
        if (self.type == 2) self.prizeList = data    //奖品列表
        if(self.type == 3) self.superPrize = data    //抽中奖品

        this.showAlert = true
      },
      /*
       * 关闭窗口
       * */
      close () {
        this.$store.dispatch('sendStatistic', {fuid: 'down_close'})
        this.showAlert = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
  @import "../../common/sass/util.scss";

  .rule-pmt1{
    line-height: px2rem(86);
    font-size: px2rem(40);
    font-weight: 700;
    /*padding: px2rem(30) 0;*/
  }
  .address{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    overflow: hidden;
  }
  .address span{
    display: inline-block;
    padding: px2percent(10, 420) px2percent(20, 420);
    margin-bottom: px2percent(60, 420);
    color: #fff;
    background: #e8a413;
    font-size: px2rem(42);
    border-radius: px2rem(15);
  }
  .rule-pmt{
    padding: 3%;
  }
  .btn-add{
    color: #fff8e8;
    position: absolute;
    top:0;
    right: 0;
    width: px2percent(130, 420);
    transform: translateX(120%);
    background: #f3ac14;
    border: 1px solid #f9c455;
    text-align: center;
    padding: px2percent(15, 420) px2percent(30, 420);
    margin-top: px2percent(33, 420);
    border-radius: px2rem(50);
    overflow: hidden;
  }
  .btn-add2{
    color: #fff8e8;
    position: absolute;
    top:0;
    right: 0;
    width: px2percent(130, 420);
    transform: translateX(120%);
    background: #f3ac14;
    border: 1px solid #f9c455;
    text-align: center;
    padding: px2percent(15, 420) px2percent(30, 420);
    margin-top: px2percent(33, 420);
    border-radius: px2rem(50);
    overflow: hidden;
  }
  .gift-pmt{
    font-size: px2rem(18);
    color: #e8a413;
    text-align: left;
    padding-bottom: px2percent(30, 420);
  }
  .prize-li{
    position: relative;
    width: px2percent(420, 656);
    padding-top: px2percent(30, 656);
    border-bottom: 1px dashed #e8a413;
  }
  .prize-li:nth-child(0){
    padding-top:0;
  }
  .lucky-wrapper .list {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;
  }

  .template {
    height: 75%;
    font-size: px2rem(36);
    line-height: px2rem(64);
    color: #bf7500;
    text-align: left;
    margin: 0 px2percent(20, 656) px2percent(45, 656);
    padding: px2percent(25, 656) px2percent(65, 656);
    border: 1px solid #f9c455;
    border-radius: px2rem(25);
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .template2 {
    height: 75%;
    font-size: px2rem(36);
    line-height: px2rem(46);
    margin: 0 px2percent(20, 656) px2percent(45, 656);
    padding: px2percent(25, 656) px2percent(25, 656);
    border: 1px solid #f9c455;
    border-radius: px2rem(25);
    box-sizing: border-box;
    background: #fff;
    color: #bf7500;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .mi-dig-content h3 {
    font-size: px2rem(54);
    color: #c08023;
    padding: px2percent(40, 656) 0;
    text-align: center;
    margin: 0;
  }

  .mi-game-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }

  .mi-popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .8);
    z-index: 21;
  }

  .mi-dig-wrap {
    width: px2percent(880, 1080);
    padding-top: px2percent(970, 1080);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -65%);
    z-index: 22;
    background: #fff8e8;
    border-radius: px2rem(25);
  }
  .mi-dig-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .rule-content2 {
    font-size: px2rem(36);
    color: #bf7500;
    text-align: left;
  }

  .no-data {
    text-align: center;
    padding-top: 25%;
  }
  .no-data2{
    text-align: center;
    padding-top: 35%;
    font-size: px2rem(50);
  }

  .closed {
    width: px2percent(100, 656);
    padding-top: px2percent(100, 656);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -30%;
  }
  [data-webp="0"] .closed{
    background: url("../assets/img/closed.png") no-repeat;
    background-size: 100% 100%;
  }
  [data-webp="1"] .closed{
    background: url("../assets/webp/closed.webp") no-repeat;
    background-size: 100% 100%;
  }
</style>
