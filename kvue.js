class Kvue{
  constructor(option){
    this.$option = option;
    this.$el = option.el;
    this.$data = option.data;
    
    this.proxyData(this.$data);
    this.observe(this.$data);

    const vm = this;
    new Compile(vm)
  }
  proxyData(data){
    Object.keys(data).forEach(key =>{
      Object.defineProperty(this,key,{
        get(){
          return data[key];
        },
        set(newVal){
          data[key] = newVal;
        }

      })
    })
  }
  observe(obj){
    
    if(!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach(key => {
      this.defineReactive(obj, key, obj[key]);
    });
  }
  //数据响应化
  defineReactive(obj, key, val){
    console.log('-------8-------',obj, key, val);
    const vm = this;
    this.observe(val);
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      get(){
        Dep.target && dep.addDep(Dep.target);//收集订阅
        console.log('get',val,dep.deps);
        return val;
      },
      set(newVal){
        if(newVal === val) return;
        if(typeof val == 'object'){
          console.log(newVal);
          
          vm.observe(newVal);
        }
        console.log('set',val,newVal,dep);
        val = newVal;
        dep.notify();// 发布通知
      }
    });
  }
}

class Dep{
  constructor(){
    this.deps = [];
  }
  addDep(dep){
    this.deps.push(dep);
  }
  notify(){
    this.deps.forEach(dep => {
      dep.update();
    })
  }
}
class Watcher{
  constructor(vm, dir, callback){
    this._callback = callback;
    this._vm = vm;
    this._dir = dir;// 'obj','obj.abc'
    this._dispatch();
  }
  _dispatch(){
    Dep.target = this;
    // this._vm.$data[this._dir];//触发get，收集创建的订阅
    this.getDirVal(this._vm, this._dir)
    Dep.target = null;
  }
  getDirVal(vm, dir){
    var dir = dir.split('.');
    let temp = vm.$data;
    dir.forEach(v => {
      
      temp = temp[v];
    });
    console.log(999999,temp);
  }
  update(){
    this._callback();
  }
}