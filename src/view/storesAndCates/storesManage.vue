<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>

        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7">
                    <label>商家名称：</label>
                    <Input v-model="name" placeholder="请输入商家名称" style="width: 220px"/>
                </Col>
                <Col span="7">
                    <label>发布状态：</label>
                    <Select v-model="selectStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="searchAbout">查询</Button>
                </Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addOrModify(1)">新建商家</Button>
        </div>

        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
    let {storesAndCatesMethod} = require('../../script/page.js')
    import ivewTable from '../../component/table/table.vue'
    import breadcrumb from "../../component/template/breadCrumb.vue"

    export default {
        data() {
            let that = this
            return {
                breadcrumbs: ['商家美食', '商家管理'],
                name: '', // 用户输入的商家名称
                statusList: [
                    {value: 0, label: '全部'},
                    {value: 1, label: '已发布'},
                    {value: 2, label: '待发布'},
                ],
                selectStatus: 0,
                tableData: {
                    page: {
                        total: 40,
                        currentPage: 1,
                        pageSize: 10
                    },
                    data: [
                        // {
                        //     id: 1,
                        //     name: '商家1',
                        //     publishState: 2,
                        //     sort: 100,
                        //     createDate: "2018-11-14T14:50:04.000+0000"
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
                            title: '商家名称',
                            key: 'name',
                            align: 'center'
                        },
                        {
                            title: '发布状态',
                            key: 'publishState',
                            align: 'center',
                            render: (h, params) => {
                                let dealWithText = ''
                                if (params.row.publishState * 1 == 1) {
                                    dealWithText = '已发布'
                                } else if (params.row.publishState * 1 == 2) {
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
                            title: '发布时间',
                            key: 'publishTime',
                            align: 'center'
                        },
                        {
                            title: '操作',
                            width: 360,
                            key: 'action',
                            align: 'center',
                            render: (h, params) => {
                                let btnText = "", displayDelete = "", displayMoveOrSort = "", btnType = "info";
                                if (params.row.publishState * 1 == 1) {
                                    btnText = "取消发布"
                                    btnType = "warning"
                                    displayDelete = "none"
                                } else if (params.row.publishState * 1 == 2) {
                                    btnText = "发布"
                                    displayMoveOrSort = "none"
                                }
                                let isDisabled = params.row.ishot == 0 ? false : "disabled";
                                return h('div', [
                                    h('Button', {
                                        props: {type: 'success', size: 'small'},
                                        style: {marginRight: '5px'},
                                        on: {
                                            click: () => {
                                                this.addOrModify(2, params.row)
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {type: btnType, size: 'small'},
                                        style: {marginRight: '5px'},
                                        on: {
                                            click: () => {
                                                this.changePublishStatus(params.row)
                                            }
                                        }
                                    }, btnText),
                                    h('Button', {
                                        props: {type: 'info', size: 'small'},
                                        style: {marginRight: '5px', display: displayMoveOrSort},
                                        on: {
                                            click: () => {
                                                this.sortByNum(params.row)
                                            }
                                        }
                                    }, '排序'),
                                    h('Button', {
                                        props: {type: 'primary', size: 'small'},
                                        style: {marginRight: '5px'},
                                        on: {
                                            click: () => {
                                                this.addMenuItems(params.row);
                                            }
                                        }
                                    }, '添加菜单'),
                                    h('Button', {
                                        props: {type: 'error', size: 'small'},
                                        style: {marginRight: '5px', display: displayDelete},
                                        on: {
                                            click: () => {
                                                this.handleDelete(params.row, params.index)
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }
                    ],
                    // 页码改变的回调，返回改变后的页码
                    onChange: function (currentPage) {
                        that.tableData.page.currentPage = currentPage
                        that.renderPage()
                    },
                    // 切换每页条数时的回调，返回切换后的每页条数
                    onPageSizeChange: function (pageSize) {
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
            //  (normal)
            searchAbout: function () {
                this.tableData.page.currentPage = 1
                this.getList();
            },
            // 排序 (normal)
            sortByNum(row) {
                let that = this,
                    inputValue = row.sort;
                that.$Modal.confirm({
                    title: '排序值',
                    render: (h) => {
                        return h('Input', {
                            props: {value: row.sort, autofocus: true},
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
                                    console.log(res)
                                    that.$Message.error(res.msg)
                                }
                            }
                        }
                        storesAndCatesMethod.storesSort(data);
                    }
                });
            },
            // 添加菜单
            addMenuItems(row) {
                this.$router.push({
                    path: "/menuItemDetail",
                    query: {
                        id: row.id
                    }
                });
            },
            // 删除商家 (normal)
            handleDelete(row, index) {
                let that = this
                that.$Modal.confirm({
                    title: '删除该商家',
                    content: '<p>删除该商家【' + row.name + '】?</p>',
                    onOk: () => {
                        let data = {
                            id: row.id,
                            callBack: (res) => {
                                if (res && res.code == 200) {
                                    that.$Message.success('删除成功')
                                    that.tableData.data.splice(index, 1)
                                } else {
                                    console.log(res)
                                    that.$Message.error(res.msg)
                                }
                            }
                        }
                        storesAndCatesMethod.storesDelete(data);
                    }
                });
            },
            // 新增/编辑
            addOrModify(type, row) {
                let that = this
                switch (type) {
                    case 1:
                        that.$router.push({path: '/storeManageDetail'})
                        break;
                    case 2:
                        that.$router.push({
                            path: '/storeManageDetail',
                            query: {
                                id: row.id * 1
                            }
                        })
                        break;
                }
            },
            // 商家发布/取消发布 (normal)
            changePublishStatus(row) {
                let that = this,
                    title = row.publishState == 1 ? "下架" : "发布",
                    changeToStatus = row.publishState == 1 ? 2 : 1;
                this.$Modal.confirm({
                    title,
                    content: "<p>" + title + "商家：【" + row.name + "】？</p>",
                    onOk: () => {
                        let data = {
                            id: row.id * 1,
                            type: changeToStatus * 1,
                            callBack: res => {
                                if (res && res.code == 200) {
                                    that.$Message.success("操作成功");
                                    that.renderPage();
                                } else {
                                    console.log(res)
                                    that.$Message.error(res.msg);
                                }
                            }
                        };
                        console.log(data)
                        storesAndCatesMethod.changeStoresStatus(data);
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
                                console.log(res.data)
                                that.tableData.data = res.data.rows;
                                that.tableData.page.total = res.data.totalCount;
                            } else {
                                that.$Message.error(res.msg);
                            }
                        },
                    };
                storesAndCatesMethod.getStoresList(params);
            }
        }
    }
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


