<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>栏目名称：</label>
                    <Input v-model="name"  placeholder="请输入栏目名称" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>发布状态：</label>
                    <Select v-model="selectedStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="handleEdit(1)">新建栏目</Button>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>

        <!-- 新增/编辑栏目弹窗 -->
        <Modal 
            :title="title"
            okText="保存"
            v-model="columnModal"
            class-name="vertical-center-modal">
            <Form ref="columnForm" :model="formData" :rules="columnForm">
                <FormItem prop="textarea">
                    <Input v-model="formData.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入栏目名，4个字以内"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="columnModal=false">取消</Button>
                <Button type="primary" @click="handleConfirm('columnForm')">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
let {tourManageMethod} = require('../../script/page.js')
import ivewTable from '../../component/table/table.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            breadcrumbs: ['旅游攻略','栏目管理'],
            statusList: [
                {value: 0, label: '全部'},
                {value: 1, label: '启用中'},
                {value: 2, label: '禁用中'},
            ],
            name: '', // 栏目名称
            selectedStatus: '',// 状态: 0.全部,1.发布中,2.待发布。默认全部。
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
                        title: '栏目名称',
                        key: 'name'
                    },
                    {
                        title: '攻略数',
                        key: 'num'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            let dealWithText = (params.row.status==1) ? '启用中':'禁用中'
                            return h('span',{},dealWithText)
                        }
                    },
                    {
                        title: '操作人',
                        key: 'userName'
                    },
                    {
                        title: '操作',
                        width: 240,
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let dealWithText = (params.row.status==1) ? '禁用':'启用'
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        disabled: params.row.isUpDisabled
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.moveDownUp(1,params)
                                        }
                                    }
                                }, '上移'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: params.row.isDownDisabled
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.moveDownUp(2,params)
                                        }
                                    }
                                }, '下移'),
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
                                            this.handleEdit(2,params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: (params.row.status==1) ? 'error':'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleDisable(params.row)
                                        }
                                    }
                                }, dealWithText)
                            ])
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
            },
            columnModal: false,
            title: '新建栏目',
            formData: {
                textarea: '',
                id: ''
            },
            columnForm: {
                textarea:[
                    {required: true, message:'栏目名称不能为空', trigger: 'blur'},
                    {max: 4, message: '栏目名称4个字以内', trigger: 'blur' }
                ]
            }
        }
    },
    components: {
        ivewTable,
        breadcrumb
    },
    mounted () {
        this.getList()
    },
    methods: {
        renderPage: function () {
            let self = this
            self.getList()
        },
        // 选择状态
        handleChangeStatus(value) {
            this.selectedStatus = value
        },
        // 根据条件查询
        searchAbout () {
            this.tableData.page.currentPage=1
            this.renderPage()
        },
        /** 打开新增/编辑弹窗
        * @param {number} type 1：新建 2：编辑
        * @param {string} row 当前行栏目
        **/
        handleEdit (type, row) {
            let that = this
            that.columnModal = true
            switch(type){
                case 1:
                that.title = '新建栏目'
                that.formData.textarea = ''
                break
                case 2:
                that.title = '编辑栏目'
                that.formData.textarea = row.name
                that.formData.id = row.id
                break
            }
        },

        /***********************************调用接口************************************************************/
        // 栏目列表数据请求
        getList () {
            let that = this,
                params = {
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    name: that.name,
                    status: that.selectedStatus,
                    callBack: (res) => {
                        if (res && res.code===200 && res.data){
                            that.$Message.success('数据请求成功')
                            res.data.rows.map(item => {
                                item.isUpDisabled = false
                                item.isDownDisabled = false
                            })
                            that.tableData.loading = false
                            that.tableData.data = res.data.rows
                            that.tableData.page.total = res.data.totalCount
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            tourManageMethod.getAllColumnList(params)
        },
        // 上移/下移
        moveDownUp (type,param) {
            if(type == 1) {
                this.tableData.data[param.index].isUpDisabled = "disabled"
            } else {
                this.tableData.data[param.index].isDownDisabled = "disabled"
            }
            let that = this,
                tableList = that.tableData.data,
                index = param.index,
                params = {
                    type: type,
                    id: param.row.id,
                    callBack: (res) => {
                        if (res && res.code==200){
                            that.$Message.success('操作成功')
                            that.getList() // 重新请求数据                   
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            tourManageMethod.moveDownUp(params)
        },
        // 保存新增/编辑栏目
        handleConfirm (name) {
            let that = this,
                currentUrl = that.formData.id ? '/column/update':'/column/create',
                currentMethod = that.formData.id ? 'PUT':'POST'
            that.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        method: currentMethod,
                        url: currentUrl,
                        id: that.formData.id,
                        name: that.formData.textarea,
                        callBack: (res) => {
                            if (res && res.code==200){
                                that.columnModal = false //关闭弹窗
                                that.getList() // 重新请求数据
                                that.$Message.success('保存成功')
                                that.$refs[name].resetFields()
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    tourManageMethod.handleItemSubmit(params)
                    
                } else {
                    return false
                }
            })
        },
        // 启用/禁用 status 1: 禁用 2：启用
        handleDisable (row) {
            let that= this,
                title = (row.status==1) ? '禁用':'启用',
                content = (row.status==1) ? '<p>禁用后该栏目及该栏目下的攻略均不显示</p>':''
                name = row.name
            this.$Modal.confirm({
                title: title+'栏目',
                content: '<p>'+title+'栏目【'+name+'】</p>'+content,
                onOk: () => {
                    let requestConfig = {
                        id: row.id,
                        type: (row.status==1) ? 2:1,
                        callBack: (res) => {
                            if (res && res.code===200){
                                row.status = (row.status==1) ? 2:1
                                that.$Message.success('操作成功')
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    tourManageMethod.handleColumnDisable(requestConfig)
                }
            });
        },
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


