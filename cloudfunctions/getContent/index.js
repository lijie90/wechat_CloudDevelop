// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require("cheerio"); //进入cheerio模块
let charset = require('superagent-charset'); //解决乱码问题:
let superagent = require('superagent'); //发起请求
charset(superagent);
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let servceUrl = `https://wap.biqiuge.com/${event.url}`
  const result = await superagent
    .get(servceUrl)
    .charset(); //取决于网页的编码方式
  const data = result.text || '';
  const $ = cheerio.load(result.text, { decodeEntities: false });
  let content = $('#chaptercontent').text();
  let contentH = $('#chaptercontent').html().toString().replace(/\s*/g, "").replace(/<br>/g, '\n');
  let sectionName = $('.title').text();
  let catalog = $('#pb_mulu').attr('href');//目录
  let pre = $('#pb_prev').attr('href');
  let next = $('#pb_next').attr('href');

  return {
    content,
    sectionName,
    pre,
    next,
    contentH,
    catalog
  };
}