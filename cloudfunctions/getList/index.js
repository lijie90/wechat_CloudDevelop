// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');//http模块
const cheerio = require("cheerio"); //进入cheerio模块
let charset = require('superagent-charset'); //解决乱码问题:
let superagent = require('superagent'); //发起请求
charset(superagent);
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let servceUrl = "https://wap.biqiuge.com/"
  const result = await superagent
     .get(servceUrl)
    .charset('gb2312'); //取决于网页的编码方式
  const data = result.text || '';
  const $ = cheerio.load(result.text);
  let hotList = $('.hot').find('.image');
  let classifyList = $('.block');
  let hotData = [];//热榜
  let classifyData = [];//分类推荐
  for (let i = 0; i < hotList.length;i++){
    let obj = {};
    obj['url'] = $(hotList[i]).find('a').attr('href');
    obj['imgurl'] = $(hotList[i]).find('img').attr('src');
    obj['name'] = $(hotList[i]).find('img').attr('alt');
    obj['autho'] = $(hotList[i]).next().find('dt').find('span').text();
    obj['detail'] = $(hotList[i]).next().find('dd').text();
    hotData.push(obj)
  }
  for (let i = 0; i < classifyList.length; i++) {
    let obj = {};
    let childData = []
    let childDom = $(classifyList[i]).find('.lis').find('li');
    for (let j = 0; j < childDom.length;j++){
      let chilObj = {};
      chilObj['name'] = $(childDom[j]).find('.s2').find('a').text();
      chilObj['url'] = $(childDom[j]).find('.s2').find('a').attr('href');
      chilObj['autho'] = $(childDom[j]).find('.s3').text();
      childData.push(chilObj);
    }
    obj['classifyList'] = $(classifyList[i]).find('h2').text();//类别名称
    // obj['childDom'] = childDom.length;
    obj['data'] = childData;
    classifyData.push(obj)
  }
  return {
    classifyData,
    hotData
  };
}