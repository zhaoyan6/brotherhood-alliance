/**
 * Created by chenlei on 2016/6/29.
 */

;(function ($, util) {
  var txtMap = {
        lbStart: '下载领奖',
        lbDownload: '下载领奖',
        lbPause: '暂停',
        lbContinue: '继续',
        lbWait: '等待',
        lbInstalling: '正在安装',
        lbInstall: '下载领奖',
        lbOpen: '启动',
        lbFail: '抽取奖励'
      },
      channel = '',
  statusMap = {
    'status_key': 'data-status',
    'started': 'started',
    'paused': 'paused',
    'waiting': 'waiting',
    'downloading': 'downloading',
    'installing': 'installing',
    'installed': 'installed',
    'init': 'init',
    'failed': 'failed'
  },
      DOWNLOAD = {
      initialize: function ($obj) {
        // @desc 获取native数据后的回调函数
        // @param data:获得的数据
        function initNativeData (data) {
          if (!data || (!data.length)) {
            return
          }
          let updateProgress = function (progress) {
            var $btn = $(this)
            $btn.find('.btn-txt').text(progress + '%')
            $btn.find('.btn-progress').css({width: progress / 100 * $btn.width() + 'px'})
          }
          var ext_id, $target, curData, packageName, i = 0,
            len = data.length,
            dlItem
          $obj.each(function () {
            $target = $(this)
            ext_id = $target.attr('data-gameid')
            packageName = $target.attr('data-packagename')
            if (i >= len) {
              return false
            }
            curData = data[i]
            if (ext_id != curData.id) return
            i++
            //                    alert(curData);
            dlItem = new DownLoad(ext_id, $target, packageName)
            clientApi.pushItemInDownLoadMap({
              gameId: dlItem.get('gid'),
              packageName: dlItem.get('pkgn'),
              start: dlItem.start,
              pause: dlItem.pause,
              wait: dlItem.wait,
              downloading: dlItem.downloading,
              downloadComplete: dlItem.downloadComplete,
              installComplete: dlItem.installComplete,
              remove: dlItem.remove,
              fail: dlItem.fail,
              ctx: dlItem,
              channel: channel
            },
            function () {

            },
            $target[0])
            var key = statusMap.status_key
            switch (curData.status) {
              case 'start':
                $target.attr(key, statusMap.started).find('.btn-txt').text(txtMap.lbPause)
                break
              case 'pause':
                $target.attr(key, statusMap.paused).find('.btn-txt').text(txtMap.lbContinue)
                break
              case 'wait':
                $target.attr(key, statusMap.waiting).find('.btn-txt').text(txtMap.lbWait)
                break
              case 'downloading':
                $target.attr(key, statusMap.downloading).find('.btn-txt').text(txtMap.lbPause)
                updateProgress.apply($target[0], [curData.progress, curData.current_bytes])
                break
              case 'download_complete':
                $target.attr(key, statusMap.installing).find('.btn-txt').text(txtMap.lbInstalling)
                break
              case 'install_complete':
                // 配置初始化时下载按钮的状态和样式（这是已下载完成的）
                let txt = function () {
                  if (($target.attr('data-receiveStatus') > 0) && ($target.attr('data-redPackStatus') == 1)) {
                    return txtMap.lbFail
                  } else {
                    return txtMap.lbOpen
                  }
                }
                $target.attr(key, statusMap.installed).find('.btn-txt').text(txt)
                $target.addClass('open').removeClass('download-bg')
                break
              case 'remove':
                $target.attr(key, statusMap.init).find('.btn-txt').text(txtMap.lbInstall)
                $target.removeClass('open').removeClass('download-bg')
                $target.find('.btn-progress').css('width', 0)
                break
              default:
                $target.attr(key, statusMap.init).find('.btn-txt').text(txtMap.lbInstall)
                // 移除样式
                $target.removeClass('open').removeClass('download-bg')
                $target.find('.btn-progress').css('width', 0)
                break
            }
            if (curData.status != 'install_complete') {
              $target.addClass('download-bg')
            }
          })
        }
        var list = [],
          item
        // 获得游戏列表
        $obj.each(function () {
          var $this = $(this)
          item = {
            id: $this.data('gameid'),
            packageName: $this.data('packagename'),
            channel: channel
          }
          list.push(item)
        })
        // 获取native的游戏下载状态
        clientApi.initPageByNativeData({
          gameList: list
        }, initNativeData, this)
      },
      downLoad: function ($el) {
        if (!$el) return
        var gameId = $el.data('gameid'), pkg = $el.data('packagename')
        if (!window.JsBridge) {
          window.location.href = 'migamecenter://details?gid=' + gameId + '&channel=' + channel + '&autoinstall=1'// migame://'+gameId;
          return
        }
        // var env = session.env,gcVersion = env.vn||'', uid = session.userInfo.uid;
        let status = $el.attr('data-status') || 'init',
          dlItem = new DownLoad(gameId, $el, pkg, channel),
          params = {
            gameId: gameId,
            packageName: pkg,
            channel: channel
          },
          key = statusMap.status_key
        switch (status) {
          case statusMap.init:
            clientApi.download({
              gameId: dlItem.get('gid'),
              packageName: dlItem.get('pkgn'),
              start: dlItem.start,
              pause: dlItem.pause,
              wait: dlItem.wait,
              downloading: dlItem.downloading,
              downloadComplete: dlItem.downloadComplete,
              installComplete: dlItem.installComplete,
              remove: dlItem.remove,
              fail: dlItem.fail,
              ctx: dlItem,
              channel: channel
            },
            function (e) {
              // $el.attr(key, statusMap.waiting).find('.btn-txt').text(txtMap.lbWait);
              // statistic({
              //    ac:'gamecenter',
              //    type:'download',
              //    uid: uid,
              //    fromlable:'login-draw',
              //    fromid: channel,
              //    curpageid: dlItem.get('gid'),
              //    ver:gcVersion,
              //    trace: 'login-draw-trace'
              // });
            },
            $el)
            break
          case statusMap.waiting:
          case statusMap.started:
          case statusMap.downloading:
            clientApi.downloadPause(params, function (e) {
              $el.attr(key, statusMap.paused).find('.btn-txt').text(txtMap.lbContinue)
            })
            break
          case statusMap.paused:
            clientApi.downloadContinue(params, function (e) {
              $el.attr(key, statusMap.waiting).find('.btn-txt').text(txtMap.lbWait)
              // alert('continue ->'+JSON.stringify(e));
            })
            break
          case statusMap.installing:
            // clientApi.downloadInstall(params);
            break
          case statusMap.installed:
            clientApi.openGame(params, function () {}, $el)
            break
          default:
            break
        }
        if (status != statusMap.installed) {
          $el.addClass('download-bg')
        }
      }
    },

  // 下载类
  DownLoad = function (_id, _$el, _pkgName) {
    this.gid = _id
    this.$el = _$el
    this.pkgn = _pkgName
  }
  DownLoad.prototype = {
    constructor: DownLoad,
    start: function () {
      var txt = txtMap.lbStart
      this.$el.attr(statusMap.status_key, statusMap.started).find('.btn-txt').text(txt)
    },
    pause: function () {
      // 点击后暂停，显示继续下载，再单击显示等待下载（短暂出现），然后显示进度条
      var txt = txtMap.lbContinue
      this.$el.attr(statusMap.status_key, statusMap.paused).find('.btn-txt').text(txt)
    },
    wait: function () {
      var txt = txtMap.lbWait
      this.$el.attr(statusMap.status_key, statusMap.waiting).find('.btn-txt').text(txt)
    },
    downloading: function (progress) {
      this.$el.attr(statusMap.status_key, statusMap.downloading).find('.btn-txt').text(progress + '%')
      this.$el.find('.btn-progress').css({width: progress / 100 * this.$el.width() + 'px'})
    },
    downloadComplete: function () {
      var txt = txtMap.lbInstalling
      this.$el.attr(statusMap.status_key, statusMap.installing).find('.btn-txt').text(txt)
    },
    installComplete: function () {
      let txt = txtMap.lbOpen
      this.$el.attr(statusMap.status_key, statusMap.installed).find('.btn-txt').text(txt)
      this.$el.addClass('open').removeClass('download-bg')
      this.$el.find('.btn-progress').css('width', 0)
    },
    remove: function () {
      var txt = txtMap.lbInstall
      this.$el.attr(statusMap.status_key, statusMap.init).find('.btn-txt').text(txt)
      // 移除样式
      this.$el.removeClass('open').removeClass('download-bg')
      this.$el.find('.btn-progress').css('width', 0)
    },
    fail: function () {
      var txt = txtMap.lbStart,
        that = this
      this.$el.attr(statusMap.status_key, statusMap.failed).find('.btn-txt').text(txt)
      setTimeout(function () {
        that.$el.attr(statusMap.status_key, statusMap.init).find('.btn-txt').text(txtMap.lbInstall)
        // 移除样式
        this.$el.removeClass('open').removeClass('download-bg')
        this.$el.find('.btn-progress').css('width', 0)
      },
      1000)
    },
    process: function (msg) {},
    get: function (name) {
      if (name in this) {
        return this[name]
      }
      return null
    },
    set: function (name, val) {
      if (name in this) {
        this[name] = val
      }
    }
  }

  if (typeof define === 'function' && define.amd) {
    // AMD define
    define([], function () {
      return DOWNLOAD
    })
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOWNLOAD
  } else {
    window.DOWNLOAD = DOWNLOAD
  }
})($, util)
