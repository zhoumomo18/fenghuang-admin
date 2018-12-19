<template>
<div class="table">
    <div class="table-title">
        <div class="emu-one">菜单</div>
        <div class="emu-two">子菜单</div>
        <div class="emu-three">权限范围</div>
    </div>
    <div>
        <div class="table-row" v-for="(list,Listindex) in topList" :key="list.id"><span class="line-title">{{list.name}}</span>
             <div class="table-line-one">
                  <div class="table-line-two" v-for="(item,itemIndex) in list.btnList" :key="item.id"><div class="span">{{item.name}}</div> 
                    
                    <label class="allCheck" v-if="item.allButtonList.length>0">全选 
                            <input type="checkbox" v-model="AllCheck">
                        </label>

                    <div class="table-line-three" v-for="(li,liIndex) in item.allButtonList" :key="li.id">
                        <label @click="clickBtn(li.name,itemIndex,li.menuButtonId)" class="sonCheck">{{li.name}}{{li.check}}
                        <input type="checkbox" v-model="li.check"
                        ></label>
                    </div>
                  </div>
             </div>
        </div>
    </div>
</div>

</template> 
<script>
let { systemPrivileges } = require("../../script/page.js");
export default {
  data() {
    return {
      name: "",
      topList: [],
      AllCheck:false,

    };
  },
  created() {
    this.getTopMemu();
  },
  methods: {
    //获取主菜单下所有有关表格数据
    getTopMemu() {
      let that = this,
        params = {
          callBack: res => {
            if (res && res.code == 200) {
              that.$Message.success("数据请求成功");
              //菜单值名字内容和底下列表
              res.data.map(el => {
                that.topList.push({ name: el.name, btnList: el.childList });
              });
            } else {
              that.$Message.error(res.msg);
            }
          }
        };
      systemPrivileges.getTopMemu(params);
    },
    clickBtn(name,index,id){
      console.log(name,index,id);
      
    }
  }
};
</script>
<style lang="less" scoped>
.table {
  box-sizing: border-box;
}
.table-title {
  display: flex;
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
  background-color: #9999;
  >.emu-one{
      padding-left: 90px;
  }
   >.emu-two{
      padding-left: 270px;
  }
    >.emu-three{
      padding-left: 500px;
  }
}
.table-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  border: 1px solid #ccc;
  >span{
      padding: 0 100px;
  }
}
.table-line-one {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.table-line-two {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #9999; 
  border-top: none;
  line-height: 35px; 
}
.table-line-three {
  display: flex;
  flex-direction: column;
}

.line-title {
  font-size: 15px;
}
.allCheck {
    padding-left:80px;
    padding-right:30px;
    border-left: 1px solid #ccc;
}
.span{
    padding: 0 150px;
}
.sonCheck{
    padding: 0 30px;
}
</style>

