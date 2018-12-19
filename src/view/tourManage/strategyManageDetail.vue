<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="ruleForm" :rules="ruleForm" :model="formData" :label-width="120">
                <FormItem label="*上传封面：">
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
                    <p style="color: #999;">请上传 .png .jpg 图片</p>
                </FormItem>
                <FormItem label="所属栏目：" prop="column">
                    <Select v-model="selectColumn" multiple @on-change="onSelectColumnChange" placeholder="最多选择3项" style="width:360px">
                        <Option v-for="item in columnOptions" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="攻略标题：" prop="title">
                    <Input v-model="formData.title" placeholder="请输入攻略标题" style="width: 800px;" />
                </FormItem>
                <FormItem label="*正文内容：" prop="content">
                    <UE :defaultMsg="defaultMsg" :config="config" :id="ue1"  ref="ue"></UE>
                </FormItem>
                <FormItem label="基础点赞量：" prop="basePraise">
                    <Input v-model="formData.basePraise" placeholder="请输入基础点赞量" style="width: 130px;"/>
                    <span class="totalPraiseSpan" :max="100000000">总点赞：{{ formData.basePraise * 1 + formData.actualPraise * 1 }}</span>
                    <span>实际点赞：{{ formData.actualPraise }}</span>   
                </FormItem>

                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmitData(1, 'ruleForm')">直接发布</Button>
                        <Button type="primary" @click="handleSubmitData(2, 'ruleForm')">保存</Button>
                        <Button type="default" @click="handleCancelBtn">取消</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
let { common } = require('../../script/common.js')
import  UE from '../../component/UEditor/UE.vue'
import breadcrumb from "../../component/template/breadCrumb.vue"
// import uploadFile from "../../component/upload/uploadFile.vue"
export default {
    data () {
        let that = this;
        let validateBasePraise = (rule, value, callback) => {
            if(!value) {
                return callback();
            } else if(value < 0 || value > 100000000 || !Number.isInteger(value * 1)) {
                callback(new Error('请输入正确的基础点赞数'))
            } else {
                callback();
            }
        };
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['旅游攻略', '攻略管理'],
            subTitle: (that.$route.query.id)? '编辑攻略' : '新建攻略',
            currentItemId: that.$route.query.id,
            updateIcon: '',
            columnOptions: [
                {id: 0, name: '景区'},
                {id: 1, name: '美食'},
                {id: 2, name: '名宿'},
                {id: 3, name: '店家'}
            ],
            formData: {
                status: 1,
                column: '',
                title: '',
                basePraise: '',
                totalPraise: 0,
                actualPraise: 0,
                base64File: []
            },
            selectColumn: [],
            imgName: '',
            visible: false,
            uploadList: [],
            ruleForm: {
                title: [
                    { required: true, type: 'string', max: 24, message: '请输入不超过24个字的攻略标题', trigger: 'change' }
                ],
                basePraise: [
                    { validator: validateBasePraise, trigger: 'blur' }
                ],
            },
            defaultMsg: '',
            config: {
                initialFrameWidth: 800,
                initialFrameHeight: 250
            },
            ue1: "ue1" // 不同编辑器必须不同的id
        }
    },
    components:{
        breadcrumb,
        UE
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
        this.getModuleDetailById()
        this.getColumnOptions();
    },
    methods: {
        // 限制基础点赞量
        onBasePraiseCheck(basePraisevalue) {
            return this.formData.basePraise = 
                basePraisevalue >= 100000000 ? 100000000 : basePraisevalue;
        },
        // 选择的所属栏目不能超过三个
        onSelectColumnChange() {
            if(this.selectColumn.length > 3) {
                this.$Message.warning("所属栏目最多选择三项");
                this.selectColumn = this.selectColumn.splice(0, 3)
            }
        },
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
        // 限制要上传的图片数量、获取图片地址等
        handleBeforeUpload (file) {
            let _this = this
            let check = _this.uploadList.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传1张封面'
                });
            } else {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
                // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
                // 读取文件作为 URL 可访问地址
                reader.readAsDataURL(file)            
                reader.onloadend = function (e) {
                    let picFormat = reader.result.split(";")[0].split("/")[1]
                    if(picFormat == "png" || picFormat == "jpeg") {  
                        file.url = reader.result
                        _this.uploadList = []
                        _this.uploadList.push(file)
                        
                        _this.formData.base64File = [
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
        // 删除上传的图片
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            this.uploadList = [];
        },
        /*************************************************************************/
        // 取消按钮，返回上一级
        handleCancelBtn () {
            this.$Modal.confirm({
                title: '攻略尚未保存，确认退出？',
                onOk: () => {
                    this.$router.go(-1)
                }
            });
        },
        //初始化富文本框
        initUEeditor: function (content) {
            let self = this;
            self.$refs.ue.editor.ready(function () {
                self.$refs.ue.editor.setContent(content); // 设置编辑框内容为初始内容content
            });
        },
        /***********************************调用接口******************************************/
        // 获取当前模块入口的详情
        getModuleDetailById () {
            let that = this
            if(that.currentItemId) {
                let requestConfig = {
                    method: 'GET',
                    url: `/strategy/getbyid/${that.currentItemId}`,
                    publicUrlType:1,
                    successCallback: res => {
                        if (res && res.code == 200 && res.data) {
                            that.formData = res.data
                            res.data.listColumn.map(item => {
                                that.selectColumn.push(item.id)
                            })
                            that.uploadList = [ { url: that.imagePrefix + res.data.photo } ];
                            that.initUEeditor(res.data.content)
                        } else {
                            that.$Message.error(res.msg)
                        }
                    },
                    errorCallback: (err) => {
                        that.$Message.error("数据请求失败")
                    }
                }
                common.ajax.request(requestConfig);
            }
        },
        // 新增/编辑攻略的保存/直接发布
        handleSubmitData(statusValue, name) {
            let that =this, listColumn = [], base64File = [], imgLoaded = true,
                getContent =  that.$refs.ue.editor.getContent(), 
                urlStr = statusValue == 1 ? '/strategy/saveenable' : '/strategy/save';        
                
            that.selectColumn.map(item => {
                listColumn.push({ id : item })
            })

            // 封面不能为空
            if(that.uploadList.length == 0) {
                imgLoaded = false;
                that.$Message.warning('封面图片不能为空');
            }

            let data = {
                id: that.currentItemId,
                status: statusValue * 1,
                listColumn,
                title: that.formData.title,
                content: getContent,
                basePraise: that.formData.basePraise * 1,
                actualPraise: that.formData.actualPraise * 1,
                totalPraise: that.formData.basePraise * 1 + that.formData.actualPraise * 1,
                base64File: that.formData.base64File
            }
            console.log("submitData:")
            console.log(data)
            that.$refs[name].validate((valid) => {
                if (valid && imgLoaded && getContent) {
                    let requestConfig = {
                        method: 'POST',
                        url: urlStr,
                        publicUrlType: 1,
                        data,
                        successCallback: (res) => {
                            if (res && res.code == 200) {
                                if(statusValue == 1) {
                                    that.$Message.success('发布成功');
                                } else {
                                    that.$Message.success('保存成功');
                                }
                                that.$router.push({ path: "/strategyManage" });
                            } else {
                                that.$Message.error(res.msg)
                            }
                        },
                        errorCallback: (err) => {
                            that.$Message.error(err.msg);
                        }
                    }
                    common.ajax.request(requestConfig);
                }else {
                    if(!getContent) {
                        that.$Message.error('正文内容为必填项');
                    } else {
                        that.$Message.error('请检查填写项');
                    }
                }
            })
        },
        // 获取栏目options
        getColumnOptions() {
            let that = this,
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: '/column/getallUseing',
                successCallback: res => {
                    if (res && res.code == 200 && res.data) {
                        that.$Message.success("数据请求成功");
                        that.columnOptions = res.data;
                    } else {
                        that.$Message.error(res.msg);
                    }
                },
                errorCallback: (err) => {
                    that.$Message.error("数据请求失败");
                }
            };
            common.ajax.request(requestConfig);
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
