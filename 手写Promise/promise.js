// //声明构造函数
// function Promise(executor){
//   this.PromiseState = 'pending'
//   this.PromiseResult = null
//   this.callback = []

//   const self = this

//   //resolve 函数
//   function resolve(data){
//     // 判断状态
//     if(self.PromiseState !== 'pending') return;
//     // 1. 修改对象的状态 (promiseState)
//     self.PromiseState = 'fulfilled' //resolved
//     // 2. 设置对象结果值 (promiseResult)
//     self.PromiseResult = data
//     // 调用成功的回调函数
//     setTimeout(() => {
//       self.callback.forEach(item => {
//         item.onResolved(data)
//       })
//     })
//   }
//   //reject 函数
//   function reject(data){
//     if(self.PromiseState !== 'pending') return;
//     self.PromiseState = 'rejected'
//     self.PromiseResult = data
//     setTimeout(() => {
//       self.callback.forEach(item => {
//         item.onRejected(data)
//       })
//     })
//   }

//   try{
//     //同步调用 [执行器函数]
//     executor(resolve,reject)
//   }catch(e){
//     // 修改 promise 对象状态为 失败
//     reject(e)
//   }
// }

// //添加 then 方法
// Promise.prototype.then = function(onResolved, onRejected){
//   const self = this
//   if(typeof onRejected !== 'function'){
//     onRejected = reason => {
//       throw reason
//     }
//   }
//   if(typeof onResolved !== 'function'){
//     onResolved = value => value
//   }
//   return new Promise((resolve,reject) => {
//     //封装函数
//     function callback(type){
//       try{
//         let result = type(self.PromiseResult)
//         if(result instanceof Promise){
//           result.then(v => {
//             resolve(v)
//           }, r => {
//             reject(r)
//           })
//         }else {
//           resolve(result)
//         }
//       }catch(e){
//         reject(e)
//       }
//     }
//     if(this.PromiseState === 'fulfilled'){
//       setTimeout(() => {
//         callback(onResolved)
//       })
//     }
//     if(this.PromiseState === 'rejected'){
//       setTimeout(() => {
//         callback(onRejected)
//       })
//     }
//     //判断 pending 状态
//     if(this.PromiseState === 'pending'){
//       //保存回调函数
//       this.callback.push({
//         onResolved:function(){
//           callback(onResolved)
//         },
//         onRejected:function(){
//           callback(onRejected)
//         }
//       })
//     }
//   })
// }

// //catch 方法
// Promise.prototype.catch = function(onRejected){
//   return this.then(undefined,onRejected)
// }

// //resolve 方法
// Promise.resolve = function(value){
//   return new Promise((resolve,reject) => {
//     if(value instanceof Promise){
//       value.then(v => {
//         resolve(v)
//       }, r => {
//         reject(r)
//       })
//     }else {
//       resolve(value)
//     }
//   })
// }

// //reject 方法
// Promise.reject = function(reason){
//   return new Promise((resolve,reject) => {
//     reject(reason)
//   })
// }

// //all 方法
// Promise.all = function(promise){
//   return new Promise((resolve,reject) => {
//     let count = 0
//     let arr = []
//     for(let i = 0;i<promise.length;i++){
//       promise[i].then(v => {
//         count++
//         arr[i] = v
//         if(count === promise.length){
//           resolve(arr)
//         }
//       }, r => {
//         reject(r)
//       })
//     }
//   })
// }

// //race 方法
// Promise.race = function(promise){
//   return new Promise((resolve,reject) => {
//     for(let i = 0;i<promise.length;i++){
//       promise[i].then(v => {
//         resolve(v)
//       }, r => {
//         reject(r)
//       })
//     }
//   })
// }

class Promise{
  //构造方法
  constructor(executor){
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
      setTimeout(() => {
        self.callback.forEach(item => {
          item.onResolved(data)
        })
      })
    }
    //reject 函数
    function reject(data){
      if(self.PromiseState !== 'pending') return;
      self.PromiseState = 'rejected'
      self.PromiseResult = data
      setTimeout(() => {
        self.callback.forEach(item => {
          item.onRejected(data)
        })
      })
    }

    try{
      //同步调用『执行器函数』
      executor(resolve, reject);
    }catch(e){
        //修改 promise 对象状态为『失败』
        reject(e);
    }
  }

  //then
  then(onResolved,onRejected){
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
        setTimeout(() => {
          callback(onResolved)
        })
      }
      if(this.PromiseState === 'rejected'){
        setTimeout(() => {
          callback(onRejected)
        })
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

  //catch
  catch(onRejected){
    return this.then(undefined,onRejected)
  }

  //resolve
  static resolve(value){
    return new Promise((resolve,reject) => {
      if(value instanceof Promise){
        value.then(v => {
          resolve(v)
        }, r => {
          reject(r)
        })
      }else {
        resolve(value)
      }
    })
  }

  //reject
  static reject(reason){
    return new Promise((resolve,reject) => {
      reject(reason)
    })
  }

  //all
  static all(promises){
    return new Promise((resolve,reject) => {
      let count = 0
      let arr = []
      for(let i = 0;i<promises.length;i++){
        promises[i].then(v => {
          count++
          arr[i] = v
          if(count === promises.length){
            resolve(arr)
          }
        }, r => {
          reject(r)
        })
      }
    })
  }

  //race
  static race(promises){
    return new Promise((resolve,reject) => {
      for(let i = 0;i<promises.length;i++){
        promises[i].then(v => {
          resolve(v)
        }, r => {
          reject(r)
        })
      }
    })
  }
}