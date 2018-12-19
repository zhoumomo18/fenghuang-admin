<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <p class="infoBox">基本信息</p>
            <Form ref="ruleForm" :rules="ruleForm" :model="formData" :label-width="120">
                <FormItem label="上传封面：">
                    <div class="upload-list" v-for="item in uploadList">
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView()"></Icon>
                            <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="upload"
                        multiple
                        :format="['jpg','jpeg','png']" 
                        action="" 
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
                    <p class="red">请上传 .png .jpg图片</p>
                </FormItem>
                <FormItem label="景区名称：" prop="name">
                    <Input v-model="formData.name" placeholder="请输入景区名称" style="width: 800px;" />
                </FormItem>
                <FormItem label="景区地址：" prop="address">
                    <Input v-model="formData.address" placeholder="请输入景区地址" style="width: 800px;" />
                </FormItem>
                <FormItem label="经度：" prop="longitude" style="display: inline-block;">
                    <Input v-model="formData.longitude" placeholder="请输入经度" style="width: 200px;" />
                </FormItem>
                <FormItem label="纬度：" prop="dimension" style="display: inline-block;">
                    <Input v-model="formData.dimension" placeholder="请输入纬度" style="width: 200px;" />
                </FormItem>
                <FormItem label="开放时间：" prop="opentime">
                    <Input v-model="formData.opentime" placeholder="请输入开放时间" style="width: 800px;" />
                </FormItem>
                <FormItem label="入园基数：" prop="peoplenum">
                    <Input v-model="formData.peoplenum" placeholder="请输入入园基数" style="width: 800px;" />
                </FormItem>
                <FormItem label="推荐指数：" prop="ratings">
                    <Input v-model="formData.ratings" placeholder="请输入0-5之间的数字" style="width: 800px;" number/>
                </FormItem>
                <FormItem label="景区介绍：" prop="remark">
                    <UE :defaultMsg="defaultMsg" :config="config" :id="ue1"  ref="ue"></UE>
                </FormItem>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="submitNextStep('ruleForm')">下一步</Button>
                        <Button type="default" @click="handleCancelBtn">取消</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
let { scenicsTicketsMethod } = require('../../script/page.js')
import  UE from '../../component/UEditor/UE.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['景区门票','景区管理'],
            subTitle: (that.$route.query.id) ? '编辑景点' : '新建景点',
            currentItemId: that.$route.query.id,
            updateIcon: '',
            formData: {
                id: 0,
                name: "",
                address: "",
                longitude: "",
                dimension: "",
                opentime: "",
                peoplenum: 0,
                ratings: 0,
                remark: "",
                base64File: [],
                uploadList: [] // 封面
            },
            uploadList: [],
            imgName: '',
            visible: false,
            ruleForm: {
                name: [
                    { required: true, message: '景点名称不能为空', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '地址不能为空', trigger: 'blur' }
                ],
                longitude: [
                    { required: true, message: '经度不能为空', trigger: 'blur' }
                ],
                dimension: [
                    { required: true, message: '纬度不能为空', trigger: 'blur' }
                ],
                opentime: [
                    { required: true, message: '开放时间不能为空', trigger: 'blur' }
                ],
                ratings: [
                    { required: true, type: 'number', min: 0, max: 5, message: '请输入0-5之间的推荐指数', trigger: 'blur'},
                ],
                remark: [
                    { required: true, message: '景区介绍不能为空', trigger: 'blur' }
                ],
            },
            defaultMsg: '',
            config: {
                initialFrameWidth: 800,
                initialFrameHeight: 250
            },
            ue1: "ue1", // 不同编辑器必须不同的id
        }
    },
    components:{
        breadcrumb,
        UE
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
        // 初始化
        // 如query中包含下一步的信息，则是返回，formData使用query，否则使用初始
        if(this.$route.query.publishstate) {
            this.formData = this.$route.query
            this.uploadList = this.formData.uploadList
        } else {
            this.getScenicsDetailById()
        }
        console.log("this.formData_step1:")
        console.log(this.formData)
        this.initUEeditor(this.formData.remark)
    },
    methods: {
        // 预览上传的图片
        handleView () {
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
        handleBeforeUpload (file) {
            let that = this
            const check = that.uploadList.length < 1;
            if (!check) {
                that.$Notice.warning({
                    title: `最多只能上传 1 张图片`
                });
            } else {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                reader.readAsDataURL(file)            
                reader.onloadend = function (e) {
                    let picFormat = reader.result.split(";")[0].split("/")[1]
                    if(picFormat == "png" || picFormat == "jpeg") {  
                        file.url = reader.result
                        that.uploadList.push(file)

                        that.formData.base64File = [
                            {
                                body: reader.result.split(",")[1], // 图片的文件编码string
                                suffix: picFormat // 图片的格式string
                            }
                        ]
                    }
                }
            }
            return check;
        },
        //初始化富文本框
        initUEeditor: function (content) {
            let self = this;
            self.$refs.ue.editor.ready(function () {
                self.$refs.ue.editor.setContent(content); // 设置编辑框内容为初始内容content
            });
        },
        /***********************************调用接口************************************/
        // 删除上传的图片
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            this.uploadList = [];
        },
        // 获取当前景点的详情 (normal)
        getScenicsDetailById () {
            let that = this
            if(that.currentItemId) {
                let params = {
                    id: that.currentItemId,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.$Message.success("数据请求成功");
                            console.log(res.data)
                            that.formData = res.data;
                            // 设置富文本框内容
                            that.initUEeditor(res.data.remark)
                            // 显示获取的封面
                            that.uploadList = [ 
                                { url: that.imagePrefix + res.data.title[0].src }
                            ];

                            console.log("that.formData:")
                            console.log(that.formData)
                        } else {
                            that.$Message.error(res.msg);
                        }
                    }
                };
                scenicsTicketsMethod.getScenicsById(params);
            }
        },
        // 跳转下一步
        submitNextStep(name) {
            let that = this
            // 获取富文本框内容
            that.formData.remark = that.$refs.ue.editor.getContent(),
            that.formData.uploadList = that.uploadList
            that.$refs[name].validate((valid) => {
                if (valid) {
                    // debugger
                    that.formData.imgInfo=JSON.stringify(that.formData.imgInfo);
                    that.$router.push({
                        path: '/scenicsDetail_2',
                        query: that.formData
                    })
                }else {
                    that.$Message.error("请检查必填项");
                    return false
                }
            })
        },
        // 取消按钮，返回上一级
        handleCancelBtn () {
            this.$Modal.confirm({
                title: '放弃此次景点编辑？',
                onOk: () => {
                    this.$router.push({ path:'/scenicsManage' })
                }
            });
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
</style>
