<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="ruleForm" :rules="ruleForm" :model="formData" :label-width="120">
                <FormItem label="角色名称：" prop="name">
                    <Input v-model="formData.name" placeholder="请输入票种名称" style="width: 90%;"/>
                </FormItem>
                <p style="margin-left: 35px;font-size: 12px;margin-bottom: 20px;">
                    <span style="color: #ed4014;font-family: SimSun;font-size: 12px;">*</span>
                    <span>选择权限范围：</span>
                </p>
                <FormItem style="margin-left: -80px;">
                    <table border="1" bordercolor="#ccc" cellspacing="0" cellpadding="0" height="362" width="90.6%">
                        <tr align="center">
                            <td width="20%">菜单</td>
                            <td width="20%">子菜单</td>
                            <td width="60%">权限范围</td>
                        </tr>
                        <tr align="center">
                            <td rowspan="2">首页配置</td>
                            <td>模块入口</td>
                            <td></td>
                        </tr>
                        <tr align="center">
                            <td>热门景点</td>
                            <td></td>
                        </tr>
                        <tr align="center">
                            <td rowspan="2">旅游攻略</td>
                            <td>攻略管理</td>
                            <td></td>
                        </tr>
                        <tr align="center">
                            <td>栏目管理</td>
                            <td></td>
                        </tr>
                        <tr align="center">
                            <td rowspan="2">广告管理</td>
                            <td>广告列表</td>
                            <td></td>
                        </tr>
                        <tr align="center">
                            <td>广告位管理</td>
                            <td></td>
                        </tr>
                        <tr align="center">
                            <td rowspan="2">系统配置</td>
                            <td>系统成员</td>
                            <td></td>
                        </tr>
                        <tr align="center">
                            <td>角色与权限</td>
                            <td></td>
                        </tr>
                    </table>
                </FormItem>
                <FormItem>
                    <div class="editLogBox">
                        <p class="logBoxTitle">编辑日志</p>
                        <ul class="logUl">
                            <li v-for="(item, index) in listLogs" :key="index">
                                <span>编辑：</span>
                                <span class="editor">{{ item.userName }}</span>
                                <span>编辑时间：</span>
                                <p class="editTime" v-if="item.updateDate">
                                    <span class="editYear">{{ item.updateDate.substring(0, 10) }}</span>
                                    <span>{{ item.updateDate.substring(11, 19) }}</span>
                                </p>
                            </li>
                        </ul>
                        <span class="viewMoreBtn" @click="showAllLogs" v-if="isShowMoreBtn">更多</span>
                    </div>
                </FormItem>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmitData('ruleForm')" style="margin-right: 50px;margin-left: -60px;">确认</Button>
                        <Button type="default" @click="handleCancelBtn">取消</Button>
                    </Row>
                </FormItem>
            </Form>

            

        </div>
    </div>
</template>

<script>
let { systemConfigMethod } = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this;
        return {
            breadcrumbs: ['系统配置', '角色与权限'],
            subTitle: (that.$route.query.id) ? '编辑角色' : '新建角色',
            currentItemId: that.$route.query.id,
            formData: {
                name: ""
            },
            listLogs: [],
            isShowMoreBtn: false,
            ruleForm: {
                name: [
                    { required: true, message: '角色名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    components: {
        breadcrumb
    },
    mounted () {
        this.getRoleDetailById()
        // this.getScenicsOptions()
    },
    methods: {
        // 
        getRoleDetailById () {
            let that = this
            if(that.currentItemId) {
                let params = {
                    id: that.currentItemId,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            console.log(res)
                            that.$Message.success("数据请求成功");
                            that.formData = res.data;
                            // if(res.data.listLogs.length <= 2) {
                            //     that.isShowMoreBtn = false; // 小于2条不显示更多按钮
                            // } else {
                            //     that.isShowMoreBtn = true; // 多于2条初始显示按钮并截取列表
                            // }
                            // 编辑日志显示listLogs反序0、1
                            // that.listLogs = res.data.listLogs.reverse().slice(0, 2)
                        } else {
                            that.$Message.error(res.msg);
                        }
                    }
                };
                // systemConfigMethod.getRoleDetailById(params);
            }
        },
        //  获取景点下拉列表options
        getScenicsOptions() {
            let that = this,
                params = {
                    name: that.name,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.scenicsOptions = res.data;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    },
                };
            // systemConfigMethod.getOptions(params);
        },
        // 保存
        handleSubmitData(name) {
			let that = this;
		    that.$refs[name].validate(valid => {
				if (valid) {	
					let data = {
						// id: that.currentItemId ? that.currentItemId * 1 : null,
                        // name: that.formData.name,
                        // scenicid: that.formData.scenicid,
                        // price: that.formData.price * 1,
                        // expirydate: that.formData.expirydate * 1,
                        // status: type,
                        callBack: res => {
							if (res && res.code == 200) {
                                if(type == 1) {
                                    that.$Message.success("发布成功");
                                } else {
                                    that.$Message.success("保存成功");
                                }
                                that.$router.go(-1); // 保存成功，返回上一级
							} else {
								that.$Message.error(res.msg);
							}
						}
                    };
                    // systemConfigMethod.handleSubmit(data);
				} else {
					that.$Message.error("请检查必填项");
				}
			});
        },
        // 点击更多，显示所有log信息并隐藏更多按钮
        showAllLogs() {
            // this.listLogs = this.formData.listLogs;
            this.isShowMoreBtn = false;
        },
        // 取消按钮，返回上一级
        handleCancelBtn () {
            this.$Modal.confirm({
                title: '确认返回上一页？',
                onOk: () => {
                    this.$router.go(-1)
                }
            });
        }
    }
}
</script>


<style lang="less" scoped>
.page-form-group {
    padding: 24px;
    font-size: 14px;
    .editLogBox {
        width: 97.5%;
        margin-top: 35px;
        margin-left: -80px;
        border: 1px solid #ddd;
        .logBoxTitle {
            height: 40px;
            line-height: 40px;
            text-indent: 30px;
            font-size: 14px;
            font-weight: bold;
            background-color: #f5f5f5;
            border-bottom: 1px solid #ddd;
        }
        .logUl {
            margin: 20px 30px;
            line-height: 40px;
            font-size: 14px;
            li {
                .editor {
                    display: inline-block;
                    width: 320px;
                    padding-left: 15px;
                }
                .editTime {
                    display: inline-block;
                    .editYear {
                        padding-right: 10px;
                    }
                }
            }
        }
        .viewMoreBtn {
            display: inline-block;
            text-indent: 30px;
            font-size: 14px;
            height: 40px;
            text-decoration: none;
            color: #09f;
            cursor: pointer;
        }
    }
}
</style>
