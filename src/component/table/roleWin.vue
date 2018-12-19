<template>
<div>
    <div v-show='title==="新建权限"'>
        <Button type="primary" @click="modal2 = true">{{`+${title}`}}</Button>
        <Modal
            v-model="modal2"
            @on-ok="ok2"
            ok-text='保存'>  
            <div >
                <p class="Btn-title">{{title}}</p>
                <span>{{`*${name}: `}}</span><input type="text" v-model="roleName" placeholder='输入内容不超过6个字' maxlength="6">
                <span>{{`*${id}: `}}</span><input type="text" v-model="roleCode" placeholder='请输入编码'>
            </div>  
        </Modal>
    </div>
    <div v-show='title=="下发权限"'>
         <Button type="primary" @click="render">{{`+${title}`}}</Button>
        <Modal
            v-model="modal1"
            @on-ok="ok"
            ok-text='保存'>  
            <div v-show='title=="下发权限"'>
            <p class="Btn-title">{{title}}</p>
            <div class="menu"><span>选择权限：</span>
            <Select v-model="menuList" multiple style="width:260px">
                <Option v-for="item in menu" :value="item.name" :key="item.value">{{ item.name }}</Option>
            </Select></div>
            <div>
                <span>选择子菜单：</span>
             <Select v-model="sonMenuList" multiple style="width:260px">
                <Option v-for="item in sonMenu" :value="item.name" :key="item.value">{{ item.name }}</Option>
            </Select>
            </div>       
        </div>  
        </Modal>
    </div>
</div>
</template>
<script>
let { systemPrivileges } = require("../../script/page.js");
export default {
  data() {
    return {
      modal1: false,
      modal2: false,
      roleName:'',
      roleCode:'',
      //权限菜单
      menu: [],
      menuList:[],
      //子菜单报
      sonMenu: [],
      sonMenuList:[],
      dataArr:[]
    };
  },
  created() {
      this.getCliMenu()
  },
  methods: {
    ok() {
        this.concatArr()
        this.addNewManageBtn() 
        this.sonMenuList=[]
        this.menuList=[]
        this.$emit('renderTop')
    },
    ok2() {
        this.postNewRole() 
    },
    //弹出并重新渲染
    render(){
        this.modal1  = true 
        this.menu=[]
        this.getSelRole() 
    },
    //新建权限
    postNewRole() {
      let that = this,
        params = {
            roleName : that.roleName,
            roleCode : that.roleCode,
            createdate: "2018-7-23 11:00:00",
            createuser: "ff",
            remark: "ss",
            updatedate: "2018-7-23 11:00:00",
            updateuser: "ff",
          callBack: res => {
            if (res && res.code == 200) {
              that.$Message.success("数据请求成功");
            } else {
              that.$Message.error(res.msg);
            }
          }
        };
      systemPrivileges.postNewRole(params);
    },
    //获取子菜单
    getCliMenu() {
      let that = this,
        params = {
          callBack: res => {
            if (res && res.code == 200) {
              that.$Message.success("数据请求成功")
              res.data.map(el => {
                  that.sonMenu.push({name:el.name,id:el.id})   
              });   
            } else {
              that.$Message.error(res.msg);
            }
          }
        };
      systemPrivileges.getCliMemus(params);
    },
    //获取可选择权限
    getSelRole() {
      let that = this,
        params = {
          callBack: res => {
            if (res && res.code == 200) {   
                res.data.map((el)=>{
                    that.menu.push({name:el.name,id:el.id})
                })
              that.$Message.success("数据请求成功");
             
            } else {
              that.$Message.error(res.msg);
            }
          }
        };
      systemPrivileges.getSelRoles(params);
    },
    //新增按钮内容
    addNewManageBtn() {
      let that = this,
        params = {
            buttons: that.dataArr.buttons,
            menuIds: that.dataArr.menuIds,
          callBack: res => {
            if (res && res.code == 200) {
              that.$Message.success("数据请求成功");
            } else {
              that.$Message.error(res.msg);
            }
          }
        };
      systemPrivileges.postNewManageBtn(params);
    },
    // 数组拼接
    concatArr(){
        let that = this
        that.sonMenuList.map((el)=>{   
           that.dataArr.push({buttons:el,menuIds:''})
        }) 
        that.dataArr.map(el=>{
           el.menuIds = that.menuList
        })
    }
  },
  props: {
    title: String,
    name: String,
    id: String
  }
};
</script>

<style lang="less" scoped>
.Btn-title {
  font-size: 18px;
  margin: 20px 0;
}
.menu {
  margin-bottom: 20px;
}
</style>


