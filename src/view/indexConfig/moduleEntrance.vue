<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>模块名称：</label>
                    <Input v-model="name"  placeholder="请输入模块名称" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>状态：</label>
                    <Select v-model="selectedStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addEntrance(1)">新建模块</Button>
        </div>
        
        <!-- <Table border :columns="columns4" :data="data1" :style="{margin: '24px'}"></Table>
        <Page :total="40" size="small" show-elevator show-sizer show-total /> -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let {indexConfigMethod} = require('../../script/page.js')
import ivewTable from '../../component/table/table.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['首页配置','模块入口'],
            statusList: [
                {value: 0, label: '全部'},
                {value: 1, label: '已发布'},
                {value: 2, label: '待发布'}
            ],
            name: '', // 模块名称
            selectedStatus: '', // 状态: 0.全部,1.已发布,2.待发布。默认全部。
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
                            return h('span', params.index + (that.tableData.page.currentPage- 1) * that.tableData.page.pageSize + 1);
                        }
                    },
                    {
                        title: '模块名称',
                        key: 'name'
                    },
                    {
                        title: '模块图标',
                        key: 'icon',
                        render:(h, params) => {
                            return h('img', {
                                style: {
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%'
                                },
                                attrs: {
                                    src: that.imagePrefix + params.row.fileList[0].src
                                }
                            })
                        }
                    },
                    {
                        title: '状态',
                        width:150,
                        key: 'status',
                        render: (h, params) => {
                            let dealWithText = ''
                            if(params.row.status==1){
                                dealWithText = "已发布"
                            }else if(params.row.status==2){
                                dealWithText = "待发布"
                            }
                            return h('span',{}, dealWithText)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let dealWithText =  (params.row.status==1) ? '取消发布':'发布'
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
                                            this.addEntrance(2, params.row.id)
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
                                        display:(params.row.status==1)?"none":"inline-block",
                                    },
                                    on: {
                                        click: () => {
                                            this.handlDelEntrance(params.row.id)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                onChange: function(val){
                    that.tableData.page.currentPage = val
                    that.renderPage()
                },
                onPageSizeChange: function(val){
                    that.tableData.page.currentPage = 1
                    that.tableData.page.pageSize = val
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
        this.getAllList()
    },
    methods: {
        //重新渲染页面
        renderPage () {
            this.getAllList()
        },
        // 根据条件查询
        searchAbout () {
            this.tableData.page.currentPage=1
            this.renderPage();
        },
        // 打开新增/编辑模块口
        addEntrance (type, id) {
            let that = this
            switch(type){
                case 1:
                that.$router.push({path:'moduleEntranceDetail'})
                break
                case 2:
                that.$router.push({
                    path:'moduleEntranceDetail',
                    query: {
                        id: id
                    }
                })
                break
            }
        },
        // 获取按钮权限
        getButtonList () {
            let childObj = JSON.parse(localStorage.getItem('childObj'))
            console.log(childObj)
        },
        // 交换数组元素
        // swapItems (arr,index1, index2) {
        //     arr[index1] = arr.splice(index2,1,arr[index1])[0]
        //     return arr
        // },

        /***********************************调用接口************************************************************/
        // 请求模块入口列表数据
        getAllList () {
            let that = this,
                params = {
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    name: that.name,
                    status: that.selectedStatus,
                    callBack: (res) => {
                        if (res && res.code==200 && res.data){
                            that.$Message.success('数据请求成功')
                            res.data.rows.map(item => {
                                item.isUpDisabled = false
                                item.isDownDisabled = false
                            })
                            that.tableData.loading = false
                            that.tableData.data = res.data.rows;
                            that.tableData.page.total = res.data.totalCount;
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }  
            indexConfigMethod.getAllModuleList(params);
        },
        // 发布/取消发布
        handleRelease (row) {
            let that = this,
                name = row.name,
                type = (row.status==1) ? 2:1, // type 1:发布 2：取消发布
                title = (row.status==1) ? '取消发布':'发布'
                that.$Modal.confirm({
                    title: title,
                    content: '<p>确认'+title+'【'+name+'】模块吗？</p>',
                    onOk: () => {
                        let params = {
                            id: row.id,
                            type: type,
                            callBack: (res) => {
                                if (res && res.code==200){
                                    row.status = (row.status==1) ? 2:1
                                    that.$Message.success('操作成功')
                                } else {
                                    that.$Message.error(res.msg)
                                }
                            }
                        }
                        indexConfigMethod.handleRelease(params)
                    }
            })
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
                params = {
                    type: type,
                    id: param.row.id,
                    callBack: (res) => {
                        if (res && res.code==200){
                            that.$Message.success('操作成功')
                            that.getAllList()
                            // switch (type) {
                            //     case 1:
                            //     if (tableList.length > 1 && index !==0) {
                            //         tableList = that.swapItems(tableList, index, index-1)
                            //     }
                            //     break
                            //     case 2:
                            //     if (tableList.length > 1 && index !==tableList.length-1){
                            //         tableList = that.swapItems(tableList, index, index+1)
                            //     }
                            //     break
                            // }
                            
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            indexConfigMethod.moveDownUp(params)
        },
        // 删除
        handlDelEntrance (id) {
            let that = this
            that.$Modal.confirm({
                title: '删除模块',
                content: '<p>确认删除模块吗</p>',
                onOk: () => {
                    let params = {
                    id: id,
                    callBack: (res) => {
                        if (res &&　res.code==200){
                            // that.tableData.data.splice(index,1)
                            that.tableData.data = that.tableData.data.filter(t => t.id !=id)
                            that.$Message.success('删除成功')
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
                indexConfigMethod.handlDelEntrance(params)
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

