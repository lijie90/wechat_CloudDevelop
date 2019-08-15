// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require("cheerio"); //进入cheerio模块
let charset = require('superagent-charset'); //解决乱码问题:
let superagent = require('superagent'); //发起请求
charset(superagent);
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {//搜索小说
  let servceUrl = `https://so.biqusoso.com/s.php?ie=utf-8&siteid=biqiuge.com&q=${encodeURI(event.key)}`
  const result = await superagent
    .get(servceUrl)
    .set('Cookie','__guid=256359561.2906808429782885000.1564395789619.881; monitor_count=8')
    .charset('utf-8'); //取决于网页的编码方式search-list
  const $ = cheerio.load(result.text);
  const domData = $('.search-list').find('li');
  let listData = [];
  for(let i = 0;i<domData.length;i++){
    let obj = {};
    obj['bookName'] = $(domData[i]).find('.s2').find('a').text();
    obj['bookUrl'] = $(domData[i]).find('.s2').find('a').attr('href') ? '/book_'+$(domData[i]).find('.s2').find('a').attr('href').split('id/')[1]:'';
    obj['autho'] = $(domData[i]).find('.s4').text();
    listData.push(obj)
  }
  let key = event.key//关键词显示
  return {
    listData,
    key
  };
}