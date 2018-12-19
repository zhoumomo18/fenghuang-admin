<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        <div class="pageContent">
            <div class="order padding100">
                <div class="title">
                <span class="font30">订单号：<span></span>123465</span>
                <div><Button type="primary">退款</Button></div>
                </div>
                <div class="content">
                    <div>
                        <p>票种名称 :<span>123</span></p> 
                        <p>景点名称 :<span>123</span></p>
                        <p>下单名称 :<span>123</span></p>
                    </div>
                    <div>
                        <p>预定数量 :<span>123</span></p> 
                        <p>入院时间 :<span>123</span></p>
                        <p>支付时间 :<span>123</span></p>
                    </div>
                    <div class="state">
                        <div>
                            <p>出票状态</p> 
                        <span class="font28">未出票</span>
                        </div>
                        <div>
                            <p>订单状态</p>
                            <span class="font28">已付款</span>
                        </div>
                        <div>
                            <p>订单金额</p>
                        <span class="font28" >￥5668.2</span>
                        </div>
                        
                    </div>
                </div>
            </div>
         
            <div class="use">
                <p class="font22 padding50">用户信息</p>
                <div class="line"></div>
                <div class="use-content padding50">
                    <p>用户昵称 ：<span>1</span></p>
                    <div class="use-num">
                        <span>取票人：2</span>
                        <span>联系电话：2</span>
                        <span>身份证号：3</span>
                    </div>
                </div>
            </div>    
            <div class="handle">
                <p class="font22 padding50">操作日志</p>
                <div class="line"></div>
                    <div class="handle-num padding50">
                        <span>操作员：2</span>
                        <span>操作类型：2</span>
                        <span>操作时间：3</span>
                    </div>
            </div>  
        </div>
        <div class="btn-box">
             <Button class="btn" type="primary">确认</Button>
        </div>
    </div>
</template>

<script>
let { systemConfigMethod } = require("../../script/page.js");
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
  data() {
    let that = this;
    return {
      breadcrumbs: ["景区门票", "订单中心"],
      statusList: [
        { value: 0, label: "全部" },
        { value: 1, label: "待付款" },
        { value: 2, label: "已取消" },
        { value: 3, label: "已支付" }
      ],
      selectCharacter: "",
      name: "", // 账号或姓名
      selectStatus: 0, // 状态: 0.全部, 1.待付款, 2.已取消 3.已支付
      tableData: {
        page: {
          total: 40,
          currentPage: 1,
          pageSize: 10
        },
        data: [
          {
            id: 1,
            orderName: 123456,
            ticketName: "编辑aa",
            spotName: "攻略编辑",
            ticketNum: "200",
            orderMoney: "150",
            orderState: "已出货",
            status: 1,
            orderTime: "2018-10-31",
            action: ""
          }
        ],
        columns: [
          {
            type: "index",
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
            title: "订单号",
            key: "orderName"
          },
          {
            title: "票种名称",
            key: "ticketName"
          },
          {
            title: "门票数量",
            key: "ticketNum"
          },
          {
            title: "景点名称",
            key: "spotName"
          },
          {
            title: "订单金额",
            key: "orderMoney"
          },
          {
            title: "订单状态",
            key: "orderState"
          },
          {
            title: "下单时间",
            key: "orderTime"
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              let btnText = "",
                btnType = "primary";
              if (params.row.status * 1 == 1) {
                btnText = "禁用";
                btnType = "warning";
              } else if (params.row.status * 1 == 2) {
                btnText = "启用";
              }
              return h("div", [
                h(
                  "Button",
                  {
                    props: { type: "success", size: "small" },
                    style: { marginRight: "5px" },
                    on: {
                      click: () => {
                        that.addOrModify(2, params.row);
                      }
                    }
                  },
                  "查看"
                ),
                h(
                  "Button",
                  {
                    props: { type: btnType, size: "small" },
                    style: { marginRight: "5px" },
                    on: {
                      click: () => {
                        that.handleStatusBtn(params.row);
                      }
                    }
                  },
                  btnText
                ),
                h(
                  "Button",
                  {
                    props: { type: "error", size: "small" },
                    style: { marginRight: "5px" },
                    on: {
                      click: () => {
                        that.handleDelete(params.row);
                      }
                    }
                  },
                  "退票"
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
    breadcrumb
  },
  mounted() {
    this.getList();
  },
  methods: {
    //重新渲染页面
    renderPage: function() {
      this.getList();
    },
    // 根据条件查询
    searchAbout() {
      this.tableData.page.currentPage = 1;
      this.renderPage();
    },
    // 启用/禁用
    handleStatusBtn(row) {
      console.log("row:");
      console.log(row);
      let that = this,
        title = row.status == 1 ? "禁用" : "启用",
        changeToStatus = row.status == 1 ? 2 : 1;
      that.$Modal.confirm({
        title: title + "系统成员",
        content: "<p>" + title + "系统成员【" + row.name + "】</p>",
        onOk: () => {
          let that = this,
            data = {
              id: row.id * 1,
              name: row.name,
              status: row.status,
              type: changeToStatus,
              callBack: res => {
                if (res && res.code == 200) {
                  if (row.status == 1) {
                    that.$Message.success("禁用成功");
                  } else {
                    that.$Message.success("启用成功");
                  }
                } else {
                  that.$Message.error(res.msg);
                }
              }
            };
          systemConfigMethod.changeMemberStatus(data);
        }
      });
    },
    addOrModify(type, row) {
      let that = this;
      switch (type) {
        case 1:
          that.$router.push({ path: "/memberDetail" });
          break;
        case 2:
          that.$router.push({
            path: "/memberDetail",
            query: {
              id: row.id
            }
          });
          break;
      }
    },
    // 删除
    handleDelete(row) {
      let that = this,
        name = row.name;
      that.$Modal.confirm({
        title: "删除系统成员",
        content: "<p>删除系统成员【" + name + "】?</p>",
        onOk: () => {
          let params = {
            id: row.id * 1,
            callBack: res => {
              if (res && res.code == 200) {
                that.$Message.success("删除成功");
                that.renderPage();
              } else {
                that.$Message.error(res.msg);
              }
            }
          };
          systemConfigMethod.memberDelete(params);
        }
      });
    },
    getList() {
      let that = this,
        params = {
          name: that.name,
          status: that.selectStatus,
          character: that.selectCharacter,
          pageNo: that.tableData.page.currentPage,
          pageSize: that.tableData.page.pageSize,
          callBack: res => {
            // if (res && res.code == 200 && res.data) {
            if (res && res.code == 200) {
              that.$Message.success("数据请求成功");
              console.log(res.data);
              // that.tableData.data = res.data.rows;
              // that.tableData.page.total = res.data.totalCount;
            } else {
              that.$Message.error(res.msg);
            }
          }
        };
      systemConfigMethod.getMemberList(params);
    }
  }
};
</script>

<style lang="less" scoped>
.pageContent {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  > div {
    margin-bottom: 30px;
    line-height: 40px;
  }
  > .order {
    .title {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
    }
    .content {
      display: flex;
      > div {
        flex: 1;
      }
      .state {
        display: flex;
        justify-content: space-around;
        text-align: center;
      }
    }
  }
  > .use {
    .use-num {
      display: flex;
      > span {
        flex: 1;
      }
    }
  }
  > .handle {
    .handle-num {
      display: flex;
      > span {
        flex: 1;
      }
    }
  }
}
.btn-box {
  display: flex;
  justify-content: center;
}

//通用部分
.font22 {
  font-size: 22px;
  font-weight: bold;
}
.font30 {
  font-size: 30px;
  font-weight: bold;
}
.font28 {
  font-size: 28px;
}
.line {
  border-top: 2px solid #ccc;
}
.padding100{
  padding: 15px 100px;
  background: #fff;
}
.padding50{
  padding: 15px 50px;
  background: #fff;
}
</style>


