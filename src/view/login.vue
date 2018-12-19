<template>
    <div class="login-wrap">
        <div class="login-content">
            <!-- <img style="left:80px;top:50px;position:absolute;" width="550" height="91"
                 src="../../src/assets/images/login.png" alt=""><br> -->
            <div class="login-box">
                <Form :model="ruleForm" :rules="rules" ref="ruleForm" class="login-ruleForm">
                    <FormItem prop="userName">
                        <input class="form-input" :maxlength="11" v-model="ruleForm.userName" placeholder="请输入您的账号"
                                  :autofocus=true />
                    </FormItem>
                    <FormItem prop="password" class="el-form-item-last">
                        <input class="form-input" :maxlength="20" type="password" placeholder="请输入您的密码"
                                  v-model="ruleForm.password" @keyup.enter="handleLogin('ruleForm')" />
                    </FormItem>
                    <div class="forget-pwd">
                        <span @click="dialogVisible = true">忘记密码</span>
                    </div>
                    <div>
                        <Button class="login-btn" type="primary" @click="handleLogin('ruleForm')" :loading="loading">登 录</Button>
                    </div>
                </Form>
            </div>
        </div>

        <Modal
                v-model="dialogVisible"
                width="420px"
                top="20%">
            <p style="font-size: 20px;color:#333;line-height: 28px;text-align: center;">
                <img src="../assets/images/tele.png" alt=""><br>
                <span style="font-size:16px;color:#666;margin-top:5px;">请联系管理员</span><br>
                235-345-4456
            </p>
            </span>
        </Modal>

    </div>
</template>

<script>
    import vFooter from "../component/layout/Footer.vue";

    let {common, cacheClass} = require('../script/common.js');
    let _this = null;
    export default {
        data: function () {
            return {
                loading: false,
                ruleForm: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        {
                            required: true,
                            message: '请输入账号',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        }
                    ]
                },

                //忘记密码的弹框
                dialogVisible: false,
            }
        },
        created: function () {
            _this = this;
        },
        components: {
            vFooter
        },
        methods: {
            /**
             * 登录
             */
            handleLogin: function (formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.loading = true;
                        let requestConfig = {
                            method: 'POST',
                            url: "/loginPC/anon",
                            publicUrlType: 1,
                            data: {
                                userName: _this.ruleForm.userName,
                                password: _this.ruleForm.password,
                            },
                            successCallback: function (allData) {
                                if (allData.code == 200) {
                                    localStorage.setItem('GT_LOGININFO', JSON.stringify({
                                        userToken: allData.data.token,
                                        userName: _this.ruleForm.userName,
                                        uid: allData.data.id
                                    }));
                                    _this.$router.push('/moduleEntrance');
                                } else {
                                    _this.$Message.error(allData.msg);
                                }
                            },
                            errorCallback: function (error_resp) {
                                _this.loading = false;
                                if (error_resp.code == 403) {
                                    _this.$Message.error('该用户不存在');
                                } else if (error_resp.code == 405) {
                                    _this.$Message.error('账号或密码不能为空');
                                } else if (error_resp.code == 410 ){
                                    _this.$Message.error('账号或密码错误');
                                }else if (error_resp.code == 500) {
                                    _this.$Message.error('系统内部错误');
                                } else {
                                    _this.$Message.error('登录失败');
                                }
                            },
                        };
                        common.ajax.request(requestConfig, "", true);
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="less">
    @import '../style/color.less';
    @import '../style/method.less';
    @import '../style/utils.less';

    @width: 300px;

    .login-wrap {

        .login-content {
            width: 100%;
            height: 100vh;
            background: url("../assets/images/login-back.png") no-repeat;
            background-size: 100% 100%;
            position: relative;
            .footer-wrapper {
                background-color: transparent;
                color: #555;
            }
            .login-box {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 614px;
                height: 360px;
                margin-top: -180px;
                margin-left: -307px;
                background-color: rgba(166, 215, 242, 0.75);
                border: 1px solid #0694E3;
                text-align: center;
                border-radius: 16px;
                .el-form-item__error {
                    left: 20px;
                }
                & p.title {

                    .heightLine(60px);
                    width: 126px;
                    margin: 0 auto;
                    font-size: 20px;
                    color: white;
                    font-weight: 300;
                    border-radius: 6px 6px 0 0;
                    position: relative;

                }

                & .login-ruleForm {
                    width: 480px;
                    margin: 80px auto 0;

                    & .form-input {
                        padding: 0 10px 0 26px;
                        width: 450px;
                        height: 44px;
                        margin: 0 auto;
                        border: 0;
                        background: #fff;
                        border-radius: 54px;
                        outline: none;

                    }
                    .ivu-form-item-error-tip {
                        left: 20px;
                        padding-left: 22px;
                    }
                    .forget-pwd {
                        color: #666;
                        text-align: right;
                        margin-bottom: 34px;
                        padding-right: 20px;
                        span {
                            cursor: pointer;
                            padding-right: 18px;
                            font-size: 12px;
                            line-height: 30px;
                        }
                    }

                    .login-btn {

                        .button2(@themColor, white, none, 300px);
                        line-height: 14px;
                        width: 450px;
                        height: 44px;
                        border-radius: 8px;;
                        background-color: #2F90C2 !important;
                        &:hover {
                            background-color: #2F90C2;
                        }

                    }
                }
            }
        }

    }

    input:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white inset;
    }
</style>

