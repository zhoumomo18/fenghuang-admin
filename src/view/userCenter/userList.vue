<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>昵称：</label>
                    <Input v-model="nickName"  placeholder="请输入昵称" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>性别：</label>
                    <Select v-model="gender" style="width:220px">
                        <Option v-for="item in genderList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
        </div>
        
        <!-- <Table border :columns="columns4" :data="data1" :style="{margin: '24px'}"></Table>
        <Page :total="40" size="small" show-elevator show-sizer show-total /> -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let {userManageMethod} = require('../../script/page.js')
import ivewTable from '../../component/table/table.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            breadcrumbs: ['用户中心','用户列表'],
            genderList: [
                {value: '0', label: '全部'},
                {value: '1', label: '男'},
                {value: '2', label: '女'},
            ],
            gender: '',
            nickName: '',
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
                        title: '昵称',
                        key: 'nickName'
                    },
                    {
                        title: '头像',
                        key: 'headUrl',
                        render: (h, params) => {
                            return h('img', {
                                style: {
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%'
                                },
                                attrs: {
                                    src: params.row.headUrl
                                }
                            })
                        }
                    },
                    {
                        title: '性别',
                        key: 'gender',
                        render: (h,params) => {
                            let dealWithText
                            if(params.row.gender==1){
                                dealWithText='男'
                            }else if(params.row.gender==2){
                                dealWithText='女'
                            }else{
                                dealWithText='-'
                            }
                            return h('span',{},dealWithText)
                        }
                    },
                    {
                        title: '省市',
                        key: 'area',
                        render: (h,params) => {
                            return h('span',{},params.row.province+' '+params.row.city)
                        }
                    },
                    {
                        title: '最近登入时间',
                        key: 'loginDateFormat'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: { type: 'info', size: 'small' },
                                    on: {
                                        click: () => {
                                            this.viewTheInfo(params.row)
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
        this.getUserList()
    },
    methods: {
        //重新渲染页面
        renderPage () {
            this.getUserList()
        },
        // 根据条件查询
        searchAbout () {
            this.tableData.page.currentPage=1
            this.renderPage()
        },
        // 点击列表查看按钮
        viewTheInfo (row) {
            let realNameStr = row.realName ? row.realName : "未填写",  
                phoneStr = row.phone ? row.phone : "未填写", 
                idCardStr = row.idCard ? row.idCard : "未填写";
            this.$Modal.info({
                title: '查看',
                render: (h) => {
                    return h('div', [
                        h('p', {
                            style: { margin: '8px 0 0 8px' }
                        }, "真实姓名：" + realNameStr),
                        h('p', {
                            style: { margin: '8px 0 0 8px' }
                        }, "联系电话：" + phoneStr),
                        h('p', {
                            style: { margin: '8px 0 0 8px' }
                        }, "身份证号：" + idCardStr)
                    ]);
                }
            });
        },
        /***********************************调用接口************************************************************/
        getUserList () {
            let that = this,
                params = {
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    nickName: that.nickName,
                    gender: that.gender,
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
                }
            userManageMethod.getUserList(params)
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

