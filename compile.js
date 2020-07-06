class Compile{
  constructor(vm){
    this.$dom = document.querySelector(vm.$el);
    this.$vm = vm;
    this._inputMap = new WeakMap();
    // 编译
    if(this.$dom){
      //转换dom下的节点树移植到frag
      this.$fragment = this.node2Fragment(this.$dom);

      this.hookLifecycle(vm, 'created');

      // 执行编译
      this.compile(vm, this.$fragment);

      
    console.dir(this.$fragment);
    this.$dom.appendChild(this.$fragment)
    this.hookLifecycle(vm, 'mounted');
    }
  }
  hookLifecycle(vm, type){
    let cb = vm.$option[type];
    cb && cb.call(vm);
  }
  compile(vm, dom){
    const childNodes = dom.childNodes;
    [...childNodes].forEach(node => {
      if(this.isText(node)){
        if(this.isInterpolation(node)){
          const exp = 'text';
          const dir = RegExp.$1;
          this.update(vm, node, exp, dir);
        }
      }else if(this.isElement(node)){
        const attributes = node.attributes;
        [...attributes].forEach(attr => {
          const attrKey = attr.name;
          const dir = attr.value;
          if(attrKey.startsWith('k-')){
            const exp = attrKey.slice(2);
            this.update(vm, node, exp, dir);
            this.formatNodeAttr(node, attrKey);
          }else if(attrKey.startsWith('@')){
            const exp = attrKey.slice(1);
            this.eventsHandler(vm, node, exp, dir);
            this.formatNodeAttr(node, attrKey);
          }
        });
        this.compile(vm, node);
      }
    });
    
  }
  eventsHandler(vm, node, exp, dir){
    const fn = vm.$option.methods[dir];
    if(fn && dir){
      node.addEventListener(exp, fn.bind(vm));
    }
  }
  formatNodeAttr(node, key){
    node.removeAttribute(key);
  }
  isElement(childNode){
    return childNode.nodeType === 1;
  }
  isText(childNode){
    return childNode.nodeType === 3;
  }
  isInterpolation(node){
    return /\{\{(.*)\}\}/.test(node.textContent);
  }
  update(vm, node, exp, dir){
    var dir = dir.trim();
    
    console.log(dir);
    const updateFn = this[exp + 'Update'];
    updateFn && updateFn.call(this, vm, node, dir);
    new Watcher(vm, dir, ()=>{//创建订阅
      console.log('Watcher--',exp);
      updateFn && updateFn.call(this,vm, node, dir);
    })
  }
  modelUpdate(vm, node, dir){
    let dirs = this._inputMap.get(node);

    console.log(1,dirs);
    console.dir(node)
    if(dirs){
      console.log(2,!dirs.includes(dir));
      
      if(!dirs.includes(dir)){
        node.addEventListener('input',(e)=>{
          let val = e.target.value;
          console.log('-------input---',val);
          this.setDirVal(vm, dir, val);
        });
      }
    }else{
      console.log(3,dirs);
      this._inputMap.set(node, [dir]);
      node.addEventListener('input',(e)=>{
        let val = e.target.value;
        console.log('-------input---',val);
        
        // vm.$data[dir] = val;
        this.setDirVal(vm, dir, val);
      });
    }
    
    console.log(7,this._inputMap);
    
    node.value = this.getDirVal(vm, dir);
  }
  htmlUpdate(vm, node, dir){
    node.innerHTML = this.getDirVal(vm, dir);
  }
  setDirVal(vm, dir, val){
    var dir = dir.split('.');//['obj','abc']
    // const val = dir.reduce((pre,next,index,arr)=>{
    //   if(arr[index - 1]){
    //     return pre[arr[index - 1]]
    //   }
    //   return pre;
    // },vm.$data);
    let temp = vm.$data;
    dir.forEach((v,i,arr) => {
      if(i < arr.length - 1 ){
        temp = temp[v];
      }else{
        temp[v] = val;
        console.log(temp[v]);
      }
    });
    
  }
  getDirVal(vm, dir){
    var dir = dir.split('.');
    const val = dir.reduce((pre,next,index,arr)=>{
      if(arr[index+1]){
        return pre[arr[index+1]]
      }
      return pre;
    },vm.$data[dir[0]]);
    return val;
  }
  textUpdate(vm, node, dir){
    node.textContent = this.getDirVal(vm, dir);
    console.log(99,node.textContent);
    
  }
  node2Fragment(dom){ 
    const frag = document.createDocumentFragment();
    let child;
    while(child = dom.firstChild){
      frag.appendChild(child);
    }
    return frag;
  }
}