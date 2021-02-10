const fs = require('fs')

// 回调函数 形式
// fs.readFile('./resource/content.txt', (err,data) => {
//   if(err) throw err;
//   console.log(data.toString())
// })

// Promise 形式
let p = new Promise((resolve,reject) => {
  fs.readFile('./resource/content.txt', (err,data) => {
    if(err) reject(err);
    resolve(data)
  })

  // 调用 then
  p.then(value => {
    console.log(value.toString)
  },reason => {
    console.log(reason.toString())
  })
})