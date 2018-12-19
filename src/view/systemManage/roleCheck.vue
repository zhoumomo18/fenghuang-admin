<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="20"> 
                    <label class="font15">*角色名称：<Span style="width: 300px">{{roleName}}</span></label>
                </Col>
            </Row>
            <p class="selText font15">*选择权限范围</p>
            
            <role-table></role-table>

            
            <div class="roleCompile">
                <div><h3>编辑日志</h3></div>
                <ul>    
                    <li v-for="(item, index) in showdetailList" :key='index'>
                        <span>编辑角色： {{item.userName}}</span>
                        <span>编辑时间： {{item.updateDate}}</span>
                    </li>
                    <li>
                        <div v-if="detailList.length > 2" v-on:click="changeFoldState">
                         <span style='color:skyblue;font-width:fold'>{{brandFold?'更多':'收起'}}</span>
                        </div>
                         <span style='color:black;font-width:fold' v-show="detailList.length===0">暂无编辑日志</span>
                    </li>
                </ul>
                
            </div>
            <div class="affirmBut">
                <Button type="info" @click="goBack">返回主页面</Button>
            </div>
        </div>
    </div>
</template>

<script>
let { systemPrivileges } = require("../../script/page.js"); //接口请求
import breadcrumb from "../../component/template/breadCrumb.vue";
import roleTable from "../../component/table/roleTable.vue";
import roleWin from "../../component/table/roleWin.vue";

export default {
  data() {
    let that = this;
    return {
      roleName: that.$route.query.name,
      roleID: that.$route.query.id,
      breadcrumbs: ["系统配置", "角色与权限"],
      detailList: [], //数据
      brandFold: true
    };
  },
  components: {
    breadcrumb,
    roleTable,
    roleWin
  },

  computed: {
    showdetailList: {
      get: function() {
        if (this.brandFold) {
          if (this.detailList.length < 2) {
            return this.detailList;
          }
          let newArr = [];
          for (var i = 0; i < 2; i++) {
            let item = this.detailList[i];
            newArr.push(item);
          }
          return newArr;
        }
        return this.detailList;
      },
      set: function(val) {
        this.showdetailList = val;
      }
    }
  },
  created() {
    this.getDiary();
  },
  methods: {
    changeFoldState() {
      this.brandFold = !this.brandFold;
    },
    goBack() {
        this.$router.push({
          path: "/roleManage"
        });
    },
    getDiary() {
      let that = this,
        params = {
            id:that.roleID,
          callBack: res => {
            if (res && res.code == 200) {   
                console.log(res.data);  
                res.data.map((el)=>{
                    that.detailList.push(el)
                })
              that.$Message.success("数据请求成功");
             
            } else {
              that.$Message.error(res.msg);
            }
          }
        };
      systemPrivileges.getDiary(params);
    },
  }
};
</script>

<style lang="less" scoped>
.pageFlatFormList {
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 24px;
  box-sizing: border-box;
  .selText {
    padding: 40px 0 10px 0;
  }
  .roleCompile {
    border: 1px solid #dcdee2;
    margin: 30px 0 0 0;
    > div {
      line-height: 40px;
      background-color: #dcdee2;
      color: #333333;
      padding-left: 25px;
    }
    > ul > li {
      line-height: 50px;
      padding-left: 25px;
      display: flex;
      font-size: 14px;
      > span {
        flex: 1;
      }
    }
  }
}
.affirmBut {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  > button {
    height: 35%;
  }
}
.ivu-page {
  text-align: right;
  padding: 24px;
}
.font15 {
  font-size: 15px;
}
.button {
  margin: 0 auto;
}
</style>

