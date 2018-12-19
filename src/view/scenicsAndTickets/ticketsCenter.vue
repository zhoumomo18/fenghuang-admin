<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>景点名称：</label>
                    <Input v-model="scenicName" placeholder="请输入景点名称" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>发布状态：</label>
                    <Select v-model="selectStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addOrModify(1)">新建票种</Button>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let { scenicsTicketsMethod } = require('../../script/page.js')
import ivewTable from '../../component/table/table.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            breadcrumbs: ['景区门票','票务中心'],
            scenicName: '', // 用户输入的景点名称
            statusList: [
                {value: 0, label: '全部'},
                {value: 1, label: '已发布'},
                {value: 2, label: '待发布'},
            ],
            selectStatus: "0",
            tableData: {
                page: {
                    total: 40,
                    currentPage: 1,
                    pageSize: 10
                },
                data: [
                    // {
                    //     id: 3,
                    //     name: '学生票',
                    //     scenicName: "景点名称1",
                    //     price: 100,
                    //     status: 1
                    // }
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
                        title: '票种名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '景点名称',
                        key: 'scenicName',
                        align: 'center'
                    },
                    {
                        title: '价格',
                        key: 'price',
                        align: 'center',
                        render: (h, params) => {
                            let priceText = params.row.price
                            if (params.row.price == 0) {
                                priceText = '免费'
                            }
                            return h('span', {}, priceText)
                        }
                    },
                    {
                        title: '发布状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            let dealWithText = ''
                            if (params.row.status == 1) {
                                dealWithText = '已发布'
                            } else if (params.row.status == 2) {
                                dealWithText = '待发布'
                            }
                            return h('span', {}, dealWithText)
                        }
                    },
                    {
                        title: '操作',
                        width: 360,
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let btnText = "", displayDelete = "", btnType = "info";
                            if(params.row.status * 1 == 1) {
                                btnText = "取消发布"
                                btnType = "warning"
                                displayDelete = "none"
                            } else if(params.row.status * 1 == 2) {
                                btnText = "发布"
                            }
                            return h('div', [
                                h('Button', {
                                    props: { type: 'success', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => {
                                            this.addOrModify(2, params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: { type: btnType, size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => {
                                            this.changePublishStatus(params.row)
                                        }
                                    }
                                }, btnText),
                                h('Button', {
                                    props: { type: 'error', size: 'small' },
                                    style: { marginRight: '5px', display: displayDelete },
                                    on: {
                                        click: () => {
                                            this.handleDelete(params.row)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                // 页码改变的回调，返回改变后的页码
                onChange: function(currentPage) {
                    that.tableData.page.currentPage = currentPage
                    that.renderPage()
                },
                // 切换每页条数时的回调，返回切换后的每页条数
                onPageSizeChange: function(pageSize) {
                    that.tableData.page.currentPage = 1
                    that.tableData.page.pageSize = pageSize
                    that.renderPage()
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
        renderPage: function () {
            let self = this
            self.getList()
        },
        searchAbout: function() {
            this.tableData.page.currentPage = 1
            this.getList();
        },
        // 删除 (normal)
        handleDelete(row) {
            let that = this
            that.$Modal.confirm({
                title: '删除票种',
                content: '<p>删除票种【' + row.name + '】?</p>',
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
                    scenicsTicketsMethod.ticketsDelete(params);
                }
            });
        },
        // 新增/编辑
        addOrModify(type, row) {
            let that = this
            switch(type){
                case 1:
                    that.$router.push({ path:'/ticketsDetail' })
                    break;
                case 2:
                    that.$router.push({
                        path:'/ticketsDetail',
                        query: {
                            id: row.id * 1
                        }
                    })
                    break;
            }
        },
        // 票种发布/取消发布 (normal)
        changePublishStatus(row) {
            let that = this,
                title = row.status == 1 ? "取消发布" : "发布",
                changeToStatus = row.status == 1 ? 2 : 1;
            this.$Modal.confirm({
                title,
                content: "<p>" + title + "票种：【" + row.name + "】？</p>",
                onOk: () => {
                    let data = {
                        id: row.id * 1,
                        status: changeToStatus,
                        callBack: res => {
                            if (res && res.code == 200) {
                                that.$Message.success("操作成功");
                                this.renderPage();
                            } else {
                                that.$Message.error(res.msg);
                            }
                        }
                    };
                    scenicsTicketsMethod.changeTicketsStatus(data);
                }
            });
        },
        //  (normal)
        getList() {
            let that = this,
                params = {
                    scenicName: that.scenicName,
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    status: that.selectStatus,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.$Message.success("数据请求成功");
                            console.log("ticketsList:");
                            console.log(res.data);
                            that.tableData.data = res.data.rows;
                            that.tableData.page.total = res.data.totalCount;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    },
                };
            scenicsTicketsMethod.getTicketsList(params);
        }
    }
}
</script>

<style lang="less" scoped>
.pageFlatFormList{
    padding-left: 24px;
    padding-right: 24px;
    margin-bottom: 24px;
    box-sizing: border-box;
    .ivu-row-flex{
        margin-bottom: 24px;
    }
}
.ivu-page{
    text-align: right;
    padding: 24px;
}
</style>


