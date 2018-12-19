<template>
    <div class="bg-white">
        <breadcrumb :breadcrumbs="breadcrumbs"></breadcrumb>
        
        <div class="pageFlatFormList">
            <Row type="flex" justify="start">
                <Col span="7"> 
                    <label>账号或姓名：</label>
                    <Input v-model="name" placeholder="请输入账号或姓名" style="width: 220px" />
                </Col>
                <Col span="6">
                    <label>角色：</label>
                    <Select v-model="selectCharacter" style="width:220px">
                        <Option v-for="item in characterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="6">
                    <label>状态：</label>
                    <Select v-model="selectStatus" style="width:220px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="2" offset="1"><Button type="primary" @click="searchAbout">查询</Button></Col>
            </Row>
            <Button type="primary" icon="ios-add" @click="addOrModify(1)">新建账号</Button>
        </div>
        
        <!-- 广告列表 -->
        <ivew-table :tableData="tableData"></ivew-table>
    </div>
</template>

<script>
let { systemConfigMethod, systemPrivileges } = require('../../script/page.js')
import ivewTable from "../../component/table/table.vue";
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
    data() {
        let that = this;
        return {
            breadcrumbs: ["系统配置", "系统成员"],
            statusList: [
                { value: 0, label: "全部" },
                { value: 1, label: "启用中" },
                { value: 2, label: "禁用中" }
            ],
            selectCharacter: "",
            characterList: [
                { value: 0, label: "超级管理员" },
                { value: 1, label: "管理员" },
                { value: 2, label: "攻略编辑" },
                { value: 3, label: "运营" },
                { value: 4, label: "客服" }
            ],
            name: "", // 账号或姓名
            selectStatus: 0, // 状态: 0.全部, 1.启用中, 2.禁用
            roleId: "",
            tableData: {
                page: {
                    total: 40,
                    currentPage: 1,
                    pageSize: 10
                },
                data: [
                    {
                        id: 1,
                        account: 123456,
                        name: "编辑aa",
                        charactor: "攻略编辑",
                        status: 1,
                        createTime: "2018-10-31"
                    },
                    {
                        id: 3,
                        account: 125678,
                        name: "管理员kk",
                        charactor: "管理员",
                        status: 2,
                        createTime: "2018-10-31"
                    }
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
                        title: "账号",
                        key: "userName",
                        align: 'center'
                    },
                    {
                        title: "真实姓名",
                        key: "realName",
                        align: 'center',
                        render: (h, params) => {
                            let realNameStr = params.row.realName ? params.row.realName : "/";
                            return h("span", {}, realNameStr);
                        }
                    },
                    {
                        title: "角色",
                        key: "sysRoleName",
                        align: 'center',
                        render: (h, params) => {
                            let sysRoleNameText = params.row.sysRoleName ? params.row.sysRoleName : "/";
                            return h("span", {}, sysRoleNameText);
                        }
                    },
                    {
                        title: "状态",
                        key: "status",
                        align: 'center',
                        render: (h, params) => {
                            let dealWithText = "";
                            if (params.row.status * 1 == 1) {
                                dealWithText = "启用中";
                            } else if (params.row.status * 1 == 2) {
                                dealWithText = "禁用中";
                            }
                            return h("span", {}, dealWithText);
                        }
                    },
                    {
                        title: "新建日期",
                        key: "createDate",
                        align: 'center'
                    },
                    {
                        title: "操作",
                        key: "action",
                        align: "center",
                        render: (h, params) => {
                            let btnText = "", btnType = "primary";
                            if(params.row.status * 1 == 1) {
                                btnText = "禁用"
                                btnType = "warning"
                            } else if(params.row.status * 1 == 2) {
                                btnText = "启用"
                            }
                            return h("div", [
                                h("Button",
                                    {
                                        props: { type: "success", size: "small" },
                                        style: { marginRight: "5px" },
                                        on: {
                                            click: () => {
                                                that.addOrModify(2, params.row);
                                            }
                                        }
                                    }, "编辑"),
                                h("Button",
                                    {
                                        props: { type: btnType, size: "small" },
                                        style: { marginRight: "5px" },
                                        on: {
                                            click: () => {
                                                that.handleStatusBtn(params.row);
                                            }
                                        }
                                    }, btnText),
                                h("Button",
                                    { 
                                        props: { type: "error", size: "small" },
                                        style: { marginRight: "5px" },
                                        on: {
                                            click: () => {
                                                that.handleDelete(params.row);
                                            }
                                        }
                                    }, "删除" )
                            ]);
                        }
                    }
                ],
                // 页码改变的回调，返回改变后的页码
                onChange: function(currentPage) {
                    that.tableData.page.currentPage = currentPage;
                    that.renderPage();
                },
                // 切换每页条数时的回调，返回切换后的每页条数
                onPageSizeChange: function(pageSize) {
                    that.tableData.page.currentPage = 1;
                    that.tableData.page.pageSize = pageSize;
                    that.renderPage();
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
        this.getRoleOptionList();
    },
    methods: {
        //重新渲染页面
        renderPage: function() {
            this.getList();
        },
        // 根据条件查询
        searchAbout() {
            this.tableData.page.currentPage = 1
            this.renderPage();
        },
        // 启用/禁用(normal)
        handleStatusBtn(row) {
            console.log("row:");
            console.log(row);
            let that = this,
                title = row.status == 1 ? "禁用" : "启用",
                changeToStatus = row.status == 1 ? 2 : 1
            that.$Modal.confirm({
                title: title + "系统成员",
                content: "<p>" + title + "系统成员【" + row.userName + "】</p>",
                onOk: () => {
                    let that = this,
                        data = {
                            userId: row.id * 1,
                            callBack: res => {
                                if (res && res.code == 200) {
                                    if(row.status == 1) {
                                        that.$Message.success("禁用成功");
                                    } else {
                                        that.$Message.success("启用成功");
                                    }
                                    that.renderPage();
                                } else {
                                    that.$Message.error(res.msg);
                                }
                            },
                        };
                    systemConfigMethod.changeMemberStatus(data);
                }
            });
        },
        addOrModify(type, row) {
            let that = this;
            switch (type) {
                case 1:
                    that.$router.push({ path: "/memberDetail" });
                    break;
                case 2:
                    that.$router.push({
                        path: "/memberDetail",
                        query: {
                            id: row.id
                        }
                    });
                    break;
            }
        },
        // 删除(normal)
        handleDelete(row) {
            let that = this;
            that.$Modal.confirm({
                title: '删除系统成员',
                content: '<p>删除系统成员【' + row.userName + '】?</p>',
                onOk: () => {
                    let params = {
                        id: row.id * 1,
                        callBack: (res) => {
                            if (res && res.code == 200) {
                                that.$Message.success('删除成功')
                                that.renderPage()
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    systemConfigMethod.memberDelete(params);
                }
            });
        },
        // (normal)
        getList() {
            let that = this,
                params = {
                    pageNo: that.tableData.page.currentPage,
                    pageSize: that.tableData.page.pageSize,
                    // roleId: that.selectCharacter, // 角色id
                    roleId: 0,
                    status: that.selectStatus == 0 ? "" : that.selectStatus,
                    userNameOrRealName: that.name,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.$Message.success("数据请求成功");
                            console.log(res.data);
                            that.tableData.data = res.data.rows;
                            that.tableData.page.total = res.data.totalCount;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    },
                };
            console.log(params)
            systemConfigMethod.getMemberList(params);
        },
        // 获取角色下拉列表(接口not permission)
        getRoleOptionList() {
            let that = this,
            params = {
                roleId: 0,
                pageNo: that.tableData.page.currentPage,
                pageSize: that.tableData.page.pageSize,
                callBack: res => {
                    if (res && res.code == 200 && res.data) {
                        console.log(res.data)
                    } else {
                        console.log(res)
                        that.$Message.error(res.msg);
                    }
                }
            };
            console.log(params)
            systemPrivileges.getRoleList(params);
        }
    }
};
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


