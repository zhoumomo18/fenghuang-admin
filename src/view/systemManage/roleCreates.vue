<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="20"> 
                    <label class="font15">*角色名称：</label>
                    <Input 
                     v-model="roleName" placeholder="请输入" 
                     style="width: 600px" 
                     @on-blur="validateJyh(roleName)"
                    />
                </Col>
            </Row>
            <p class="selText font15">*选择权限范围</p>
            
            <div class="table" >
                <div class="table-title">
                    <div class="emu-one">菜单</div>
                    <div class="emu-two">子菜单</div>
                    <div class="emu-three">权限范围</div>
                </div>
                <div>
                    <div class="table-row" v-for="(listItem, listindex) in topList" :key="listindex"><span class="line-title">{{listItem.name}}</span>
                        <div class="table-line-one">
                            <div class="table-line-two" v-for="(childItem, itemIndex) in listItem.childList" :key="childItem.id">
                                <div class="span">{{childItem.name}}</div> 
                                <div class="table-line-three" v-for="(li, liIndex) in childItem.allButtonList" :key="li.id">
                                    <label @click="clickBtn(li.name, itemIndex, li.menuButtonId)" class="sonCheck">
                                        {{li.name}}{{li.check}}
                                        <input type="checkbox" v-model="li.check">
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
            <div class="manageBtn">
                <roleWin title="新建权限" name="权限名称" id="权限Code"></roleWin>
                <roleWin title="下发权限" name="权限名称"  @renderTop='getTopMemu'></roleWin>
            </div>
            <div class="selBtn">
                <Button type="success"  @click="goRoleCheck" size="large">确认</Button>
                <Button type="error"  @click="handleCancelBtn" size="large">取消</Button>
            </div>
        </div>
    </div>
</template>

<script>
let { systemPrivileges } = require("../../script/page.js");
import breadcrumb from "../../component/template/breadCrumb.vue";
import roleTable from "../../component/table/roleTable.vue";
import roleWin from "../../component/table/roleWin.vue";

export default {
    data() {
        let that = this;
        return {
            roleName: that.$route.query.name, //传递值
            roleID: that.$route.query.id, //传递值
            breadcrumbs: ["系统配置", "角色与权限"],
            topList: []
        };
    },
    created() {
        this.getTopMemu();
    },
    components: {
        breadcrumb,
        roleWin
    },
    methods: {
        //获取主菜单下所有有关表格数据
        getTopMemu() {
        let that = this,
            params = {
                callBack: res => {
                    if (res && res.code == 200 && res.data) {
                        that.$Message.success("数据请求成功");
                        that.topList = []
                        that.topList = res.data
                        console.log(that.topList)
                    } else {
                        that.$Message.error(res.msg);
                    }
                }
            };
            systemPrivileges.getTopMemu(params);
        },

        // 跳转查看页面
        goRoleCheck() {
            if (this.roleName) {
                this.$router.push({
                    path: "/roleCheck",
                    query: {
                        name: this.roleName,
                        id: this.roleID
                    }
                });
            } else {
                this.$Message.info({ content: "请输入角色名" });
            }
        },
        // 取消提示并返回页面
        handleCancelBtn() {
            this.$Modal.confirm({
                title: "角色尚未保存，确认退出？",
                onOk: () => {
                this.$router.go(-1);
                }
            });
        },
        //input 验证
        validateJyh(glhm) {
            if (glhm.length > 8) {
                this.$Message.error("输入内容不能超过8个字");
                this.roleName = "";
            }
        }
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
    .manageBtn {
        display: flex;
        margin: 30px 0 10px 0;
        & > div {
            margin-right: 30px;
        }
  }
  .selBtn {
    margin-top: 10px;
    width: 100%;
    text-align: center;
    padding-bottom: 30px;
    & > button {
      margin-right: 30px;
    }
  }
}
.ivu-page {
  text-align: right;
  padding: 24px;
}
.font15 {
  font-size: 15px;
}

.table {
  box-sizing: border-box;
}
.table-title {
  display: flex;
  font-size: 16px;
  font-weight: bold;
  background-color: #f8f8f9;
  border: 1px solid #e8eaec;
  padding: 10px 0 ;
  text-align: center;
  > .emu-one {
    width: 240px;
  }
  > .emu-two {
    width: 350px;
  }
  > .emu-three {
   flex: 1;
  }
}
.table-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  border: 1px solid #e8eaec;
  > span {
    width: 240px;
    text-align: center;
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
  padding-left: 80px;
  padding-right: 30px;
  border-left: 1px solid #e8eaec;
}
.span {
  width:350px;
  text-align: center;
  border-right:1px solid #e8eaec; 
}
.sonCheck {
  padding: 0 30px;
}
</style>
