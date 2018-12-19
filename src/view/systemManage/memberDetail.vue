<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="formValidate" :label-width="120" :rules="ruleValidate" :model="formData">
                <FormItem label="账号：" prop="userName">
                    <Input v-model="formData.userName" placeholder="请输入账号"/>
                </FormItem>
                <FormItem label="真实姓名：" prop="realName">
                    <Input v-model="formData.realName" placeholder="请输入真实姓名"/>
                </FormItem>
                <FormItem label="联系电话：" prop="tel">
                    <Input v-model="formData.tel" placeholder="请输入联系电话"/>
                </FormItem>
                <FormItem label="密码：" prop="password">
                    <Input v-model="formData.password" type="password" placeholder="请输入6-18位包含数字、字母组合的密码"/>
                </FormItem>

                <FormItem label="状态：" prop="status">
                    <RadioGroup v-model="formData.status">
                        <Radio label="启用" class="adSenseDetai-radio"></Radio>
                        <Radio label="禁用"></Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="角色：" prop="roleId">
                    <Select v-model="formData.roleId" placeholder="请选择角色" style="width: 300px;">
                        <Option v-for="item in sysRoleList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                </FormItem>

                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                        <Button type="default" @click="handleCancel">取消</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
let { systemConfigMethod, systemPrivileges } = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
	props: {},
	data() {
        let validateTel = (rule, value, callback) => {
            let reg = /^(?:13\d|15\d|17\d|18\d|147)-?\d{5}(\d{3}|\*{3})$/
            if (!reg.test(value)) {
                return callback(new Error('手机号码格式不正确'));
            } else {
                callback();
            }
        }
        let validatePassword = (rule, value, callback) => {
            let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,18}$/
            if (!reg.test(value)) {
                return callback(new Error('请输入6-18位数字字母组合密码'));
            } else {
                callback();
            }
        }
        let currentId = this.$route.query.id;
		return {
			breadcrumbs: ["系统配置", "系统成员"],
            subTitle: currentId ? '编辑账号' : '新建账号',
            sysRoleList: [ // 从接口获取
                { id: 1, label: "超级管理员" },
                { id: 2, label: "管理员" },
                { id: 3, label: "攻略编辑" },
                { id: 4, label: "运营" },
                { id: 5, label: "客服" }
            ],
			formData: {
                id : currentId ? currentId : "",
                userName: "",
                realName: "",
                password: "",
                roleId: "",
                tel: "15549450385",
                status: "启用"
			},
			ruleValidate: {
				userName: [
					{ required: true, message: "账号不能为空", trigger: "blur" }
				],
				realName: [
					{ required: true, message: "真实姓名不能为空", trigger: "blur" }
				],
				tel: [
                    { required: true, message: "联系电话不能为空", trigger: "blur" },
                    { validator: validateTel, trigger: 'blur'}
				],
				password: [
					{ required: true, message: "密码不能为空", trigger: "blur" },
                    { type: 'string', min: 6, max: 18, message: '请输入6-18位的密码', trigger: 'blur' },
                    { validator: validatePassword, trigger: 'blur' }
                ],
				status: [
                    { required: true, message: "状态不能为空", trigger: "blur"  } 
                ],
                roleId: [
                    { required: true, message: "角色名称不能为空" }
                ]
			}
		};
	},
  	components: {
		breadcrumb
  	},
	mounted() {
		this.getDetailInfo()
	},
    methods: {
		getDetailInfo() {
			let that = this
            let detaiId = this.$route.query.id;
			if(detaiId) {
				let requestConfig = {
					method: "GET",
					publicUrlType: 1,
					// url: `/adsense/getadsensebyid/${detaiId}`,
					successCallback: res => {
						if (res && res.code == 200 && res.data) {
							that.$Message.success("数据请求成功");
							that.formData.account = res.data.account;
							that.formData.name = res.data.name;
							that.formData.tel = res.data.tel;
							that.formData.pwd = res.data.pwd;
							that.formData.chooseStatus = res.data.status == "1" ? "启用" : "禁用";
							that.formData.charactor = res.data.charactor;
						} else {
							that.$Message.error(res.msg);
						}
					},
					errorCallback: err => {
						that.$Message.error("数据请求失败");
					}
				};
				// common.ajax.request(requestConfig);
			}
        },
        // 获取角色下拉列表options
        getScenicsOptions() {
            let that = this,
                params = {
                    // name: that.name,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            // that.sysRoleList = res.data;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    },
                };
            // scenicsTicketsMethod.getScenicsOptions(params);
        },
        // (normal)
		handleSubmit(name) {
			let that = this;
		    that.$refs[name].validate(valid => {
				if (valid) {	
                    let params = {
                        userName: that.formData.userName,
                        realName: that.formData.realName,
						password: that.formData.password,
						roleId: that.formData.roleId,
						tel: that.formData.tel,
                        status: that.formData.status == "启用" ? "1" : "2",
                        callBack: res => {
                            if (res && res.code == 200) {
                                that.$Message.success("保存成功");
                                that.$router.go(-1);
							} else {
                                that.formData.status = that.formData.status == "1" ? "启用" : "禁用";
								that.$Message.error(res.msg);
							}
                        }
                    };
                    systemConfigMethod.submitMemberData(params);
				} else {
					that.$Message.error("请检查必填项");
				}
			});
		},
		handleCancel() {
            this.$Modal.confirm({
                title: '返回系统成员列表页？',
                onOk: () => {
                    this.$router.go(-1)
                }
            });
		}
    }
};
</script>


<style lang="less" scoped>
.page-form-group {
    padding: 24px;
    .ivu-row-flex {
        padding-top: 20px;
        margin-bottom: 16px;
        .ivu-btn {
        margin-right: 24px;
        }
    }
    .ivu-cover-image {
        width: 180px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        border: 1px dashed #dcdee2;
    }
    .red {
        color: #f00;
    }
}

.adSenseDetai-radio {
    margin-right: 65px;
}
</style>
