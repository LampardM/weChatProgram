import * as echarts from '../../ec-canvas/echarts';

let chart = null;

function randomData() {
  now = new Date(+now + oneDay);
  value = value + Math.random() * 21 - 10;
  return {
      name: now.toString(),
      value: [
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
          Math.round(value)
      ]
  }
}

var data = [];
var now = +new Date(1997, 9, 3);
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  chart.showLoading();

  canvas.setChart(chart);

  var option = {
    title: {},
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        var date = new Date(params.name);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
          show: true
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true
      }
    },
    series: [{
      name: '模拟数据',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: data
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    }
  },

  onLoad() {},

  refresh() {      
    if(data.length > 0) {
      data.shift();
    }
    for (var i = 0; i < 2; i++) {
      data.push(randomData());
    }

    chart.setOption({
      series: [{
        data: data
      }]
    });

    setTimeout(this.refresh,1000);
  },

  onReady() {
    data = []

    setTimeout(() => {
      chart.hideLoading()
      this.refresh()
    },1000)
  }
});
