<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <p class="infoBox">商家菜单</p>
            <div class="content-box" v-for="(item,index) in menuList">
                <Form :ref="item.ruleForm" :model="item" style="overflow: hidden">
                    <div class="info-left">
                        <FormItem style="float: left;">
                            <div v-if="item.file[0].src" class="upload-list"
                                 style="width: 220px;height: 140px">
                                <img :src="item.file[0].src" width="220" height="140">
                                <div class="upload-list-cover">
                                    <Icon type="ios-eye-outline" @click="handleView(index)"></Icon>
                                    <Icon type="ios-trash-outline" @click="handleRemove(index)"></Icon>
                                </div>
                            </div>
                            <div v-if="!item.file[0]||!item.file[0].src">
                                <Upload
                                        ref="upload"
                                        multiple
                                        :format="['jpg','jpeg','png']"
                                        action=""
                                        :show-upload-list="false"
                                        :on-format-error="handleFormatError"
                                        :before-upload="handleBeforeUpload">
                                    <div class="ivu-cover-image" @click="saveCurrentIndex(index)">
                                        <Icon type="ios-camera" size="20"></Icon>
                                    </div>
                                </Upload>
                            </div>
                            <p style="color: #999;">请上传 .png .jpg图片</p>
                        </FormItem>
                    </div>
                    <div class="info-center">
                        <FormItem prop="name" :rules="{required: true, message: '请输入菜品名称', trigger: 'blur'}">
                            <Input v-model="item.name" placeholder="请输入菜品名称"
                                   style="width: 300px;" :disabled="item.disable"/>
                        </FormItem>
                        <FormItem prop="price"
                                  :rules="{required: true, type: 'number', message: '请输入正确的价格', trigger: 'blur'}">
                            <Input v-model="item.price" placeholder="请输入价格"
                                   style="width: 300px;" number :disabled="item.disable"/>
                        </FormItem>
                        <FormItem prop="cateIntro" style="float: left;width: 360px;height: 30px;line-height: 30px;">
                            <Input v-model="item.remark" placeholder="请输入菜品简介"
                                   style="width: 680px;" :disabled="item.disable"/>
                        </FormItem>
                    </div>
                    <div class="info-right">
                        <span v-if="!index||item.status" @click="btnSave(item,index)" style="cursor: pointer;">
                            <Icon custom="icon-save"/>
                        </span>
                        <span v-if="index&&!item.status" @click="btnEdit(item,index)" style="cursor: pointer;">
                            <Icon custom="icon-edit"/>
                        </span>
                        <span v-if="index" @click="btnDel(item,index)" style="cursor: pointer;">
                            <Icon custom="icon-delete"/>
                        </span>
                    </div>
                </Form>
                <div>
                    <Button type="primary" v-if="!item.isGood" @click="btnSetMenu(item,index,1)">设为特色菜</Button>
                    <Button type="warning" v-if="item.isGood" @click="btnSetMenu(item,index,0)">取消特色菜</Button>
                </div>
            </div>
            <div class="btn-group">
                <Button type="primary" @click="jumpPage">返回</Button>
            </div>
        </div>
        <Modal title="预览" v-model="visible">
            <img :src="modelImage" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    import {imagePrefix} from "../../script/config";

    let {storesAndCatesMethod} = require('../../script/page.js')
    import breadcrumb from "../../component/template/breadCrumb.vue"

    export default {
        data() {
            let self = this
            return {
                queryId: self.$route.query.id,
                breadcrumbs: ['商家美食', '商家管理'],
                subTitle: (self.queryId) ? '编辑菜单' : '新建菜单',
                exampleMenuItem: {
                    ruleForm: 'ruleForm',
                    base64File: {
                        body: '',
                        suffix: '',
                    },
                    file: [{
                        id: '',
                        name: '',
                        src: '',
                        suffix: ''
                    }],
                    foodBusinessId: '',
                    id: '',
                    isGood: 0,
                    name: '',
                    price: '',
                    remark: ''
                },
                menuList: [],
                currentUploadIndex: '',
                visible: false,
                modelImage: '',

            }
        },
        components: {
            breadcrumb
        },
        created: function () {

        },
        mounted() {
            if (this.queryId) {
                this.getMenuListById();
            }

        },
        methods: {
            // 预览上传的图片
            handleView(index) {
                this.visible = true;
                this.modelImage = this.menuList[index].file[0].src;
            },
            // 验证要上传的图片格式
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            // 限制要上传的图片数量(封面)
            handleBeforeUpload(file) {
                let self = this;
                // 创建一个 FileReader 对象
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                    // 图片base64编码
                    self.menuList[self.currentUploadIndex].base64File.body = reader.result.split(",")[1];
                    //得到图片的格式
                    self.menuList[self.currentUploadIndex].base64File.suffix = file.type.split("/")[1];
                    //上传图片展示
                    self.menuList[self.currentUploadIndex].file[0].src = reader.result;
                }

            },
            saveCurrentIndex: function (index) {
                this.currentUploadIndex = index;
            },
            // 删除上传的封面
            handleRemove(index) {
                let self = this;
                self.menuList[self.currentUploadIndex].base64File.body = '';
                self.menuList[self.currentUploadIndex].base64File.suffix = '';
                self.menuList[self.currentUploadIndex].file[0].src = '';
            },
            //保存
            btnSave: function (item, index) {

                let self = this;
                let fromObj = self.$refs[item.ruleForm][index];
                fromObj.validate(valid => {
                    if (valid) {
                        //修改
                        if (item.status) {
                            if (!fromObj.model.file[0].src) return;
                            self.editMenu(fromObj.model);
                        } else {
                            //判断图片是否上传
                            if (!fromObj.model.base64File.body) return;
                            self.saveMenuInfo(fromObj.model);
                        }
                    }
                })
            },
            //编辑
            btnEdit: function (item, index) {
                this.menuList[index].disable = false;
                this.menuList[index].status = 1;
            },
            //删除
            btnDel: function (item, index) {
                this.$Modal.confirm({
                    title: '确定删除此菜品？',
                    onOk: () => {
                        this.deleteMenu(item.id);
                    }
                });
            },
            //设置特色菜
            btnSetMenu: function (item, index, type) {
                this.menuList[index].isGood = type;
                if (item.status) return;
                this.setMenus(item.id, type ? 1 : 2);
            },
            jumpPage: function () {
                this.$Modal.confirm({
                    title: '确定返回上一页吗？',
                    onOk: () => {
                        this.$router.push({path: '/storesManage'});
                    }
                });
            },
            //重新渲染页面
            renderPage: function () {
                this.getMenuListById();
            },

            clearInfo: function () {
                this.exampleMenuItem = {
                    ruleForm: 'ruleForm',
                    base64File: {
                        body: '',
                        suffix: '',
                    },
                    file: [{
                        id: '',
                        name: '',
                        src: '',
                        suffix: ''
                    }],
                    foodBusinessId: '',
                    id: '',
                    isGood: 0,
                    name: '',
                    price: '',
                    remark: ''
                };
            },
            /***********************************调用接口***************************************************************************************/
            // 获取当前商家菜单列表
            getMenuListById() {
                let self = this,
                    params = {
                        id: self.queryId,
                        callBack: action
                    };

                function action(response) {

                    if (response && response.code === 200 && response.data) {
                        self.menuList = [];
                        self.menuList.push(self.exampleMenuItem);
                        response.data.forEach((item) => {
                            item.ruleForm = 'ruleForm';
                            item.disable = true; //控制输入框是否能编辑
                            item.status = 0;//操作按钮展示状态 0.编辑  1.保存
                            if (item.file[0])
                                item.file[0].src = imagePrefix + item.file[0].src;//图片路径转换
                            else {
                                item.file[0] = {
                                    src: ''
                                }
                            }
                            self.menuList.push(item);
                        });
                    } else {
                        self.menuList.push(self.exampleMenuItem);
                    }
                }

                storesAndCatesMethod.getMenuList(params);
            },
            // 保存
            saveMenuInfo: function (item) {
                let self = this,
                    request = {
                        params: {
                            businessId: self.queryId,
                            businessFood: {
                                base64File: [{
                                    body: item.base64File.body,
                                    suffix: item.base64File.suffix
                                }],
                                isGood: item.isGood,
                                name: item.name,
                                price: item.price,
                                remark: item.remark
                            }
                        },
                        callBack: action
                    };

                function action(response) {
                    if (response && response.code === 200 && response.data) {
                        self.$Message.success('新增成功');
                        self.clearInfo();
                        self.renderPage();

                    } else {
                        self.$Message.error('新增失败');
                    }
                }

                storesAndCatesMethod.saveMenuItem(request);
            },
            //编辑
            editMenu: function (item) {

                let self = this,
                    request = {
                        params: {
                            businessId: self.queryId,
                            businessFood: {
                                base64File: [],
                                id: item.id,
                                isGood: item.isGood,
                                name: item.name,
                                price: item.price,
                                remark: item.remark
                            }
                        },
                        callBack: action
                    };
                if (item.base64File && item.base64File.length) {
                    request.params.businessFood.base64File.push({
                        body: item.base64File.body,
                        suffix: item.base64File.suffix
                    })
                }

                function action(response) {
                    if (response && response.code === 200 && response.data) {
                        self.$Message.success('修改成功');
                        self.renderPage();

                    } else {
                        self.$Message.error('修改失败');
                    }
                }

                storesAndCatesMethod.saveMenuItem(request);
            }
            ,
            //删除
            deleteMenu: function (id) {
                let self = this,
                    request = {
                        params: id,
                        callBack: action
                    };

                function action(response) {
                    if (response && response.code === 200) {
                        self.$Message.success('删除成功');
                        self.renderPage();
                    } else {
                        self.$Message.error('删除失败');
                    }
                }

                storesAndCatesMethod.deleteMenu(request);
            },
            //设为特色菜
            //params id 菜单id
            //params type （1.设置 2.取消）
            setMenus: function (id, type) {
                let self = this,
                    request = {
                        params: {
                            id: id,
                            type: type
                        },
                        callBack: action
                    };

                function action() {

                }

                storesAndCatesMethod.setSpeciality(request);
            }
        }
    }
</script>


<style lang="less" scoped>
    .page-form-group {
        padding: 24px;
        min-width: 1300px;
        .infoBox {
            height: 36px;
            line-height: 36px;
            text-indent: 15px;
            margin-bottom: 20px;
            background-color: #eeebeb;
        }
        .content-box {
            margin-bottom: 20px;
            .info-left {
                height: 180px;
                float: left;
            }
            .info-center {
                margin-left: 30px;
                float: left;
                height: 180px;
                width: 60%;
            }
            .info-right {
                float: left;
                height: 180px;
                width: 18%;
                text-align: center;
            }
        }
        .ivu-row-flex {
            padding-top: 20px;
            margin-bottom: 16px;
            .ivu-btn {
                margin-right: 24px
            }
        }
        .ivu-cover-image {
            width: 220px;
            height: 140px;
            line-height: 150px;
            text-align: center;
            border: 1px dashed #dcdee2;
        }
        .icon-save {
            background-image: url(../../assets/images/icon-save.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            -moz-background-size: 100% 100%;
            width: 35px;
            height: 35px;
        }
        .icon-edit {
            background-image: url(../../assets/images/icon-edit.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            -moz-background-size: 100% 100%;
            width: 35px;
            height: 35px;
        }
        .icon-delete {
            background-image: url(../../assets/images/icon-delete.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            -moz-background-size: 100% 100%;
            width: 35px;
            height: 35px;
        }
        .btn-group {
            text-align: center;
        }
    }

    .ivu-select-dropdown {
        z-index: 9999;
    }
</style>