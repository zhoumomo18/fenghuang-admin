<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>广告名称：</label>
                    <Input v-model="name"  placeholder="请输入广告名称" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>发布状态：</label>
                    <Select v-model="selectedStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="7">
                    <label>广告位：</label>
                    <Select v-model="adsenseId" style="width:220px">
                        <Option v-for="item in adsenseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="handleToDetail(1)">新建广告</Button>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let {adManageMethod} = require('../../script/page.js')
import ivewTable from '../../component/table/table.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            breadcrumbs: ['广告管理','广告列表'],
            statusList: [
                {value: 0, label: '全部'},
                {value: 1, label: '已发布'},
                {value: 2, label: '待发布'},
            ],
            name: '', // 广告名称
            selectedStatus: '',// 状态: 0.全部,1.已发布,2.待发布。默认全部。
            adsenseList: [],
            adsenseId: '',
            tableData: {
                page: {
                    total: 40,
                    currentPage: 1,
                    pageSize: 10
                },
                loading: true,
                data: [],
                columns: [
                    {
                        type: 'index2',
                        width: 60,
                        title: '编号',
                        render: (h, params) => {
                            return h('span', params.index + (this.tableData.page.currentPage- 1) * this.tableData.page.pageSize + 1);
                        }
                    },
                    {
                        title: '广告名称',
                        key: 'name'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) =>{
                            let dealWithText = (params.row.status==1) ? '已发布':"待发布"
                            return h('span',{},dealWithText)
                        }
                    },
                    {
                        title: '广告位',
                        key: 'adsenseName'
                    },
                    {
                        title: '有效期',
                        key: 'validiteTime',
                        render: (h, params) =>{
                            let dealWithText = params.row.startDate + "至" + params.row.endDate
                            return h('span',{},dealWithText)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 240,
                        render: (h, params) => {
                            let status = params.row.status, // 状态。1 发布 2 取消发布。
                                dealWithText =  (status==1) ? '取消发布':'发布'
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleRelease(params.row)
                                        }
                                    }
                                }, dealWithText),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleToDetail(2,params.row.id)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        display: status == 1 ? 'none':'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleDelete(params.row, params.index)
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleToViewDetail(params.row.id)
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }
                ],
                // 页码改变的回调，返回改变后的页码
                onChange: function(currentPage){
                    that.tableData.page.currentPage = currentPage
                    that.renderPage()
                },
                // 切换每页条数时的回调，返回切换后的每页条数
                onPageSizeChange: function(pageSize){
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
    mounted () {
        this.getButtonList()
        this.getList()
        this.getAdsenseList()
    },
    methods: {
        //重新渲染页面
        renderPage: function () {
            this.getList()
        },
        // 根据条件查询
        searchAbout () {
            this.tableData.page.currentPage=1
            this.renderPage()
        },
        // 跳转至详情页
        handleToDetail (type, id) {
            let that = this
            switch(type){
                case 1:
                that.$router.push({path:'adItemDetail'})
                break
                case 2:
                that.$router.push({
                    path:'adItemDetail',
                    query: {
                        id: id
                    }
                })
                break
            }
        },
        // 查看广告详情
        handleToViewDetail (id){
            let that = this
            that.$router.push({
                path:'viewAdDetail',
                query: {
                    id: id
                }
            })
        },
        // 获取按钮权限
        getButtonList () {
            let childObj = JSON.parse(localStorage.getItem('childObj'))
            console.log(childObj)
        },

        /***********************************调用接口************************************************************/
        // 获取广告位列表
        getAdsenseList () {
            let that = this,
                params = {
                    callBack: (res) => {
                        if (res && res.code==200 && res.data){
                            that.adsenseList = res.data
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            adManageMethod.getAdsenseList(params)
        },
        // 请求广告列表数据
        getList () {
            let that = this,
                params = {
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    name: that.name,
                    status: that.selectedStatus,
                    adsenseId:that.adsenseId,
                    callBack: (res) => {
                        if (res && res.code==200 && res.data){
                            that.$Message.success('数据请求成功')
                            that.tableData.loading = false
                            that.tableData.data = res.data.rows
                            that.tableData.page.total = res.data.totalCount
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                };
            adManageMethod.getAllAdList(params)
        },
        // 删除广告
        handleDelete (row, index) {
            let that = this,
                name = row.name,
                id = row.id
            this.$Modal.confirm({
                title: '删除广告',
                content: '<p>删除广告【'+name+'】</p>',
                onOk: () => {
                    let params = {
                        id: id,
                        callBack: (res) => {
                            if (res && res.code===200) {
                                that.tableData.data.splice(index,1)
                                that.$Message.success('删除成功')
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    adManageMethod.handleDelete(params)
                }
            });
        },
        // 发布/取消发布
        handleRelease (row) {
            let that = this,
                name = row.name,
                type = (row.status==1) ? 2:1, // 1 发布 2 取消发布
                title = (row.status==1) ? '下架':'发布'
            this.$Modal.confirm({
                title: title + '广告',
                content: '<p>'+title+'广告【'+name+'】</p>',
                onOk: () => {
                    let params = {
                        id: row.id,
                        type: type,
                        callBack: (res) => {
                            if (res && res.code==200){
                                that.getList()
                                that.$Message.success('操作成功')
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    adManageMethod.handleRelease(params)
                }
            })
                
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


