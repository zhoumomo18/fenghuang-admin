<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>景点名称：</label>
                    <Input v-model="name" placeholder="请输入景点名称" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>发布状态：</label>
                    <Select v-model="selectStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addOrModify(1)">新建景点</Button>
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
            breadcrumbs: ['景区门票','景区管理'],
            name: '', // 用户输入的景点名称
            statusList: [
                {value: 0, label: '全部'},
                {value: 1, label: '已发布'},
                {value: 2, label: '待发布'},
            ],
            selectStatus: '0',
            tableData: {
                page: {
                    total: 40,
                    currentPage: 1,
                    pageSize: 10
                },
                data: [
                    // {
                    //     id: 1,
                    //     name: '游船景点',
                    //     ishot: 0,
                    //     publishstate: 2,
                    //     sort: 102,
                    //     ticketName: "成人票、儿童票、老年票、军人票"
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
                        title: '景点名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '发布状态',
                        key: 'publishstate',
                        align: 'center',
                        render: (h, params) => {
                            let dealWithText = ''
                            if (params.row.publishstate * 1 == 1) {
                                dealWithText = '已发布'
                            } else if (params.row.publishstate * 1 == 2) {
                                dealWithText = '待发布'
                            }
                            return h('span', {}, dealWithText)
                        }
                    },
                    {
                        title: '排序值',
                        key: 'sort',
                        align: 'center'
                    },
                    {
                        title: '票种',
                        key: 'ticketName',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        width: 360,
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let btnText = "", displayDelete = "", displayMoveOrSort = "", btnType = "info";
                            if(params.row.publishstate * 1 == 1) {
                                btnText = "取消发布"
                                btnType = "warning"
                                displayDelete = "none"
                            } else if(params.row.publishstate * 1 == 2) {
                                btnText = "发布"
                                displayMoveOrSort = "none"
                            }
                            let isDisabled = params.row.ishot == 0 ? false : "disabled";
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
                                    props: { type: 'info', size: 'small' },
                                    style: { marginRight: '5px', display: displayMoveOrSort},
                                    on: {
                                        click: () => {
                                            this.sortByNum(params.row)
                                        }
                                    }
                                }, '排序'),
                                h('Button', {
                                    props: { type: 'info', size: 'small', disabled: isDisabled },
                                    style: { marginRight: '5px', display: displayMoveOrSort},
                                    on: {
                                        click: () => {
                                            this.pushToHot(params.row)
                                        }
                                    }
                                }, '推到热门'),
                                h('Button', {
                                    props: { type: 'primary', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => {
                                            this.addTicketType(params.row)
                                        }
                                    }
                                }, '添加票种'),
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
        // 推到热门 (normal)
        pushToHot: function(row) {
            let that = this,
                data = {
                id: row.id * 1,
                callBack: res => {
                    if (res && res.code == 200) {
                        that.$Message.success("操作成功");
                        that.renderPage();
                    } else {
                        // 热门数目已满的情况
                        if(res.code == 403) {
                            that.$Message.error("请先在【首页配置>热门景点】中下架一条热门景点");
                        } else {
                            that.$Message.success("操作失败");
                        }
                    }
                }
            };
            scenicsTicketsMethod.changeScenicsIsHot(data);
        },
        // 排序 (normal)
        sortByNum(row) {
            let that = this,
                inputValue = row.sort;
            that.$Modal.confirm({
                title: '排序值',
                render: (h) => {
                    return h('Input', {
                        props: { value: row.sort, autofocus: true },
                        on: {
                            input: (val) => {
                                inputValue = val;
                            }
                        }
                    })
                },
                onOk: () => {
                    console.log("inputValue:")
                    console.log(inputValue)
                    let data = {
                        id: row.id,
                        sort: inputValue,
                        callBack: (res) => {
                            if (res && res.code == 200) {
                                that.$Message.success('操作成功')
                                that.renderPage()
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    scenicsTicketsMethod.scenicsSort(data);
                }
            });
        },
        // 添加票种
        addTicketType(row) {
            this.$router.push({
                path:'/ticketsDetail',
                query: {
                    scenicid: row.id * 1 // 景点scenicid
                }
            })
        },
        // 删除景点 (normal)
        handleDelete(row) {
            let that = this
            that.$Modal.confirm({
                title: '删除景点',
                content: '<p>删除景点【' + row.name + '】?</p>',
                onOk: () => {
                    let data = {
                        id: row.id * 1,
                        callBack: (res) => {
                            if (res && res.code == 200) {
                                that.$Message.success('删除成功')
                                that.renderPage()
                            } else {
                                console.log(res)
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    scenicsTicketsMethod.scenicsDelete(data);
                }
            });
        },
        // 新增/编辑
        addOrModify(type, row) {
            let that = this
            switch(type){
                case 1:
                    that.$router.push({ path:'/scenicsDetail' })
                    break;
                case 2:
                    that.$router.push({
                        path:'/scenicsDetail',
                        query: {
                            id: row.id * 1
                        }
                    })
                    break;
            }
        },
        // 景点发布/取消发布 (normal)
        changePublishStatus(row) {
            let that = this,
            title = row.publishstate == 1 ? "下架" : "发布",
            changeToStatus = row.publishstate == 1 ? 2 : 1;
            this.$Modal.confirm({
                title,
                content: "<p>" + title + "景点：【" + row.name + "】？</p>",
                onOk: () => {
                    let data = {
                        id: row.id * 1,
                        publishstate: changeToStatus,
                        callBack: res => {
                            if (res && res.code == 200) {
                                that.$Message.success("操作成功");
                                this.renderPage();
                            } else {
                                that.$Message.error(res.msg);
                            }
                        }
                    };
                    scenicsTicketsMethod.changeScenicsStatus(data);
                }
            });
        },
        //  (normal)
        getList() {
            let that = this,
                params = {
                    name: that.name,
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    status: that.selectStatus * 1,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            console.log(res.data)
                            that.tableData.data = res.data.rows;
                            that.tableData.page.total = res.data.totalCount;
                        } else {
                            console.log(res);
                            that.$Message.error(res.msg);
                        }
                    },
                };
            scenicsTicketsMethod.getScenicsList(params);
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


