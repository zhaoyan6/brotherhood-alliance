/**
 * Created by zy on 2018/3/21.
 */
const testFlag = 0
/* cdnDomain */
export const cdnDomain = 'http://i5.market.mi-img.com/'
/* 红包列表 */
export const redPkgIndex = {
    redPkgV3: testFlag ? 'http://stag.game.xiaomi.com/act/game/newyear/redPackListV3' : 'http://game.xiaomi.com/act/game/newyear/redPackListV3',
    redPkgNormal: testFlag ? 'http://stag.game.xiaomi.com/act/game/newyear/redPackList' : 'http://game.xiaomi.com/act/game/newyear/redPackList'
}
/* 红包奖品信息 */
export const prizeList = testFlag ? 'http://stag.game.xiaomi.com/act/game/newyear/prizeList' : 'http://game.xiaomi.com/act/game/newyear/prizeList'
/* 红包领取奖品 */
export const postPkg = testFlag ? 'http://stag.game.xiaomi.com/act/game/newyear/getRedPack' : 'http://game.xiaomi.com/act/game/newyear/getRedPack'