<!--***************************** template start ******************************-->
<template>
    <div id="app">
        <div class="views">
            <div class="down-page">
                <section :class="bgImgFlag == 0?'down-banner':'down-banner2'">
                    <span class="rule" @click="showRule">活动规则</span>
                    <div class="notices2" v-if="luckListData.length>0">
                        <ul class="notice-list" id="notice_list2">
                            <li class="notice2" v-for="(item, index) in luckListData" :data-index="index"
                                v-if="index < 10">
                                <p>恭喜{{item.uid}}</p>
                                <p>获得{{item.prize}}</p>
                            </li>
                        </ul>
                    </div>

                </section>
                <div class="mi-down-pmt" v-if="gameList[0]">
                    还有<span>{{residueNum}}次</span>领红包机会
                </div>
                <div class="game-wrapper" v-if="gameList[0]">
                    <div class="mi-down-items">
                        <div class="down-item" v-for="game in gameList">
                            <div class="down-game">
                                <div class="down-game-wrap">
                                    <img :src="getImgUrl(game.icon)"/>
                                </div>
                                <p class="down-game-title">{{game.gameName}}</p>
                                <div class="down-btn" :data-redPackStatus="game.redPackStatus"
                                     :data-receiveStatus="residueNum" :data-subActId="game.subActId"
                                     :data-gameid="game.gameId" :data-packagename="game.packageName" @click="download">
                                    <span class="btn-progress"></span>
                                    <span class="btn-txt">下载领取</span>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="down-item2" v-if="!gameList[0]">活动未在进行中...</div>
                <div class="mi-down-process"></div>
                <div class="mi-prize-list">
                    <div class="mi-prize-title">活动奖品</div>
                    <div class="mi-prize-items"></div>
                </div>

                <div class="mi-prize-btn" @click="getPrizeList">
                    已领取的奖品
                </div>
                <gamePopup ref="popupAlert" :dataTime="bgImgFlag"></gamePopup>
                <!--<loading :loading="loading"></loading>-->
            </div>
        </div>
        <tipCpt></tipCpt>
    </div>
</template>
<!--***************************** template end ******************************-->


<!--***************************** javascript start ******************************-->
<script>
    import { cdnDomain, redPkgIndex, prizeList, postPkg } from './assets/js/config'
    import gamePopup from './components/c-game-popup.vue'
    import loading from './components/c-loading2.vue'
    import tipCpt from './components/c-tip-cpt.vue'
    let dl = require('./assets/js/downRed.js')
    let fx = require('./assets/js/fx.js')
    export default {
        data: function () {
            return {
                bgImgFlag: 0,
                winList: {
                    type: Array,
                    default: []
                },
                loading: 1,
                luckListData: [],   //幸运中奖者
                gameList: [],
                residueNum: -1,    // 抽奖次数
                popType: 0,
                btnFlag: 0,
                errMsg: {
                    err1: '出错啦！请稍后重试',
                    err2: '请在小米游戏中心打开',
                    err3: '您未登录小米账号，无法参与活动',
                },
                showLuckUser: 0
            }
        },
        components: {
            gamePopup,
            loading,
            tipCpt
        },
        methods: {
            /*
             * 更新list数据
             * */
            luckListInfo: function (luckList) {
                var self = this;
                if (self.showLuckUse) {
                    return
                }
                self.showLuckUse = 1
                self.luckListData = luckList

                /*===================test=================*/
                self.luckListData = [{uid: 1234, prize: '1个小媳妇'},
                    {uid: 2234, prize: '2个小媳妇'},
                    {uid: 3234, prize: '3个小媳妇'},
                    {uid: 4234, prize: '4个小媳妇'},
                    {uid: '再来一次', prize: 'n个小媳妇'},]

                /*====================end==================*/

                function move() {
                    let notice = $('.notices2'), hd = notice.find('.notice2').eq(0).height(), $ul = $('#notice_list2')
                    notice.height(hd * 3 + 3)
                    $ul.animate({
                        translate3d: '0, -' + (hd + 1) + 'px,0'
                    }, 1000, 'linear', function () {
                        $ul.css('transform', 'translate3d(0,0,0)').find('.notice2').eq(0).appendTo(this);
                        setTimeout(function () {
                            move();
                        }, 2000)
                    })
                }

                setTimeout(function () {
                    move();
                }, 500)
            },
            /*
             * @description 显示规则
             * */
            showRule () {
                this.$store.dispatch('sendStatistic', {fuid: 'down_showRule'});
                this.$refs.popupAlert.show(1, '')
            },
            /*
             * @description 处理图片
             * @params url 图片地址
             * */
            getImgUrl (url) {
                return cdnDomain + 'thumbnail/webp/w200/' + url
            },
            /*
             * V3接口获取数据
             * */
            getV3DownData () {
                let self = this
                /*=====================test==============================*/
                var resp = {
                    code: 200,
                    residueNum: 1, //抽奖次数
                    gameList: [    //游戏列表
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        },
                        {
                            gameName: '率土之滨',
                            icon: 'http://file.market.xiaomi.com/thumbnail/jpeg/l120/AppStore/0b56b49bed6a30de751cc5d09a976a7f58e41b416',
                            subActId: '123',
                            packageName: 'saa',
                            redPackStatus: 1
                        }
                    ],
                    luckList: []
                }
                if (resp.code == 200) {
                    self.dealFuc(resp)
                    self.luckListInfo(resp.luckList)
                } else if (resp.code == 205) {
                    self.loading = 0
                    self.$store.dispatch('changeTipHint', resp.msg)   // 活动未进行
                } else {

                }
                return;
                /*==========================end========================*/

                try {
                    clientApi.nativeRequest({
                        url: redPkgIndex.redPkgV3,
                        secertKey: '',
                        type: 'v3'
                    }, function (resp) {
                        if (resp.code == 200) {
                            self.dealFuc(resp)
                            self.luckListInfo(resp.luckList)
                        } else if (resp.code == 205) {
                            self.loading = 0
                            self.$store.dispatch('changeTipHint', resp.msg)   // 活动未进行
                        } else {

                        }
                    })
                } catch (e) {
                }
            },
//            /*
//             * @description 普通接口获取数据
//             * */
//            getDownData () {
//                let self = this
//                this.$http.get(redPkgIndex.redPkgNormal).then(function (response) {
//                            self.dealFuc(response.data)
//                        })
//            },
            /*
             * @description 获取接口数据
             * @params dt 接口中返回的数据
             * */
            dealFuc (dt) {
                var self = this
                this.residueNum = dt.residueNum
                this.gameList = dt.gameList;
                this.$nextTick(function () {
                    window.clientApi && dl.initialize($('.down-btn'))
                })
                self.loading = 0
            },
            /*
             * @description 游戏下载或抽奖
             * @params
             * */
            download (e) {
                let self = this,
                        gameId = $(e.currentTarget).attr('data-gameid'),
                        subActId = $(e.currentTarget).attr('data-subActId'),
                        textFlag = $(e.currentTarget).find('.btn-txt').text(),
                        status = $(e.currentTarget).attr('data-status');
                if (status == 'installed' && self.residueNum > 0 && textFlag != '启动') {       // 必须是 1未抽奖按钮，2领奖次数大于0，3已安装状态

                    if (!self.$store.getters.getToken) {
                        try {  //是否登录
                            clientApi.reinstate(2, window.location.href)
                        } catch (e) {
                            self.$store.dispatch('changeTipHint', self.errMsg.err3)
                        }
                        return
                    }
                    if (self.btnFlag) return
                    self.btnFlag = 1
                    self.$store.dispatch('sendStatistic', {fuid: 'down_getPrize'});
                    try {
                        clientApi.nativeRequest({
                            url: postPkg,
                            secertKey: '',
                            type: 'v3',
                            param: {
                                gameId: gameId,
                                subActId: subActId
                            }
                        }, function (_data) {
//            alert('getPrize::' + JSON.stringify(_data))
                            /* test */
//            _data = {
//              code: 200,
//              result: {
//                prize_type: 3,
//                prize_name: '小米平衡车',
//                prize_id: 123112,
//                prize_code: 18211190105
//              }
//            }
                            /* end */
                            if (_data.code == 200) {
                                self.getV3DownData()     //矫正页面数据，gameList重新排序，更新按钮状态
                                self.$refs.popupAlert.show(3, _data)  // 抽奖结果
                            } else if (_data.code == 205) {
                                self.$refs.popupAlert.show(4, '')  // 抽奖结果
                            } else {
                                self.$store.dispatch('changeTipHint', self.errMsg.err1)   // tip参数错误
                            }
                            self.btnFlag = 0
                        })
                    } catch (e) {
                        self.$store.dispatch('changeTipHint', self.errMsg.err2)   // 请在游戏中心打开
                        self.btnFlag = 0
                    }
                } else {
                    self.$store.dispatch('sendStatistic', {fuid: 'down_down-' + gameId});
                    dl.downLoad($(e.currentTarget))
                }
            },
            /*
             * @description 获取我的奖品
             * @params e 当前event
             * */
            getPrizeList () {
                let self = this

                /* ===================test ======================*/
                let _data = {
                    prizeList: [
                        {prize_type: 1, prize_name: '小米MIX2', prize_id: 123121},
                        {prize_type: 3, prize_name: '2000米币'},
                        {prize_type: 2, prize_name: '剑侠世界大礼包', prize_code: 89128939129},
                        {prize_type: 1, prize_name: '50元京东卡', prize_id: 123121},
                        {prize_type: 1, prize_name: '小媳妇一个', prize_id: 123121}
                    ]
                }
                self.$refs.popupAlert.show(2, _data.prizeList)
                return
                /* =================end =========================*/


                if (!self.$store.getters.getToken) {
                    try {
                        clientApi.reinstate(2, window.location.href)
                    } catch (e) {
                        self.$store.dispatch('changeTipHint', self.errMsg.err3)
                    }
                    return
                }

                if (self.btnFlag) return
                self.btnFlag = 1
                self.$store.dispatch('sendStatistic', {fuid: 'down_getPrizeList'});
                try {
                    clientApi.nativeRequest({
                        url: prizeList,
                        secertKey: '',
                        type: 'v3',
                        param: {}
                    }, function (_data) {
//          console.log(JSON.stringify(_data))
                        if (_data.code == 200) {
                            /* test */
                            let _data = {
                                prizeList: [
                                    {prize_type: 1, prize_name: '小米MIX2', prize_id: 123121},
                                    {prize_type: 3, prize_name: '2000米币'},
                                    {prize_type: 2, prize_name: '剑侠世界大礼包', prize_code: 89128939129},
                                    {prize_type: 1, prize_name: '50元京东卡', prize_id: 123121}
                                ]
                            }
                            /* end */
                            self.$refs.popupAlert.show(2, _data.prizeList)
                        } else {
                            self.$store.dispatch('changeTipHint', self.errMsg.err1)   // tip参数错误
                        }
                        self.btnFlag = 0
                    })
                } catch (e) {
                    self.btnFlag = 0
                    self.$store.dispatch('changeTipHint', self.errMsg.err2)   // 请在游戏中心打开
                }
            }
        },
        created: function () {
            this.bgImgFlag = 1
            this.$store.dispatch('sendStatistic', {fuid: 'down_showed'});
            this.getV3DownData()
        },
        watch: {
            '$store.state.session': function () {
                this.getV3DownData()
                this.$store.dispatch('sendStatistic', {fuid: 'down_showed'});
            }
        }
    };
</script>
<!--***************************** javascript end ******************************-->


<!--***************************** css start ******************************-->

<style lang="sass">
    @import '../common/sass/util.scss';
    @import "../common/sass/base.scss";

    [data-webp="0"] body {
        background: #ffa80b;
        background-size: 30% auto;
    }

    [data-webp="1"] body {
        background: #ffa80b;
        background-size: 30% auto;
    }

    #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .views {
        height: 100%;
        padding-bottom: px2percent(140, 1080);
        overflow-x: hidden;
    }

    .down-banner {
        width: 100%;
        padding-top: px2percent(600, 1080);
        position: relative;
    }

    [data-webp="0"] .down-banner {
        background: url("./assets/img/mi-down-banner.png");
        background-size: 100% 100%;
    }

    [data-webp="1"] .down-banner {
        background: url("./assets/webp/mi-down-banner.webp");
        background-size: 100% 100%;
    }

    .down-banner2 {
        width: 100%;
        padding-top: px2percent(600, 1080);
        position: relative;
    }

    [data-webp="0"] .down-banner2 {
        background: url("./assets/img/mi-down-banner2.png");
        background-size: 100% 100%;
    }

    [data-webp="1"] .down-banner2 {
        background: url("./assets/webp/mi-down-banner2.webp");
        background-size: 100% 100%;
    }

    .notices2 {
        width: px2percent(280, 1080);
        position: absolute;
        left: px2percent(20, 1080);
        top: 0;
        margin-top: px2percent(220, 1080);
        height: 0;
        overflow: hidden;
    }

    .notice2 {
        text-align: left;
        color: #fff;
        font-size: px2rem(30);
        padding: px2rem(10) px2rem(20) px2rem(10) px2rem(35);
        margin: 1px 0;
        background: rgba(0, 0, 0, 0.7);
        border-radius: px2rem(55);
    }

    .notice2 p {
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .notice-list {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .rule {
        font-size: px2rem(40);
        color: #fff;
        top: px2percent(45, 600);
        right: px2percent(45, 1080);
        position: absolute;
        z-index: 2;
        border-bottom: 1px solid #fff;
    }

    .mi-down-pmt {
        font-size: px2rem(36);
        color: #fff;
        padding: px2percent(40, 1080) 0 px2percent(40, 1080);
        text-align: center;

    span {
        color: #fefb20;
    }

    }
    .game-wrapper {
        width: 100%;
        overflow-y: hidden;
        overflow-x: auto;
    }

    .mi-down-items {
        display: flex;
        flex-flow: row wrap;
        width: px2percent(4745, 1080);

    }

    .down-item {
        width: px2percent(390, 4745);
        padding-top: px2percent(524, 4745);
        /*background: url("../assets/imgs/down/mi-game-bg.png");*/
        /*background-size: 100% 100%;*/
        position: relative;
        margin-left: px2percent(40, 4745);
    }

    .down-item2 {
        width: 100%;
        text-align: center;
        font-size: px2rem(32);
        margin: 10% 0;
        color: #fff;
        line-height: px2rem(64);
    }

    [data-webp="0"] .down-item {
        background: url("./assets/img/mi-game-bg.png");
        background-size: 100% 100%;
    }

    [data-webp="1"] .down-item {
        background: url("./assets/webp/mi-game-bg.webp");
        background-size: 100% 100%;
    }

    .down-game {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        text-align: center;
        color: #fff;
        padding: px2percent(60, 393) px2percent(40, 393);
        box-sizing: border-box;
    }

    .down-game-wrap {
        width: px2percent(170, 353);
        padding-top: px2percent(170, 353);
        /*background-color: #e5e5e5;*/
        margin: 0 auto;
        position: relative;

    img {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 5px;
    }

    }
    .down-game-title {
        font-size: px2rem(46);
        width: 100%;
        padding: px2percent(60, 393) 0;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .down-game-hint {
        font-size: px2rem(36);
        width: 100%;
        padding-top: px2percent(24, 393);
    }

    .down-btn {
        background-color: #ffcd1f;
        font-size: px2rem(40);
        width: 100%;
        border-radius: px2rem(60);
        line-height: px2rem(100);
        margin: px2percent(20, 390) px2percent(35, 390) 0;
        position: relative;
        color: #fff;
        overflow: hidden;
        box-sizing: border-box;
    }

    .btn-txt {
        position: relative;
        z-index: 5;
        color: #e82c31;
    }

    .btn-txt2 {
        position: relative;
        z-index: 5;
        color: #fff;
    }

    .btn-progress {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background-color: rgba(243, 53, 52, 0.35);
        z-index: 4;
        /*border-radius: 60px;*/
    }

    .mi-down-process {
        width: px2percent(1034, 1080);
        padding-top: px2percent(170, 1080);
        /*background: url("../assets/imgs/down/mi-down-lc.png") no-repeat;*/
        /*background-size: 100% 100%;*/
        margin: px2percent(40, 1080) auto 0;
    }

    [data-webp="0"] .mi-down-process {
        background: url("./assets/img/mi-down-lc.png") no-repeat;
        background-size: 100% 100%;
    }

    [data-webp="1"] .mi-down-process {
        background: url("./assets/webp/mi-down-lc.webp") no-repeat;
        background-size: 100% 100%;
    }

    .mi-prize-btn {
        font-size: px2rem(46);
        color: #fff;
        text-decoration: underline;
        text-align: center;
        margin: px2percent(60, 1080) 0;
    }

    .mi-prize-list {
        width: px2percent(1054, 1080);
        margin: px2percent(40, 1080) auto 0;
        background-color: #fef8e8;
        text-align: center;
        padding: px2percent(35, 1054);
        box-sizing: border-box;
        border-radius: 6px;
        color: #fff;
    }

    .mi-prize-title {
        font-size: px2rem(40);
        padding-bottom: px2percent(35, 1054);
        color: #be7f35;
    }

    .mi-prize-items {
        width: 100%;
        padding-top: px2percent(511, 1054);
        /*background: url("../assets/imgs/down/mi-gift1.png") no-repeat;*/
        /*background-size: 100% 100%;*/
        /*margin: 0 auto px2percent(25,1054) auto;*/
    }

    [data-webp="0"] .mi-prize-items:nth-child(2) {
        background: url("./assets/img/mi-gift1.png") no-repeat;
        background-size: 100% auto;
    }

    [data-webp="1"] .mi-prize-items:nth-child(2) {
        background: url("./assets/webp/mi-gift1.webp") no-repeat;
        background-size: 100% auto;
    }

    .mi-prize-items:nth-child(3) {
        /*background: url("../assets/imgs/down/mi-gift2.png") no-repeat;*/
        /*background-size: 100% 100%;*/
        margin: 0 auto;
    }

    [data-webp="0"] .mi-prize-items:nth-child(3) {
        background: url("./assets/img/mi-gift2.png") no-repeat;
        background-size: 100% auto;
    }

    [data-webp="1"] .mi-prize-items:nth-child(3) {
        background: url("./assets/webp/mi-gift2.webp") no-repeat;
        background-size: 100% auto;
    }

</style>
<!--***************************** css end ******************************-->

