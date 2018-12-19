<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7">
                    <label>角色：</label>
                    <Select v-model="roleID" style="width:220px">
                        <Option v-for="item in statusList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addOrModify(1)">新建角色</Button>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let { systemPrivileges } = require("../../script/page.js");
import ivewTable from "../../component/table/table.vue";
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
  data() {
    let that = this;
    return {
      breadcrumbs: ["系统配置", "角色与权限"],
      statusList: [],
      roleID: 0,
      menu: [],
      tableData: {
        page: {
          total: 40,
          currentPage: 1,
          pageSize: 10
        },
        data: [
          {
            id: 3,
            name: "学生票",
            menuList: this.menu
          }
        ],
        columns: [
          {
            type: "index2",
            width: 60,
            title: "编号",
            align: "center",
            render: (h, params) => {
              return h(
                "span",
                params.index +
                  (that.tableData.page.currentPage - 1) *
                    that.tableData.page.pageSize +
                  1
              );
            }
          },
          {
            title: "角色",
            key: "name",
            align: "center"
          },
          {
            title: "权限模块",
            key: "menuList",
            align: "center",
            render: (h, params) => {
              let dealWithText = "";
              // 若menuList有值则拼接起来，否则写入'暂无权限'
              if (params.row.menuList && params.row.menuList.length > 0) {
                params.row.menuList.map(el => {
                  dealWithText += el.name + "、";
                });
              } else {
                dealWithText = "暂无权限";
              }
              return h("span", {}, dealWithText);
            }
          },
          {
            title: "操作",
            key: "",
            width: 240,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: { type: "success", size: "small" },
                    style: { marginRight: "5px" },
                    on: {
                      click: () => {
                        this.addOrModify(2, params.row);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: { type: "info", size: "small" },
                    style: { marginRight: "5px" },
                    on: {
                      click: () => {
                        this.addOrModify(3, params.row);
                      }
                    }
                  },
                  "查看"
                )
              ]);
            }
          }
        ],
        // 页码改变的回调，返回改变后的页码
        onChange: function(currentPage) {
          that.tableData.page.currentPage = currentPage;
          that.renderPage();
        },
        // 切换每页条数时的回调，返回切换后的每页条数
        onPageSizeChange: function(pageSize) {
          that.tableData.page.currentPage = 1;
          that.tableData.page.pageSize = pageSize;
          that.renderPage();
        }
      }
    };
  },
  components: {
    ivewTable,
    breadcrumb
  },
  mounted() {
    this.getList();
  },
  methods: {
    //重新渲染页面
    renderPage: function() {
      let self = this;
      self.getList();
    },
    //查询按钮
    searchAbout: function() {
      this.tableData.page.currentPage = 1;
      this.getList();
    },

    // 跳转页面
    addOrModify(type, row) {
      let that = this;
      switch (type) {
        case 1:
          that.$router.push({ path: "/roleCreates" });
          break;
        case 2:
          that.$router.push({
            path: "/roleCreates",
            query: {
              name: row.name,
              id: row.id
            }
          });
          break;
        case 3:
          that.$router.push({
            path: "/roleCheck",
            query: { id: row.id, name: row.name }
          });
      }
    },

    /***********************************调用接口************************************************************/
    getList() {
      let that = this,
        params = {
          roleId: that.roleID,
          pageNo: that.tableData.page.currentPage,
          pageSize: that.tableData.page.pageSize,
          callBack: res => {
            if (res && res.code == 200) {
              that.statusList = res.data.rows.map(item => {
                return { name: item.name, id: item.id };
              });
              that.tableData.page.total = res.data.totalPage;
              that.tableData.data = res.data.rows;
              that.tableData.data.id = res.data.rows.id;
            } else {
              that.$Message.error(res.msg);
            }
          }
        };
      systemPrivileges.getRoleList(params);
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
  .ivu-row-flex {
    margin-bottom: 24px;
  }
}
.ivu-page {
  text-align: right;
  padding: 24px;
}
</style>



