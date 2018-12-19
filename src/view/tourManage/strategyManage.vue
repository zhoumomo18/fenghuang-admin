<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="6"> 
                    <label>攻略标题：</label>
                    <Input v-model="name" placeholder="请输入攻略标题" style="width: 220px" />
                </Col>
                <Col span="6">
                    <label>发布状态：</label>
                    <Select v-model="selectStatus" style="width:200px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="6">
                    <label>所属栏目：</label>
                    <Select v-model="selectColumn" multiple @on-change="onSelectColumnChange" style="width:200px">
                        <Option v-for="item in columns" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="clickToDetail(1)">新建攻略</Button>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let {common} = require('../../script/common.js');
import ivewTable from '../../component/table/table.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            breadcrumbs: ['旅游攻略', '攻略管理'],
            name: '', //用户输入的攻略标题
            statusList: [
                {value: 0, label: '全部'},
                {value: 1, label: '已发布'},
                {value: 2, label: '待发布'},
            ],
            selectStatus: 0,
            columns: [
                {id: 0, name: '景区'},
                {id: 1, name: '美食'},
                {id: 2, name: '名宿'},
                {id: 3, name: '店家'}
            ],
            selectColumn: [],
            tableData: {
                page: {
                    total: 40,
                    currentPage: 1,
                    pageSize: 10
                },
                data: [
                    // {
                    //     title: '景点攻略',
                    //     status: 1,
                    //     column: '景区、美食'
                    // },
                    // {
                    //     title: '停车场',
                    //     status: 2,
                    //     column: '美食'
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
                        title: '攻略标题',
                        key: 'title',
                        width: 260,
                        render: (h, params) => {
                            let displayTopStr = "";
                            if(params.row.isTop * 1 == 0) { // isTop: 是否置顶（0|否 1|是）
                                displayTopStr = "none"
                            }
                            return h('div', [
                                h('span', {
                                    style: { display: "inline-block", width: "180px",
                                        overflow: "hidden",whiteSpace: "nowrap",textOverflow: "ellipsis" },
                                }, params.row.title),
                                h('Button', {
                                    props: { type: 'error', size: 'small' },
                                    style: { marginLeft: '5px', display: displayTopStr, color: "red", background: "none" },
                                }, "顶")
                            ]);
                        }
                    },
                    {
                        title: '发布状态',
                        key: 'status',
                        render: (h, params) => {
                            let dealWithText = ''
                            if (params.row.status * 1 == 1) {
                                dealWithText = '已发布'
                            } else if (params.row.status * 1 == 2) {
                                dealWithText = '待发布'
                            }
                            return h('span', {}, dealWithText)
                        }
                    },
                    {
                        title: '所属栏目',
                        key: 'column'
                    },
                    {
                        title: '操作',
                        width: 320,
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let btnText = "", publishStatus, displayDelete = "", displayMoveTop = "", btnType = "info", isTopBtnText = "";
                            if(params.row.status * 1 == 1) {
                                btnText = "取消发布"
                                publishStatus = 2
                                btnType = "warning"
                                displayDelete = "none"
                            } else if(params.row.status * 1 == 2) {
                                publishStatus = 1
                                btnText = "发布"
                                displayMoveTop = "none"
                            };
                            if(params.row.isTop * 1 == 0) {
                                isTopBtnText = "置顶"
                            } else if(params.row.isTop * 1 == 1) {
                                isTopBtnText = "取消置顶"
                            };
                            return h('div', [
                                h('Button', {
                                    props: { type: 'info', size: 'small' },
                                    style: { marginRight: '5px', display: displayMoveTop },
                                    on: {
                                        click: () => {
                                            this.moveDownUp(params.row)
                                        }
                                    }
                                }, isTopBtnText),
                                h('Button', {
                                    props: { type: btnType, size: 'small'},
                                    style: {marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.changePublishStatus(publishStatus, params.row)
                                        }
                                    }
                                }, btnText),
                                h('Button', {
                                    props: { type: 'success', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => {
                                            this.clickToDetail(2, params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: { type: 'primary', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => {
                                            this.viewStrategy(params.row)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display: displayDelete
                                    },
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
        this.getColumnOptions();
    },
    methods: {
        // 选择的所属栏目不能超过三个
        onSelectColumnChange() {
            if(this.selectColumn.length > 3) {
                this.$Message.warning("所属栏目最多选择三项");
                this.selectColumn = this.selectColumn.splice(0, 3)
            }
        },
        renderPage: function () {
            let self = this
            self.getList()
        },
        // 根据条件查询
        searchAbout() {
            this.tableData.page.currentPage = 1
            this.getList();
        },
        // 置顶/取消置顶
        moveDownUp: function(row) {
            console.log("row:")
            console.log(row)
            let that = this,
                title = row.isTop * 1 == 0 ? "置顶" : "取消置顶", // isTop: 是否置顶（0|否 1|是）
                type = row.isTop * 1 == 0 ? 1 : 2; // type:（1|置顶 2|取消置顶） 
            this.$Modal.confirm({
                title,
                content: "<p>" + title + "攻略：【" + row.title + "】？</p>",
                onOk: () => {
                    let data = {
                        id: row.id * 1,
                        type
                    };
                    console.log(data)
                    let requestConfig = {
                        method: "PUT",
                        url: `/strategy/settop`,
                        data,
                        publicUrlType: 1,
                        successCallback: res => {
                            if (res && res.code == 200) {
                                that.$Message.success("操作成功");
                                this.renderPage();
                            } else {
                                that.$Message.error(res.msg);
                            }
                        },
                        errorCallback: err => {
                            that.$Message.error("操作失败");
                        }
                    };
                    common.ajax.request(requestConfig);
                }
            });
        },
        // 查看详情
        viewStrategy(row) {
            this.$router.push(
                { path: 'viewStrategyDetail', query: { id: row.id * 1 } }
            )
        },
        // 删除
        handleDelete(row) {
            let that = this
            that.$Modal.confirm({
                title: '删除攻略',
                content: '<p>删除攻略【' + row.title + '】?</p>',
                onOk: () => {
                    let requestConfig = {
                        method: 'DELETE',
                        url:'/strategy/delete',
                        data: row.id * 1,
                        publicUrlType: 1,
                        successCallback: res => {
                            if (res && res.code == 200){
                                // that.tableData.data.splice(row._index, 1)
                                that.$Message.success('删除成功')
                                that.renderPage()
                            } else {
                                that.$Message.error(res.msg)
                            }
                        },
                        errorCallback: (err) => {
                            that.$Message.error('删除失败')
                        }
                    }
                    common.ajax.request(requestConfig);
                }
            });
        },
        // 新增/编辑
        clickToDetail(type, row) {
            let that = this
            switch(type){
                case 1:
                    that.$router.push({path:'strategyManageDetail'})
                    break;
                case 2:
                    that.$router.push({
                        path:'strategyManageDetail',
                        query: {
                            id: row.id
                        }
                    })
                    break;
            }
        },
        // 发布/取消发布 攻略
        changePublishStatus(publishStatus, row) {
            console.log("row:")
            console.log(row)
            let that = this,
            title = publishStatus == 1 ? "发布" : "取消发布";
            this.$Modal.confirm({
                title,
                content: "<p>" + title + "攻略：【" + row.title + "】？</p>",
                onOk: () => {
                    let data = {
                        id: row.id * 1,
                        status: row.status,
                        type: publishStatus
                    };
                    console.log(data)
                    let requestConfig = {
                        method: "PUT",
                        url: `/strategy/release`,
                        data,
                        publicUrlType: 1,
                        successCallback: res => {
                            if (res && res.code == 200) {
                                that.$Message.success("操作成功");
                                this.renderPage();
                            } else {
                                that.$Message.error(res.msg);
                            }
                        },
                        errorCallback: err => {
                            that.$Message.error("操作失败");
                        }
                    };
                    common.ajax.request(requestConfig);
                }
            });
        },
        getList() {
            let that = this,
                data = {
                    name: that.name,
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    columnIds: that.selectColumn,
                    status: that.selectStatus
                };
            console.log("search:")
            console.log(data)
            let requestConfig = {
                method: "POST",
                url: "/strategy/getall",
                publicUrlType: 1,
                data,
                successCallback: res => {
                    if (res && res.code == 200 && res.data) {
                        that.$Message.success("数据请求成功");
                        console.log("res.data:");
                        console.log(res.data);
                        that.tableData.data = res.data.rows;
                        that.tableData.page.total = res.data.totalCount;
                    } else {
                        that.$Message.error(res.msg);
                    }
                },
                errorCallback: (err) => {
                    that.$Message.error("数据请求失败");
                }
            };
            common.ajax.request(requestConfig);
        },
        // 获取栏目options
        getColumnOptions() {
            let that = this,
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: '/column/getallUseing',
                successCallback: res => {
                    if (res && res.code == 200 && res.data) {
                        that.$Message.success("数据请求成功");
                        console.log("getColumnOptions:");
                        console.log(res.data);
                        that.columns = res.data;
                    } else {
                        that.$Message.error(res.msg);
                    }
                },
                errorCallback: (err) => {
                    that.$Message.error("数据请求失败");
				    console.log(err);
                }
            };
            common.ajax.request(requestConfig);
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


