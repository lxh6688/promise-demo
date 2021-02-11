//声明构造函数
function Promise(executor){
  this.PromiseState = 'pending'
  this.PromiseResult = null
  this.callback = []

  const self = this

  //resolve 函数
  function resolve(data){
    // 判断状态
    if(self.PromiseState !== 'pending') return;
    // 1. 修改对象的状态 (promiseState)
    self.PromiseState = 'fulfilled' //resolved
    // 2. 设置对象结果值 (promiseResult)
    self.PromiseResult = data
    // 调用成功的回调函数
    self.callback.forEach(item => {
      item.onResolved(data)
    })
  }
  //reject 函数
  function reject(data){
    if(self.PromiseState !== 'pending') return;
    self.PromiseState = 'rejected'
    self.PromiseResult = data
    self.callback.forEach(item => {
      item.onRejected(data)
    })
  }

  try{
    //同步调用 [执行器函数]
    executor(resolve,reject)
  }catch(e){
    // 修改 promise 对象状态为 失败
    reject(e)
  }
}

//添加 then 方法
Promise.prototype.then = function(onResolved, onRejected){
  const self = this
  if(typeof onRejected !== 'function'){
    onRejected = reason => {
      throw reason
    }
  }
  if(typeof onResolved !== 'function'){
    onResolved = value => value
  }
  return new Promise((resolve,reject) => {
    //封装函数
    function callback(type){
      try{
        let result = type(self.PromiseResult)
        if(result instanceof Promise){
          result.then(v => {
            resolve(v)
          }, r => {
            reject(r)
          })
        }else {
          resolve(result)
        }
      }catch(e){
        reject(e)
      }
    }
    if(this.PromiseState === 'fulfilled'){
      callback(onResolved)
    }
    if(this.PromiseState === 'rejected'){
      callback(onRejected)
    }
    //判断 pending 状态
    if(this.PromiseState === 'pending'){
      //保存回调函数
      this.callback.push({
        onResolved:function(){
          callback(onResolved)
        },
        onRejected:function(){
          callback(onRejected)
        }
      })
    }
  })
}

Promise.prototype.catch = function(onRejected){
  return this.then(undefined,onRejected)
}