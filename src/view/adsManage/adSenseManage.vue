<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>广告位：</label>
                    <Input v-model="name" placeholder="请输入广告位" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>发布状态：</label>
                    <Select v-model="selectedStatus" @on-change="handleChangeStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addAdSense(1)">新建广告位</Button>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let { adManageMethod } = require('../../script/page.js')
import ivewTable from "../../component/table/table.vue";
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
    data() {
        let that = this;
        return {
            breadcrumbs: ["广告管理", "广告位管理"],
            statusList: [
                { value: 0, label: "全部" },
                { value: 1, label: "启用中" },
                { value: 2, label: "禁用中" }
            ],
            selectedStatus: 0, // 状态: 0.全部,1.启用中,2.禁用
            name: "", // 广告位名称
            tableData: {
                page: {
                    total: 40,
                    currentPage: 1,
                    pageSize: 10
                },
                data: [
                    // { name: "首页顶部广告位1", status: 1, id: 1 },
                ],
                columns: [
                    {
                        type: "index2",
                        width: 60,
                        title: "编号",
                        align: 'center',
                        render: (h, params) => {
                            return h("span", params.index + (that.tableData.page.currentPage - 1) * that.tableData.page.pageSize + 1)
                        }
                    },
                    {
                        title: "广告位",
                        key: "name"
                    },
                    {
                        title: "状态",
                        key: "status",
                        render: (h, params) => {
                            let dealWithText = "";
                            if (params.row.status * 1 == 1) {
                                dealWithText = "启用中";
                            } else if (params.row.status * 1 == 2) {
                                dealWithText = "禁用中";
                            }
                            return h("span", {}, dealWithText);
                        }
                    },
                    {
                        title: "操作",
                        key: "action",
                        align: "center",
                        render: (h, params) => {
                            let btnText = "", btnType = "info";
                            if(params.row.status * 1 == 1) {
                                btnText = "禁用"
                                btnType = "warning"
                            } else if(params.row.status * 1 == 2) {
                                btnText = "启用"
                            }
                            return h("div", [
                                h("Button",
                                    {
                                        props: {type: "success", size: "small"},
                                        style: {marginRight: "5px"},
                                        on: {
                                            click: () => {
                                                that.addAdSense(2, params.row.id);
                                            }
                                        }
                                    },
                                    "编辑"
                                ),
                                h("Button",
                                    {
                                        props: {type: btnType, size: "small"},
                                        style: {marginRight: "5px"},
                                        on: {
                                            click: () => {
                                                this.handleStatusBtn(params.row);
                                            }
                                        }
                                    },
                                    btnText
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
        // 选择状态
        handleChangeStatus(value) {
            this.selectedStatus = value;
        },
        // 根据条件查询
        searchAbout() {
            this.tableData.page.currentPage = 1
            this.renderPage();
        },
        // 启用/禁用广告位
        handleStatusBtn(row) {
            let that = this,
            title = row.status == 1 ? "禁用" : "启用",
            changeToStatus = row.status == 1 ? 2 : 1;
            this.$Modal.confirm({
                title: title + "广告位",
                content: "<p>" + title + "广告位【" + row.name + "】</p>",
                onOk: () => {
                    let data = {
                        id: row.id * 1,
                        name: row.name,
                        status: row.status,
                        type: changeToStatus,
                        callBack: res => {
                            if (res && res.code == 200) {
                                that.$Message.success("操作成功");
                                this.renderPage();
                            } else {
                                that.$Message.error(res.msg);
                            }
                        },
                    };
                    adManageMethod.changeAdsenseStatus(data);
                }
            });
        },
        // 跳转到新增/编辑广告位页面
        addAdSense(type, id) { 
            let that = this;
            switch (type) {
                case 1:
                    that.$router.push({ path: "adSenseDetail" });
                    break;
                case 2:
                    that.$router.push({
                        path: "adSenseDetail",
                        query: { id: id }
                    });
                    break;
            }
        },
        getList() {
            let that = this,
                params = {
                    name: that.name,
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    status: that.selectedStatus * 1,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.$Message.success("数据请求成功");
                            console.log(res.data);
                            that.tableData.data = res.data.rows;
                            that.tableData.page.total = res.data.totalCount;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    },
                };
            adManageMethod.getAdsensePageList(params);
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


