<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>

        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>酒店名称：</label>
                    <Input v-model="name" placeholder="请输入酒店名称" style="width: 220px" />
                </Col>
                <Col span="7">
                    <label>发布状态：</label>
                    <Select v-model="status" @on-change="statusChange" style="width:220px">
                        <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2"><Button type="primary" @click="getSearch">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addHotel">新建酒店</Button>
        </div>

        <ivew-table :tableData="table"></ivew-table>
        <Modal
        v-model="modal"
            :title="modalTitle"
            @on-cancel="cancel">
            <p v-if="modalType==1" style="text-align:center">
                <label>排序值</label>
                <Input v-model="sortNum" number placeholder="" style="width: 220px; margin-left: 20px" />
            </p>
            <p v-else style="text-align:center;color:red">{{ alertTitle }}</p>
            <p slot="footer" style="text-align:center">
                <Button type="primary" @click="confirm">确认</Button>
                <Button @click="cancel">取消</Button>
            </p>
    </Modal>
    </div>
</template>

<script>
let { hotelMethod } = require('../../script/page.js');
import ivewTable from "../../component/table/table.vue";
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
    data() {
        let self = this;
        return {
            breadcrumbs: ["酒店预订", "酒店管理"],
            name: '',
            status: 0,
            statusOptions: [
                { value: 0, label: '全部' },
                { value: 1, label: '已发布' },
                { value: 2, label: '待发布' }
            ],
            table: {
                columns: [
                    { title: '编号', type: 'index2', width: 60, align: 'center', render: (h, params) => {
                            return h("span", params.index + (self.table.page.currentPage - 1) * self.table.page.pageSize + 1)
                        } },
                    { title: '酒店名称', key: 'name', align: 'center' },
                    { title: '发布状态', key: 'releaseStatus', align: 'center', render: (h, params) => {
                        let statusTxt = '';
                        switch(params.row.releaseStatus) {
                            case 1:
                                statusTxt = '已发布';
                                break;
                            case 2:
                                statusTxt = '待发布';
                                break;
                            default:
                        }
                        return h('span', statusTxt);
                    } },
                    { title: '排序值', key: 'sort', align: 'center' },
                    { title: '房型', key: 'houseTypeStr', align: 'center' },
                    { title: '地址', key: 'address', align: 'center' },
                    { title: '操作', key: 'action', width: 360, align: 'center', render: (h, params) => {
                        if(params.row.releaseStatus == 1) {
                            return h('div', [
                                h('Button', {
                                    props: { type: 'warning', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click() {
                                            self.modal = true;
                                            self.modalType = 2;
                                            self.modalTitle = '下架酒店';
                                            self.alertTitle = '下架该酒店?';
                                            self.id = params.row.id;
                                        }
                                    }
                                }, '取消发布'),
                                h('Button', {
                                    props: { type: 'info', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click() {
                                            self.modalType = 1;
                                            self.modal = true;
                                            self.modalTitle = '排序';
                                            self.id = params.row.id;
                                            self.sortNum = params.row.sort;
                                        }
                                    }
                                }, '排序')
                            ]);
                        }else {
                            return h('div', [
                                h('Button', {
                                    props: { type: 'success', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click() {
                                            self.$router.push({
                                                path: 'hotelDetail',
                                                query: {
                                                    id: params.row.id
                                                }
                                            });    
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: { type: 'info', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click() {
                                            self.updateStatus(params.row.id, 1);
                                        }
                                    }
                                }, '发布'),
                                h('Button', {
                                    props: { type: 'primary', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click() {
                                            self.$router.push({
                                                path: 'HouseTypeDetail',
                                                query: {
                                                    hotelId: params.row.id
                                                }
                                            });     
                                        }
                                    }
                                }, '添加房型'),
                                h('Button', {
                                    props: { type: 'error', size: 'small' },
                                    style: { marginRight: '5px' },
                                    on: {
                                        click() {
                                            self.modal = true;
                                            self.modalType = 3;
                                            self.modalTitle = '删除酒店';
                                            self.alertTitle = '删除该酒店?';
                                            self.id = params.row.id; 
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }}
                ],
                data: [],
                page: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0,    
                },
                onChange: val => {
                    self.table.page.currentPage = val;
                    self.getList();
                },
                onPageSizeChange: val => {
                    self.table.page.currentPage = 1;
                    self.table.page.pageSize = val;
                    self.getList();
                }
            },
            modal: false,
            modalTitle: '',
            modalType: 1, // 1、2、3分别代表排序、下架酒店、 删除
            sortNum: 100,
            alertTitle: '',
            id: 0, // 处理数据的id
        }
    },
    components: {
        ivewTable,
        breadcrumb
    },
    created() {
        this.getList();
    },
    methods: {
        statusChange(val) {
            this.status = val;
        },
        addHotel() {
            this.$router.push('/hotelDetail');
        },
        cancel() {
            this.modal = false;
            this.sortNum = 100;
        },
        confirm() {
            let self = this;
            switch(self.modalType) {
                case 1:
                    self.handleSort();
                    break;
                case 2:
                    self.updateStatus(self.id, 2);
                    break;
                case 3:
                    self.deleteHotel();
                    break;
                default:
            }
        },
        getSearch() {
            this.table.page.currentPage = 1;
            this.getList();
        },
        getList() {
            let self = this;
            let params = {
                name: self.name,
                pageNo: self.table.page.currentPage,
                pageSize: self.table.page.pageSize,
                status: self.status,
                callBack(res) {
                    if(res && res.code == 200 && res.data) {
                        self.$Message.success('数据请求成功');
                        self.table.data = res.data.rows;
                        self.table.page.total = res.data.totalCount;
                    }else {
                        self.$Message.error('数据请求失败');
                    }
                }
            }
            hotelMethod.getHotelList(params);
        },
        updateStatus(id, type) {
            let self = this;
            let params = {
                id: id,
                type: type,
                callBack(res) {
                    if(res && res.code == 200) {
                        let updateTitle = type == 1 ? '发布成功' : '取消发布成功';
                        self.$Message.success(updateTitle);
                        self.modal = false;
                        self.getList();
                    }else {
                        let updateTitle = type == 1 ? '发布失败' : '取消发布失败';
                        self.$Message.error(updateTitle);
                    }
                }
            }
            hotelMethod.updateStatus(params);
        },
        handleSort() {
            let self = this;
            let params = {
                id: self.id,
                sort: self.sortNum,
                callBack(res) {
                    if(res && res.code == 200) {
                        self.$Message.success('排序成功');
                        self.modal = false;
                        self.sortNum = 100;
                        self.getList();
                    }else {
                        self.$Message.error('排序失败');
                    }
                }
            }
            hotelMethod.handleSort(params);
        },
        deleteHotel() {
            let self = this;
            let params = {
                id: self.id,
                callBack(res) {
                    if(res && res.code == 200) {
                        self.$Message.success('删除成功');
                        self.modal = false;
                        self.getList();
                    }else {
                        self.$Message.error('删除失败');
                    }
                }
            }
            hotelMethod.deleteHotel(params);
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
