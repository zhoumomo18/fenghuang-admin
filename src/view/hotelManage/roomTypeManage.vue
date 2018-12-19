<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="8"> 
                    <label>酒店名称或房型名称：</label>
                    <Input v-model="name" placeholder="请输入酒店名称或房型名称" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>发布状态：</label>
                    <Select v-model="selectStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
        </div>
        
        <!-- 房型列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let { hotelMethod } = require('../../script/page.js')
import ivewTable from '../../component/table/table.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            breadcrumbs: ['酒店预订','房型配置'],
            name: '', // 用户输入的酒店名称或房型名称
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
                        title: '房型',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '酒店名称',
                        key: 'hotelName',
                        align: 'center'
                    },
                    {
                        title: '配置',
                        key: 'housingConfigurationName',
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.housingConfigurationName ? params.row.housingConfigurationName : "/";
                            return h("span", text)
                        }
                    },
                    {
                        title: '操作',
                        width: 360,
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: { type: 'success', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path:'/HouseTypeDetail',
                                                query: {
                                                    id: params.row.id, // 房型id, 查看房型的详细信息
                                                    hotelId: params.row.hotelId
                                                }
                                            })
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: { type: 'info', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                path:'/roomTypeDetail',
                                                query: {
                                                    id: params.row.id * 1 // 房型id, 查看房型的配置信息
                                                }
                                            })
                                        }
                                    }
                                }, "房型配置"),
                                h('Button', {
                                    props: { type: 'error', size: 'small' },
                                    style: { marginRight: '5px' },
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
        // 删除房型 (normal)
        handleDelete(row) {
            let that = this
            that.$Modal.confirm({
                title: '删除房型',
                content: '<p>删除房型【' + row.name + '】?</p>',
                onOk: () => {
                    let params = {
                        id: row.id * 1, // 获取的是房型id
                        callBack: (res) => {
                            if (res && res.code == 200) {
                                that.$Message.success('删除成功')
                                that.renderPage()
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    hotelMethod.roomTypeDelete(params);
                }
            });
        },
        // (normal)
        getList() {
            let that = this,
                params = {
                    name: that.name,
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    status: that.selectStatus,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.$Message.success("数据请求成功");
                            console.log("roomTypeList:");
                            console.log(res.data);
                            that.tableData.data = res.data.rows;
                            that.tableData.page.total = res.data.totalCount;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    }
                };
            hotelMethod.getRoomTypeList(params);
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


