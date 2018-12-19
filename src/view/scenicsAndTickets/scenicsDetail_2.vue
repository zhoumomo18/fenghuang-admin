<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="ruleForm" :rules="ruleForm" :model="formData" :label-width="120">
                <p class="infoBox">景区规则设置</p>
                <FormItem label="取票信息(多选)：" prop="takeBy">
                    <CheckboxGroup v-model="formData.takeBy">
                        <Checkbox label="姓名"></Checkbox>
                        <Checkbox label="联系电话" class="checkBox_takeBy"></Checkbox>
                        <Checkbox label="身份证号"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="预约规则：" prop="subscriberule">
                    <RadioGroup v-model="formData.subscriberule">
                        <Radio label="可预约当天门票"></Radio>
                        <Radio label="需提前一天预约" class="radio_subscriberule"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="退票规则：" prop="returnticketrule">
                    <RadioGroup v-model="formData.returnticketrule">
                        <Radio label="支持退票"></Radio>
                        <Radio label="不支持退票" class="radio_subscriberule"></Radio>
                    </RadioGroup>
                </FormItem>

                <p class="infoBox">其他</p>
                <FormItem label="景区图片：">
                    <div class="upload-list" v-for="(item, index) in uploadAlbumList">          
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView(index)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleAlbumRemove(item,index)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="uploadAlbum"
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
                        <img :src="uploadAlbumList[picIndex].url" v-if="visible" style="width: 100%">
                    </Modal>
                    <p class="red">请上传 .png .jpg图片，最多30张</p>
                </FormItem>
                <FormItem label="预订须知：" prop="subscriberemark">
                    <Input v-model="formData.subscriberemark" placeholder="请输入预订须知" type="textarea" class="textBox"/>
                </FormItem>
                <FormItem label="景点取票：" prop="notice">
                    <Input v-model="formData.notice" placeholder="请输入景点取票信息" type="textarea" class="textBox"/>
                </FormItem>
                <FormItem label="特殊人群政策：" prop="specialPopulationPolicyRemark">
                    <Input v-model="formData.specialPopulationPolicyRemark" placeholder="请输入特殊人群政策" type="textarea" class="textBox"/>
                </FormItem>
                <FormItem label="温馨提示：" prop="otherremark">
                    <Input v-model="formData.otherremark" placeholder="请输入温馨提示" type="textarea" class="textBox"/>
                </FormItem>

                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmitData('ruleForm', 1)">直接发布</Button>
                        <Button type="primary" @click="handleSubmitData('ruleForm', 2)">保存</Button>
                        <Button type="primary" @click="submitPrevStep()">上一步</Button>
                        <Button type="default" @click="handleCancelBtn">取消</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
let { scenicsTicketsMethod } = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this;
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['景区门票', '景区管理'],
            subTitle: (that.$route.query.id) ? '编辑景点' : '新建景点',
            currentItemId: that.$route.query.id,
            updateIcon: '',
            formData: {
                takeBy: [], // 多选，拼接参数ticklabelname
                subscriberule: "",
                returnticketrule: "",
                subscriberemark: "",
                notice: "",
                specialPopulationPolicyRemark: "",
                otherremark: "",
                publishstate: 2, // 默认保存状态为待发布
                ishot: 0,
                base64File1: [],
                
            },
            uploadAlbumList: [], // 图集
            imgName: '',
            visible: false,
            picIndex: "",
            ruleForm: {
                takeBy: [
                    { required: true, type:'array', min: 1, message: '取票信息不能为空', trigger: 'blur' }
                ],
                subscriberule: [
                    { required: true, message: '预约规则不能为空', trigger: 'blur' }
                ],
                returnticketrule: [
                    { required: true, message: '退票规则不能为空' }
                ],
                subscriberemark: [
                    { required: true, message: '预订须知不能为空', trigger: 'blur' }
                ],
                notice: [
                    { required: true, message: '景点取票不能为空', trigger: 'blur' }
                ],
                specialPopulationPolicyRemark: [
                    { required: true, message: '特殊人群政策不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    components: {
        breadcrumb
    },

    mounted () {
        this.uploadAlbumList = this.$refs.uploadAlbum.fileList;
        // 初始化
        if(this.$route.query.id) { // id存在，编辑，query包含获取的全部信息
            this.formData = this.$route.query
            this.formData.returnticketrule = this.formData.returnticketrule == 0 ? "支持退票" : "不支持退票"
            this.formData.subscriberule = this.formData.subscriberule == 0 ? "可预约当天门票" : "需提前一天预约"
        } else if(this.$route.query.subscriberule) { // id不存在，新建，第一步包含第二步信息，是返回上一步后下一步操作
            this.formData = this.$route.query
        } else { // 新建，下一步
            this.formData = Object.assign(this.$route.query, this.formData);
        }
        // formData.ticklabelname取出的是字符串，需要转化成数组
        if(this.formData.ticklabelname) {
            this.formData.takeBy = this.formData.ticklabelname.split("、")
        }
        // 图集数据存在则取出数据，转换为url列表uploadAlbumList
        if(this.formData.imgInfo) {
            this.formData.imgInfo=JSON.parse(this.formData.imgInfo);
            this.uploadAlbumList = [];
            this.formData.imgInfo.map(item => {
                this.uploadAlbumList.push({ id: item.id, url: this.imagePrefix + item.src })
            })
        }
        if(this.formData.uploadAlbumList) {
            this.uploadAlbumList = this.formData.uploadAlbumList
        }
        console.log("this.formData_step2:")
        console.log(this.formData)
    },
    methods: {
        // 预览上传的图片
        handleView (index) {
            this.picIndex = index;
            this.visible = true;
        },
        // 验证要上传的图片格式
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        // 限制要上传的景区图集不超过30张
        handleBeforeUpload (file) {
            let that = this
            const check = that.uploadAlbumList.length < 30;
            if (!check) {
                that.$Notice.warning({
                    title: `最多只能上传 30 张图片`
                });
            } else {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                reader.readAsDataURL(file)            
                reader.onloadend = function (e) {
                    let picFormat = reader.result.split(";")[0].split("/")[1]
                    if(picFormat == "png" || picFormat == "jpeg") {
                        file.url = reader.result
                        that.uploadAlbumList.push(file)

                        let tempObj = {
                            body: reader.result.split(",")[1], // 图片的文件编码string
                            suffix: picFormat // 图片的格式string
                        };
                        if(!that.formData.base64File1) { // 编辑时，formData中没有base64File1数组，无法push
                            that.formData.base64File1 = []
                        }
                        that.formData.base64File1.push(tempObj)
                    }
                }
            }
            return check;
        },
        /***********************************调用接口**************************************/
        // 删除上传的图片
        handleAlbumRemove (file, index) {                        
            let fileList = this.$refs.uploadAlbum.fileList;
            if(file.id) { // 需要删除的是从接口取出的图片
                this.formData.imgInfo[index] = { id: file.id }
                console.log(this.formData.imgInfo)

                this.uploadAlbumList.splice(index, 1); // 删除图集列表中该项
            } else { // 需要删除的是编辑时新增图片
                this.formData.base64File1.splice(fileList.indexOf(file), 1); // 删除提交的图集信息中的该项
            }
            this.$refs.uploadAlbum.fileList.splice(fileList.indexOf(file), 1); // 删除uploadAlbum中fileList的该项
        },
        // 跳转上一步 不需要验证必填
        submitPrevStep() {
            this.formData.uploadAlbumList = this.uploadAlbumList
            this.$router.push({
                path:'/scenicsDetail_1',
                query: this.formData
            })
        },
        // 保存景点 saveClass: 1 直接发布 2 保存待发布
        handleSubmitData(name, saveClass) {
            let that = this, listIsNotNull = true;

            if(that.uploadAlbumList.length == 0 || that.formData.uploadList.length == 0) {
                listIsNotNull = false
                that.$Message.warning("封面图片和图集图片不能为空");
            }

		    that.$refs[name].validate(valid => {
				if (valid && listIsNotNull) {
                    that.formData.ticklabelname = "";
                    // 将取票信息多选框数组转换成字符串 
                    that.formData.takeBy.map((item, index) => {
                        if(index < that.formData.takeBy.length - 1) {
                            that.formData.ticklabelname += item + "、"
                        } else {
                            that.formData.ticklabelname += item
                        }
                    })
                    that.formData.subscriberule = that.formData.subscriberule == "可预约当天门票" ? 0 : 1;
                    that.formData.returnticketrule = that.formData.returnticketrule == "支持退票" ? 0 : 1;

                    that.formData.publishstate = saveClass;
                    
                    if(that.formData.imgInfo) { // 如果有删除图片的处理
                        let deleteList = []
                        that.formData.imgInfo.map((item, index) => {
                            if(!item.src) {
                                deleteList.push(item)
                            }
                        })
                        that.formData.imgInfo = deleteList
                    }
                    
                    console.log("that.formData222:")
                    console.log(that.formData)

                    that.formData.callBack = (res) => {
                        if (res && res.code == 200) {
                            if(saveClass == 1) {
                                that.$Message.success("发布成功");
                            } else {
                                that.$Message.success("保存成功");
                            }
                            that.$router.push({ path: "/scenicsManage" });
                        } else {
                            console.log(res);
                            that.$Message.error("操作失败");
                        }
                    }
                    scenicsTicketsMethod.handleSubmitScenics(that.formData);
				} else {
                    console.log(res);
					this.$Message.error("操作失败");
				}
			});
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
    font-size: 14px;
    .infoBox {
        height: 36px;
        line-height: 36px;
        text-indent: 15px;
        margin-bottom: 20px;
        background-color: #eeebeb;
    }
    .checkBox_takeBy, .radio_subscriberule {
        margin: 0 35px;
    }
    .textBox {
        resize: none;
        width: 800px;
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
