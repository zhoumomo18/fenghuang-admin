<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="ruleForm" :rules="ruleForm" :model="formData" :label-width="120">
                <FormItem label="模块图标：" prop="photo" class="ivu-form-item-required">
                    <div class="upload-list" v-for="item in uploadList">
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView(item)"></Icon>
                            <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="upload"
                        multiple
                        :format="['jpg','jpeg','png']" 
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
                    <p>60 x 60，请上传 .png .jpg图片</p>
                </FormItem>
                <FormItem label="模块名称：" prop="name">
                    <Input v-model="formData.name" placeholder="请输入模块名称(4个字以内)"/>
                </FormItem>
                <FormItem label="链接：" prop="linkUrl">
                    <Input v-model="formData.linkUrl" placeholder="请输入链接" />
                </FormItem>

                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmitData('ruleForm')">保存</Button>
                        <Button type="default" @click="handleCancelBtn">返回</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
let {indexConfigMethod} = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this,
            uploadImageValid = (rule, value, callBack) => {
                console.log(this.uploadList)
                if (that.uploadList.length==0){
                    return callBack(new Error('请上传图片'))
                } else {
                    callBack();
                }
            }
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['首页配置','模块入口'],
            subTitle: (that.$route.query.id)? '编辑模块':'新建模块',
            currentItemId: that.$route.query.id,
            updateIcon: '',
            iconFile: '',
            formData: {
                name: '',
                linkUrl: ''
            },
            visible: false,
            uploadList: [],
            ruleForm: {
                photo: [
                    { validator: uploadImageValid, trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '模块名称不能为空', trigger: 'blur' },
                    { max: 4, message: '长度不能超过4个字', trigger: 'blur' }
                ],
                linkUrl: [
                    { required: true, message: '链接不能为空', trigger: 'blur' }
                ],
            }
        }
    },
    components:{
        breadcrumb
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
        if(this.currentItemId) this.getModuleDetailById()
    },
    methods: {
        // 预览上传的图片
        handleView (item) {
            this.visible = true;
        },
        // 验证要上传的图片格式
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        // 限制要上传的图片数量
        handleBeforeUpload (file) {
            const that = this
            const check = that.uploadList.length < 1;
            let uploadNewItem = {},
                uploadList = []
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 1 张图片。'
                });
            } else {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
                // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
                // 读取文件作为 URL 可访问地址
                reader.readAsDataURL(file)            
                reader.onloadend = function (e) {
                    file.url = reader.result
                    file.suffix=file.type.split('/')[1] // 获取图片后缀
                    file.body=file.url.split(',')[1]  // 获取图片base64格式的地址
                    file.source='localSource'
                    uploadList.push(file)
                    that.uploadList = uploadList
                }
            }
            return check;
        },
        // 取消按钮，返回上一级
        handleCancelBtn () {
            this.$router.go(-1)
        },
        // 删除上传的图片
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            this.uploadList=[]
        },


        /***********************************调用接口************************************************************/
        // 获取当前模块入口的详情
        getModuleDetailById () {
            let that = this,
                params = {
                    id: that.currentItemId,
                    callBack: (res) => {
                        if (res.code==200){
                            that.formData = res.data
                            for (let item of res.data.fileList) {
                                item.url = that.imagePrefix + item.src
                                item.source = 'internetSource'
                            }
                            that.uploadList = res.data.fileList
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            indexConfigMethod.getModuleDetailById(params)
        },
        // 新增/编辑模块的提交
        handleSubmitData (name) {
            let that =this
            that.$refs[name].validate((valid) => {
                if (valid) {
                    let  base64File
                    if (that.uploadList[0].source == 'localSource') {
                        base64File = [{
                            body: that.uploadList[0].body,
                            suffix: that.uploadList[0].suffix
                        }]
                    } else if (that.uploadList[0].source == 'internetSource'){
                        base64File = []
                    }
                    console.log(base64File)
                    let  params = {
                        id: that.currentItemId,
                        base64File: base64File,
                        fileID: (base64File.length>0) ? that.formData.fileID:'',
                        name: that.formData.name,
                        linkUrl: that.formData.linkUrl,
                        callBack: (res) => {
                            if (res && res.code==200){
                                that.$Message.success('保存成功')
                                if(!that.currentItemId) that.$refs[name].resetFields()
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    indexConfigMethod.handleSubmitData(params)
                }else {
                    return false
                }
            })
        }
    }
}
</script>


<style lang="less" scoped>
.page-form-group{
    padding: 24px;
    .ivu-row-flex{
        padding-top: 20px;
        margin-bottom: 16px;
        .ivu-btn{
            margin-right: 24px
        }
    }
    .ivu-cover-image{
        width: 60px;
        height:60px;
        line-height: 58px;
        text-align: center; 
        border: 1px solid #dcdee2;
        border-radius: 50%;
    }
    .upload-list{
        width: 60px;
        height: 60px;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 50%;
    }
    .red{
        color: #f00;
    }
}
</style>
