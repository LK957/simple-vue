
/* app.use(async (ctx, next) => {
  await next();
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>Hello, koa2!</h1>';
});
app.use(async (ctx, next) => {
  await next();
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>Hello, koa2!</h1>';
}); */


class V{
  constructor(){
    this.useFns = [];
  }
  use(fn){
    this.useFns.push(fn);

    
  }
}
var useFns = [asyncfn1, asyncfn2, asyncfn3, asyncfn4];

compose(useFns);

function compose(fns){
  dispatch(0);
  function dispatch(i){
    var fn = fns[i];
    if(!fn) return Promise.resolve();
    return Promise.resolve(
      fn(function(){
        dispatch(i+1)
      })
    )

    /* function abc(){
      return new Promise((resolve, reject) => {
        resolve();
        // fn(resolve)
        re(i+1);
      })
    }
    fn(abc) */
  }
}


async function asyncfn1(next){
  console.log(1,'asyncfn1');

  await next();

  console.log(1,'asyncfn222');
  return 1;
}
function asyncfn2(next){
  console.log(2,'asyncfn1');
  
  next();
  console.log(2,'asyncfn2222');
  return 2;
}
function asyncfn3(next){
  console.log(3,'asyncfn1');
  next();
  return 3;
}
function asyncfn4(next){
  console.log(4,'asyncfn1');
  next();
  return 4;
}







var arrFn = [fn1, fn2, fn3, fn4];

// var newFn = arrFn.reduce((pre,next)=>{
//   console.log(pre,next);
  
//   return (...args)=>next(pre(...args));
// })
// newFn('lk');
function fn1(param){
  console.log(1 + param);
  return 1;
}
function fn2(param){
  console.log(2 + param);
  return 2;
}
function fn3(param){
  console.log(3 + param);
  return 3;
}
function fn4(param){
  console.log(4 + param);
  return 4;
}