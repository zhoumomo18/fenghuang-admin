<template>
    <div class="header">
        <h3>凤凰旅游</h3>
        <Dropdown @on-click="handleDropdown">
            <a href="javascript:void(0)">
                你好，{{username}}
                <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem name="editPwd">修改密码</DropdownItem>
                <DropdownItem name="information">我的资料</DropdownItem>
                <DropdownItem name="loginOut">退出</DropdownItem>
            </DropdownMenu>
        </Dropdown> 

        <Modal 
            title="修改密码" 
            v-model="showEditPwdModal"
            class-name="vertical-center-modal">
            <Form ref="updatePwdForm" :rules="updatePwdFormRule" :model="pwdForm" :label-width="100">
                <FormItem label="账号：">
                    <Input v-model="username" disabled />
                </FormItem>
                <FormItem label="原密码：" prop="oldPassword">
                    <Input type="password" v-model="pwdForm.oldPassword" placeholder="请输入原密码" />
                </FormItem>
                <FormItem label="新密码：" prop="newPassword">
                    <Input type="password" v-model="pwdForm.newPassword" placeholder="6-18位数字字母的组合" />
                </FormItem>
                <FormItem label="重新输入：" prop="cPassword">
                    <Input type="password" v-model="pwdForm.cPassword" placeholder="请重新输入" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="showEditPwdModal=false">取消</Button>
                <Button type="primary" @click="handleEditPwd('updatePwdForm')">确定</Button>
            </div>
        </Modal>

        <Modal
            v-model="showInfomationModal"
            class-name="vertical-center-modal">
            <p slot="header">
                <span>个人资料</span>
                <Button type="primary" @click="handleEditInformationModal">修改资料</Button>
            </p>
            <div class="info-content-body">
                <Row type="flex" align="middle">
                    <Col class="label">账号：</Col>
                    <Col>{{userInfo.userName}}</Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col class="label">真实姓名：</Col>
                    <Col v-if="userInfo.realName">{{userInfo.realName}}</Col>
                    <Col v-else>未填写</Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col class="label">联系电话：</Col>
                    <Col v-if="userInfo.tel">{{userInfo.tel}}</Col>
                    <Col v-else>未填写</Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col class="label">密码：</Col>
                    <Col>*******</Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col class="label">角色：</Col>
                    <Col>管理员</Col>
                </Row>
            </div>
        </Modal>

        <Modal 
            title="修改资料"
            okText="保存"
            v-model="editInformationModal"
            class-name="vertical-center-modal">
            <Form ref="editInfoForm" :model="formInfo" :rules="editInfoFormRule" :label-width="100">
                <FormItem label="真实姓名：" prop="realName">
                    <Input v-model="formInfo.realName" placeholder="请输入真实姓名" />
                </FormItem>
                <FormItem label="联系电话：" prop="tel">
                    <Input v-model="formInfo.tel" placeholder="请输入联系电话" />
                </FormItem>
                <FormItem label="账号：">
                    <Input :value="username" placeholder="" disabled />
                </FormItem>
                <FormItem label="密码："> 
                    <Input value="******" placeholder="" disabled />
                </FormItem>
                <FormItem label="角色：">
                    <Input value="管理员" placeholder="" disabled />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="editInformationModal=false">取消</Button>
                <Button type="primary" @click="handleUpdateInfo('editInfoForm')">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
let { common, cacheClass } = require('../../script/common.js')
export default {
    data () {
        let that = this
        let validatePassPartern = (rule, value, callback) => {
            let partern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,18}$/
            if (!partern.test(value)) {
                return callback(new Error('密码格式不正确'));
            } else {
                callback();
            }
        }
        let validatePassCheck = (rule, value, callback) => {
            if (value !== that.pwdForm.newPassword) {
                return callback(new Error('两次密码不一致'));
            } else {
                callback();
            }
        }
        let validateTelPartern = (rule, value, callback) => {
            let partern = /^(?:13\d|15\d|17\d|18\d|147)-?\d{5}(\d{3}|\*{3})$/
            if (!partern.test(value)) {
                return callback(new Error('手机号码格式不正确'));
            } else {
                callback();
            }
        }
        return {
            showEditPwdModal: false, // 修改密码弹窗
            showInfomationModal: false, // 个人资料弹窗
            username: cacheClass.localStorage.get("GT_LOGININFO").userName,
            uid: cacheClass.localStorage.get("GT_LOGININFO").uid,
            editInformationModal:false, // 编辑个人资料弹窗
            userInfo: {
                username: '',
                realName: '',
                tel: '',
                updateDate: ''
            },
            pwdForm: {
                oldPassword: '',
                newPassword: '',
                cPassword: ''
            },
            updatePwdFormRule: {
                oldPassword: [
                    { required: true, message: '原密码不能为空', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' },
                    { max: 18, min: 6, message: '密码长度位6-18位', trigger: 'blur' },
                    { validator: validatePassPartern, trigger: 'blur' }
                ],
                cPassword: [
                    { required: true, message: '确认密码不能为空', trigger: 'blur' },
                    { max: 18, min: 6, message: '密码长度位6-18位', trigger: 'blur' },
                    { validator: validatePassPartern, trigger: 'blur' },
                    { validator: validatePassCheck, trigger: 'blur' }
                ],
            },
            formInfo: {
               realName: '',
               tel: '' 
            },
            editInfoFormRule:{
                realName: [
                    { required: true, message: '真实姓名不能为空', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' },
                    { validator: validateTelPartern, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        // 点击下拉列表
        handleDropdown (name) {
            let that = this
            switch (name) {
                case 'editPwd':
                that.showEditPwdModal = true
                break
                case 'information':
                that.showInfomationModal = true
                that.getUserInfo()
                break
                case 'loginOut':
                that.$router.push("/login")
                break
            }
        },
        // 控制个人资料弹窗显示
        handleEditInformationModal () {
            this.editInformationModal=true
            this.showInfomationModal = false
        },

        
        /***********************************调用接口************************************************************/
        // 修改密码
        handleEditPwd (name) {
            let that =this
            that.$refs[name].validate((valid) => {
                if (valid) {
                    let requestConfig = {
                        method: 'PUT',
                        url: "/SysUser/updatepassword",
                        publicUrlType:1,
                        params: {
                            oldPassword: that.pwdForm.oldPassword,
                            newPassword: that.pwdForm.newPassword,
                            cPassword: that.pwdForm.cPassword
                        },
                        successCallback: (res) => {
                            if(res.code==200 && !res.bizCode){
                                that.showEditPwdModal = false
                                that.$refs[name].resetFields()
                                that.$Message.success('修改成功，请重新登录')
                                setTimeout(() => {
                                    that.$router.push('login')
                                },2000)
                            }else{
                                that.$Message.error(res.msg)
                            }
                        },
                        errorCallback: (err) => {
                            that.$Message.error(err.msg)
                        }
                    }
                    common.ajax.request(requestConfig);
                    
                }else {
                    return false
                }
            })
        },
        // 获取个人资料
        getUserInfo () {
            let that = this,
                requestConfig = {
                    method: 'GET',
                    url: "/SysUser/get",
                    publicUrlType:1,
                    successCallback: (res) => {
                        if (res.code===200){
                            that.userInfo = res.data
                        }
                    } 
                }
            common.ajax.request(requestConfig)
        },
        // 修改个人资料
        handleUpdateInfo (name) {
            let that = this
            that.$refs[name].validate((valid) => {
                if(valid){
                    let requestConfig = {
                        method: 'PUT',
                        url: "/SysUser/update",
                        publicUrlType:1,
                        data: {
                            realName: that.formInfo.realName,
                            tel: that.formInfo.tel
                        },
                        successCallback: (res) => {
                            if(res.code==200){
                                that.editInformationModal=false
                                that.$refs[name].resetFields()
                                that.$Message.success('保存成功')
                            }else{
                                that.$Message.error(res.msg)
                            }
                        },
                        errorCallback: (err) => {
                            that.$Message.error(err.msg)
                        }
                    }
                    common.ajax.request(requestConfig);
                }
            })
        }
    }
}
</script>


<style lang="less" scoped>
.header{
    display: flex;
    justify-content: space-between;
    h3{
        color: #fff;
        font-size: 24px;
    }
    a{
        color: #fff;
    }
    .ivu-dropdown{
        font-size: 16px;
        color: #fff;
    }
}
.ivu-row-flex-middle{
    padding-left: 160px;
    .label{
        width:80px; 
        text-align:right;
        padding:10px 12px 10px 0;
        box-sizing:border-box;
    }
}
.ivu-modal-header .ivu-btn-primary{
    position:absolute;
    right:50px;
    top:10px;
}
</style>

