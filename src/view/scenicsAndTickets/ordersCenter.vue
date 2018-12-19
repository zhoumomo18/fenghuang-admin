<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>景区名称：</label>
                    <Input v-model="name" placeholder="请输入" style="width: 220px" />
                </Col>
                <Col span="6">
                    <label>订单状态：</label>
                    <Select v-model="selectStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2" offset="1"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let { systemConfigMethod } = require('../../script/page.js')
import ivewTable from "../../component/table/table.vue";
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
                { value: 3, label: "已支付" },
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
                        ticketNum:'200',
                        orderMoney:'150',
                        orderState:'已出货',
                        status: 1,
                        orderTime: "2018-10-31",
                        action:''
                    },
                ],
                columns: [
                    {
                        type: "index",
                        width: 60,
                        title: "编号",
                        align: 'center',
                        render: (h, params) => {
                            return h("span", params.index + (that.tableData.page.currentPage - 1) * that.tableData.page.pageSize + 1)
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
                            let btnText = "", btnType = "primary";
                            if(params.row.status * 1 == 1) {
                                btnText = "禁用"
                                btnType = "warning"
                            } else if(params.row.status * 1 == 2) {
                                btnText = "启用"
                            }
                            return h("div", [
                                h("Button",
                                    {
                                        props: { type: "success", size: "small" },
                                        style: { marginRight: "5px" },
                                        on: {
                                            click: () => {
                                                that.addOrModify(2, params.row);
                                            }
                                        }
                                    }, "查看"),
                                h("Button",
                                    {
                                        props: { type: btnType, size: "small" },
                                        style: { marginRight: "5px" },
                                        on: {
                                            click: () => {
                                                that.handleStatusBtn(params.row);
                                            }
                                        }
                                    }, btnText),
                                h("Button",
                                    { 
                                        props: { type: "error", size: "small" },
                                        style: { marginRight: "5px" },
                                        on: {
                                            click: () => {
                                                that.handleDelete(params.row);
                                            }
                                        }
                                    }, "退票" )
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
        }
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
            this.getList();
        },
        // 根据条件查询
        searchAbout() {
            this.tableData.page.currentPage = 1
            this.renderPage();
        },
        // 启用/禁用
        handleStatusBtn(row) {
            console.log("row:");
            console.log(row);
            let that = this,
                title = row.status == 1 ? "禁用" : "启用",
                changeToStatus = row.status == 1 ? 2 : 1
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
                                    if(row.status == 1) {
                                        that.$Message.success("禁用成功");
                                    } else {
                                        that.$Message.success("启用成功");
                                    }
                                } else {
                                    that.$Message.error(res.msg);
                                }
                            },
                        };
                    systemConfigMethod.changeMemberStatus(data);
                }
            });
        },
        addOrModify(type, row) {
            let that = this;
            switch (type) {
                case 1:
                    that.$router.push({ path: "/addOrModify" });
                    break;
                case 2:
                    that.$router.push({
                        path: "/ordersCheck",
                        query: {
                            id: row.id,
                            type:row.type
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
                title: '删除系统成员',
                content: '<p>删除系统成员【' + name + '】?</p>',
                onOk: () => {
                    let params = {
                        id: row.id * 1,
                        callBack: (res) => {
                            if (res && res.code == 200) {
                                that.$Message.success('删除成功')
                                that.renderPage()
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
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
                    },
                };
            systemConfigMethod.getMemberList(params);
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


