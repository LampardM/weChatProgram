const Utils = {
  formatTime: function (format, sTime) {
    var _date = new Date();
    if (!!sTime) {
      _date = this.parse(sTime);
    }
    var o = {
      "M+": _date.getMonth() + 1, //month
      "d+": _date.getDate(), //day
      "h+": _date.getHours(), //hour
      "m+": _date.getMinutes(), //minute
      "s+": _date.getSeconds(), //second
      "q+": Math.floor((_date.getMonth() + 3) / 3), //quarter
      S: _date.getMilliseconds() //millisecond
    };
    if (!format) {
      format = "yyyy-MM-dd hh:mm:ss";
    }
    if (/(y+)/.test(format))
      format = format.replace(
        RegExp.$1,
        (_date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return format;
  },

  parse: function (date) {
    if (_.isString(date)) {
      date = date.replace(/-/g, "/");
    }

    return new Date(date);
  },
  
  CreateGuid: function () {
    function S1() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(4);
    }
    function newGuid() {
      var guid = "";
      for (var i = 1; i <= 20; i++) {
        guid += S1();
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          guid += "-";
        }
      }
      var num = parseInt(8 * Math.random());
      var date = new Date().getTime() + '';
      guid += date.slice(0, num);
      for (var j = 0; j < 4; j++) {
        guid += S1();
      }
      guid += date.slice(num + 5, 13);
      return guid;
    }
    return newGuid();
  }
};

export default Utils;
