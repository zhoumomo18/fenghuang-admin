<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="8"> 
                    <label>景点名称：</label>
                    <Input v-model="name" placeholder="请输入景点名称" style="width: 260px" />
                </Col>
                <Col span="2"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addScenics">新建景点</Button>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let { indexConfigMethod } = require('../../script/page.js')
import ivewTable from '../../component/table/table.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['首页配置','热门景区'],
            name: '', //用户输入的热门景点名称
            tableData: {
                page: {
                    total: 40,
                    currentPage: 1,
                    pageSize: 10
                },
                data: [
                    // {
                    //     id: 1,
                    //     name: '古镇门票',
                    //     isHot: 1, // isHot 0否 1是
                    //     ticketType: "成人票、儿童票、老年票"
                    // },
                    // {
                    //     id: 2,
                    //     name: '游船票',
                    //     isHot: 1,
                    //     ticketType: "成人票、儿童票、老年票、军人票"
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
                        title: '景区名称',
                        key: 'name',
                        align: 'center',
                    },
                    {
                        title: '封面图',
                        key: 'photo',
                        align: 'center',
                        render: (h, params) => {
                            let imgSrc = that.imagePrefix + params.row.fileList[0].src
                            return h('img', {
                                attrs: { src: imgSrc },
                                style: { width: "40px", height: "40px", verticalAlign: "middle" },
                                on: {
                                    click: () => {
                                        that.$Modal.info({
                                            title: '查看大图',
                                            render: (h) => {
                                                return h('div', [
                                                    h('img', {
                                                        attrs: { src: imgSrc },
                                                        style: { width: "200px", height: "200px", margin: "10px 0 10px 90px",
                                                        verticalAlign: "middle", border: "1px solid #ddd" }
                                                    })
                                                ]);
                                            }
                                        });
                                    }
                                }
                            })
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
                                    props: { type: "warning", size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click: () => {
                                            this.cancelHot(params.row)
                                        }
                                    }
                                }, "取消推到首页"),
                                h('Button', {
                                    props: { type: 'info', size: 'small', disabled: params.row.isUpDisabled },
                                    style: { marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.changeTheOrder(1, params.row, params.index)
                                        }
                                    }
                                }, '上移'),
                                h('Button', {
                                    props: { type: 'info', size: 'small', disabled: params.row.isDownDisabled },
                                    style: { marginRight: '5px'},
                                    on: {
                                        click: () => {
                                            this.changeTheOrder(2, params.row, params.index)
                                        }
                                    }
                                }, '下移')
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
        renderPage: function() {
            let self = this
            self.getList()
        },
        searchAbout: function() {
            this.getList();
        },
        // 热门景点的上移 下移 (normal)
        changeTheOrder: function(typeValue, row, index) {
            if(typeValue == 1) {
                this.tableData.data[index].isUpDisabled = "disabled"
            } else {
                this.tableData.data[index].isDownDisabled = "disabled"
            }
            let that = this,
                data =  {
                    id: row.id * 1,
                    type: typeValue,
                    callBack: (res) => {
                        console.log(res)
                        if (res && res.code == 200) {
                            that.$Message.success('操作成功')
                            that.getList();
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            indexConfigMethod.changeHotListOrder(data);
        },
        // 取消热门 (normal)
        cancelHot(row) {
            let that = this
            that.$Modal.confirm({
                title: '取消推到首页',
                content: '<p>取消【' + row.name + '】推到首页?</p>',
                onOk: () => {
                    let data = {
                        id: row.id,
                        callBack: res => {
                            if (res &&　res.code == 200) {
                                that.$Message.success('删除成功')
                                that.getList();
                            } else {
                                that.$Message.error(res.msg)
                            }
                        },
                        errorCallback: (err) => {
                            that.$Message.error('删除失败')
                        }
                    }
                    indexConfigMethod.cancelHotScenics(data);
                }
            });
        },
        // 跳转新建景点
        addScenics(type) {
            this.$router.push({ path: 'scenicsDetail' })
        },
        //  (normal)
        getList() { 
            let that = this,
                params = {
                    name: that.name,
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    callBack: res => {
                        if (res && res.code == 200) {
                            that.$Message.success("数据请求成功");
                            res.data.rows.map(item => {
                                item.isUpDisabled = false
                                item.isDownDisabled = false
                            })
                            that.tableData.data = res.data.rows;
                            that.tableData.page.total = res.data.totalCount;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    }
                }
            indexConfigMethod.getHotScenicsList(params);
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


