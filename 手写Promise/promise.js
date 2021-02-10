//声明构造函数
function Promise(executor){
  this.PromiseState = 'pending'
  this.PromiseResult = null

  const self = this

  //resolve 函数
  function resolve(data){
    // 1. 修改对象的状态 (promiseState)
    self.PromiseState = 'fulfilled' //resolved
    // 2. 设置对象结果值 (promiseResult)
    self.PromiseResult = data
  }
  //reject 函数
  function reject(data){
    self.PromiseState = 'rejected'
    self.PromiseResult = data
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
Promise.prototype.then = function(onResolved, onrejected){

}