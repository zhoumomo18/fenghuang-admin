<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>
        
        <p class="bg-white alert-title"><Icon type="md-alert" color="#f10215" size="20"/>房型及配置将按照发布顺序优先排列</p>

        <div class="page-form-group bg-white">
            <div class="infoBox">房型</div>
            <Form ref="form" :rules="rules" :model="form" :label-width="120">
                <FormItem label="房型图片：" prop="cover" ref="cover">
                    <div class="upload-list" v-for="item in uploadList">
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView()"></Icon>
                            <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="upload"
                        :format="['jpg','jpeg','png']"
                        :max-size="3072" 
                        action="/tourManager/v1.0/other/filedonothing/anon" 
                        :show-upload-list="false"
                        :on-format-error="handleFormatError"
                        :before-upload="handleBeforeUpload">
                        <div class="ivu-cover-image">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="visible">
                        <img :src="uploadList[0].url" v-if="visible" style="width: 100%">
                    </Modal>
                    <p class="#999">60 x 60，请上传 .png .jpg图片，3M以内</p>
                </FormItem>
                <FormItem label="房型名称：" prop="name">
                    <Input v-model="form.name" placeholder="请输入房型名称" style="width: 800px;" />
                </FormItem>
                <FormItem label="房型面积：" prop="area">
                    <Input v-model="form.area" number placeholder="请输入房型面积" style="width: 800px;" />
                </Select>
                </FormItem>
                <FormItem label="床型" prop="bedType">
                    <RadioGroup v-model="form.bedType" @on-change ="bedTypeChange">
                        <Radio v-for="item in bedTypeOptions" :label="item.name" :key="item.name"></Radio>
                    </RadioGroup>
                    <p><Button type="text" style="color:rgb(0, 171, 234)" @click="addDefinition">添加自定义</Button></p>    
                </FormItem> 
                <FormItem label="床宽：" prop="bedWidth">
                    <Input v-model="form.bedWidth" number placeholder="请输入床宽" style="width: 800px;" />
                </FormItem> 
                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" v-if="!$route.query.id" @click="submitBtn('form',0)">继续添加</Button>
                        <Button type="primary" @click="submitBtn('form',1)">保存</Button>
                        <Button type="default" @click="cancelBtn">取消</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
        <Modal
            v-model="modal"
                title="添加自定义"
                @on-cancel="cancel">
                <div style="text-align:center">
                    <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px;margin-left:100px;">
                    <FormItem
                            v-for="(item, index) in formDynamic.items"
                            v-if="item.status"
                            :key="index"
                            :label="'字段名' + item.index"
                            :prop="'items.' + index + '.value'"
                            :rules="{required: true, message: 'Item ' + item.index +' 不能为空', trigger: 'blur'}">
                        <Row>
                            <Col span="18">
                                <Input type="text" v-model="item.value" placeholder="请输入字段名"></Input>
                            </Col>
                            <Col span="4" offset="1">
                                <Button @click="handleItemRemove(index)">删除</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="12">
                                <Button type="dashed" long @click="handleAdd" icon="md-add">继续添加</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
                </div>
                <p slot="footer" style="text-align:center">
                    <Button type="primary" @click="handleSubmit('formDynamic')">确定</Button>
                    <Button @click="handleCancel('formDynamic')" style="margin-left: 8px">取消</Button>
                </p>
        </Modal>
        <Modal v-model="modal1" title="取消编辑" 
        @on-cancel="cancel1">
            <p style="text-align:center;color:red">放弃此次房型编辑?</p>
            <p slot="footer" style="text-align:center">
                <Button type="primary" @click="confirm1">确认</Button>
                <Button @click="cancel1">取消</Button>
            </p>
        </Modal>
        
    </div>
</template>

<script>
let { hotelMethod } = require('../../script/page.js');
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
    data() {
        let self = this;
        let areaValidate = (rule, value, callback) => {
            if(isNaN(value)) {
                return callback(new Error('请输入数字'));
            }else if(!value && !isNaN(value)) {
                return callback(new Error('房型面积不能为空'));
            }else {
                callback();
            }
        };
        let bedWidthValidate = (rule, value, callback) => {
            if(isNaN(value)) {
                return callback(new Error('请输入数字'));
            }else if(!value && !isNaN(value)) {
                return callback(new Error('床宽不能为空'));
            }else {
                callback();
            }
        };
        return {
            imagePrefix: self.imagePrefix,
            breadcrumbs: ['酒店预订','酒店管理'],
            subTitle: self.$route.query.id ? '编辑房型' : '新建房型',
            uploadList: [],
            form: {
                hotelId: +self.$route.query.hotelId,
                id: +self.$route.query.id,
                name: '',
                titleBase64: [],
                title: [],
                area: '',
                bedType: '',
                bedTypeInfo: [],
                bedWidth: ''
            },
            rules: {
                cover: [
                    { required: true, message: '房型图片不能为空', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '房型名称不能为空', trigger: 'blur' }
                ],
                area: [
                    { required: true, type: 'number', trigger: 'blur', validator: areaValidate, trigger: 'blur' },
                ],
                bedType: [
                    { required: true, message: '床型不能为空' , trigger: 'change' }
                ],
                bedWidth: [
                    { required: true, type: 'number', trigger: 'blur', validator: bedWidthValidate, trigger: 'blur' },
                ]
            },
            visible: false,
            bedTypeOptions: [
                { name: '单人床', ischecked: 0 },
                { name: '双人床', ischecked: 0 },
                { name: '大床', ischecked: 0 }
            ],
            modal: false,
            formDynamic: {
                items: [
                    { value: '', index: 1, status: 1}
                ]
            },
            index: 1,
            newWord: '',
            title: [], // 保存回显图片
            modal1: false
        }
    },
    components: {
        breadcrumb
    },
    created() {
        this.getHouseTypeById();
    },
    methods: {
         // 图片预览
        handleView() {
            this.visible = true;
        },
        // 验证要上传的图片格式
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        // 限制要上传的封面为1张图片
        handleBeforeUpload(file) {
            let self = this;
            let check = self.uploadList.length < 1;
            if(!check) {
                self.$Notice.warning({
                    title: `最多只能上传 1 张图片`
                });
            }else {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function(e) {
                    let picFormat = reader.result.split(';')[0].split('/')[1];
                    if(picFormat == 'png' || picFormat == 'jpeg') {
                        file.url = reader.result;
                        self.uploadList.push(file);
                        self.rules.cover = [];
                        self.$refs.cover.validateState = 'success';

                        let tempObj = {
                            body: reader.result.split(",")[1], // 图片的文件编码string
                            suffix: picFormat // 图片的格式string
                        }
                        self.form.titleBase64.push(tempObj);
                        if(self.$route.query.id) {
                            self.form.title = self.title;
                        }
                    }
                }
            }
            return check;
        },
        // 删除上传的图片
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            this.uploadList = [];
        },
        bedTypeChange(item) {
            this.form.bedTypeInfo = this.bedTypeOptions.map(val => {
                if(item == val.name) {
                    val.ischecked = 1;
                }else {
                    val.ischecked = 0;
                }
                return val;
            });
        },
        addDefinition() {
            this.modal = true;
        },
        handleSubmit(name) {
            let self = this;
            self.$refs[name].validate((valid) => {
                if (valid) {
                    let addItems = self.formDynamic.items.map(item => {   
                        return {
                                name: item.value,
                                isChecked: 0,
                                type: self.addDefinitionType
                            }
                        });
                    self.bedTypeOptions.push(...addItems);
                    self.$Message.success('添加成功');
                    self.$refs[name].resetFields();
                    self.formDynamic = {
                        items: [
                            { value: '', index: 1, status: 1}
                        ]
                    }
                    self.modal = false;
                } 
            })
        },
        handleCancel(name) {
           this.$refs[name].resetFields();
           this.formDynamic = {
                items: [
                    { value: '', index: 1, status: 1}
                ]
            }
           this.modal = false; 
        },
        handleAdd() {
            this.index++;
            this.formDynamic.items.push({
                value: '',
                index: this.index,
                status: 1
            });
        },
        handleItemRemove (index) {
            this.formDynamic.items[index].status = 0;
        },
        cancel() {
            this.modal = false;
        },
        confirm() {
            let self = this;
            if(!self.newWord) {
                self.$Message.error('请输入字段名');
                return;
            }
            let bedTypeInfo = self.bedTypeOptions.map(item => {
                return item.name
            });
            if(bedTypeInfo.includes(self.newWord)) {
                    self.$Message.error('该字段已存在');
                    return;
            }
            self.bedTypeOptions.push({ name: self.newWord, ischecked: 0});
            self.$Message.success('添加成功');
        },
        cancelBtn() {
            this.modal1 = true;
        },
        submitBtn(name, type) {
            let self = this;
            self.$refs[name].validate((valid) => {
                if (valid) {
                    if(self.$route.query.id) {
                        // 修改房型
                        self.houseTypeUpdate();
                    }else {
                        self.houseTypeSave(type);
                    }
                }
            });
        },
        houseTypeSave(type) {
            let self = this;
            let params = {
                form: self.form,
                callBack(res) {
                    if(res && res.code == 200) {
                        self.$Message.success('新建成功');
                        self.$refs.form.resetFields();
                        self.handleRemove();
                        if(type) {
                            self.$router.push('/hotelManage');
                        }
                    }else {
                        self.$Message.error(res.msg);
                    }
                }
            }
            hotelMethod.houseTypeSave(params);
        },
        getHouseTypeById() {
            let self = this;
            if(!self.$route.query.id) {
                return;
            }
            let params = {
                id: self.$route.query.id,
                callBack(res) {
                    if(res && res.code == 200) {
                        // 图片回显
                        if(res.data.title) {
                            self.uploadList = [ 
                                { url: self.imagePrefix + res.data.title[0].src }
                        ];
                        if(self.uploadList.length) {
                            self.rules.cover = [];
                            self.$refs.cover.validateState = 'success';
                        }
                        self.title = res.data.title;
                        }
                        self.form.name = res.data.name;
                        self.form.area = res.data.area;
                        // 床型
                        self.form.bedType = res.data.bedType;
                        self.form.bedTypeInfo = res.data.bedTypeInfo;
                        self.bedTypeOptions = res.data.bedTypeInfo;

                        self.form.bedWidth = res.data.bedWidth; 
                    }
                }
            }
            hotelMethod.getHouseTypeById(params);
        },
        houseTypeUpdate() {
            let self = this;
            let params = {
                form: self.form,
                callBack(res) {
                    if(res && res.code == 200) {
                        self.$Message.success('保存成功');
                        // 跳转页面
                        self.$router.push('/roomTypeManage');
                    }else {
                        self.$Message.error(res.msg);
                    }
                }
            }
            hotelMethod.houseTypeUpdate(params);
        },
        confirm1() {
            this.$refs.form.resetFields();
            this.handleRemove();
            this.$route.query.id ? this.$router.push('/roomTypeManage') : this.$router.push('/hotelManage');
        },
        cancel1() {
            this.modal1 = false;
        }
    }
}
</script>

<style lang="less" scoped>
.page-form-group{
    padding: 24px;
    .infoBox {
        height: 36px;
        line-height: 36px;
        text-indent: 15px;
        margin-bottom: 20px;
        background-color: #eeebeb;
    }
    .ivu-row-flex{
        padding-top: 20px;
        margin-bottom: 16px;
        .ivu-btn{
            margin-right: 24px
        }
    }
    .ivu-cover-image{
        width: 180px;
        height:100px;
        line-height: 100px;
        text-align: center; 
        border: 1px dashed #dcdee2;
    }
    .red{
        color: #f00;
    }
    .totalPraiseSpan {
        display: inline-block;
        margin: 0 35px;
    }
}
.ivu-select-dropdown{
    z-index: 9999;
}
.alert-title {
    padding: 10px 20px;
    margin-bottom: 10px;
}
.page-head-title.bg-white {
    margin-bottom: 0;
    padding-bottom: 0;
}
</style>
