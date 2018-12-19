<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="ruleForm_1" :style="showForm1" :rules="ruleForm_1" :model="formData_1" :label-width="120">
                <p class="infoBox">基本信息</p>
                <FormItem label="* 上传封面：">
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
                <FormItem label="景区名称：" prop="name">
                    <Input v-model="formData_1.name" placeholder="请输入景区名称" style="width: 800px;" />
                </FormItem>
                <FormItem label="景区地址：" prop="address">
                    <Input v-model="formData_1.address" placeholder="请输入景区地址" style="width: 800px;" />
                </FormItem>
                <FormItem label="经度：" prop="longitude" style="display: inline-block;">
                    <Input v-model="formData_1.longitude" placeholder="请输入经度" style="width: 200px;"/>
                </FormItem>
                <FormItem label="纬度：" prop="dimension" style="display: inline-block;">
                    <Input v-model="formData_1.dimension" placeholder="请输入纬度" style="width: 200px;"/>
                </FormItem>
                <FormItem label="开放时间：" prop="opentime">
                    <Input v-model="formData_1.opentime" placeholder="请输入开放时间" style="width: 800px;" />
                </FormItem>
                <FormItem label="入园基数：" prop="peoplenum">
                    <Input v-model="formData_1.peoplenum" placeholder="请输入大于0的数字" style="width: 800px;"/>
                </FormItem>
                <FormItem label="推荐指数：" prop="ratings">
                    <Input v-model="formData_1.ratings" placeholder="请输入0-5之间的数字" style="width: 800px;"/>
                </FormItem>
                <FormItem label="* 景区介绍：" prop="remark">
                    <UE :defaultMsg="defaultMsg" :config="config" :id="ue1"  ref="ue"></UE>
                </FormItem>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="submitNextStep('ruleForm_1')">下一步</Button>
                        <Button type="default" @click="handleCancelReturnList">取消</Button>
                    </Row>
                </FormItem>
            </Form>
            
            <!-- 下一步内容 -->
            <Form ref="ruleForm_2" :style="showForm2" :rules="ruleForm_2" :model="formData_2" :label-width="120">
                <p class="infoBox">景区规则设置</p>
                <FormItem label="取票信息(多选)：" prop="takeBy">
                    <CheckboxGroup v-model="formData_2.takeBy">
                        <!-- <Checkbox label="姓名"></Checkbox>
                        <Checkbox label="联系电话" class="checkBox_takeBy"></Checkbox>
                        <Checkbox label="身份证号"></Checkbox> -->
                        <Checkbox v-for="item in takeByList" :label="item.id" :key="item.id" class="checkBox_takeBy">
                            {{ item.name }}
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="预约规则：" prop="subscriberule">
                    <RadioGroup v-model="formData_2.subscriberule">
                        <Radio label="可预约当天门票"></Radio>
                        <Radio label="需提前一天预约" class="radio_subscriberule"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="退票规则：" prop="returnticketrule">
                    <RadioGroup v-model="formData_2.returnticketrule">
                        <Radio label="支持退票"></Radio>
                        <Radio label="不支持退票" class="radio_subscriberule"></Radio>
                    </RadioGroup>
                </FormItem>

                <p class="infoBox">其他</p>
                <FormItem label="* 景区图片：">
                    <div class="upload-list" v-for="(item, index) in uploadAlbumList">          
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleAlbumView(index)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleAlbumRemove(item, index)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="uploadAlbum"
                        multiple
                        :format="['jpg','jpeg','png']" 
                        action="/tourManager/v1.0/other/filedonothing/anon"
                        :show-upload-list="false"
                        :on-format-error="handleFormatError"
                        :before-upload="handleAlbumBeforeUpload">
                        <div class="ivu-cover-image">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="albumVisible">
                        <img :src="uploadAlbumList[picIndex].url" v-if="albumVisible" style="width: 100%">
                    </Modal>
                    <p style="color: #999;">请上传 .png .jpg 图片，最多30张</p>
                </FormItem>
                <FormItem label="预订须知：" prop="subscriberemark">
                    <Input v-model="formData_2.subscriberemark" placeholder="请输入预订须知" type="textarea" class="textBox"/>
                </FormItem>
                <FormItem label="景点取票：" prop="notice">
                    <Input v-model="formData_2.notice" placeholder="请输入景点取票信息" type="textarea" class="textBox"/>
                </FormItem>
                <FormItem label="特殊人群政策：" prop="specialPopulationPolicyRemark">
                    <Input v-model="formData_2.specialPopulationPolicyRemark" placeholder="请输入特殊人群政策" type="textarea" class="textBox"/>
                </FormItem>
                <FormItem label="温馨提示：" prop="otherremark">
                    <Input v-model="formData_2.otherremark" placeholder="请输入温馨提示" type="textarea" class="textBox"/>
                </FormItem>

                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmitData('ruleForm_2', 1)">直接发布</Button>
                        <Button type="primary" @click="handleSubmitData('ruleForm_2', 2)">保存</Button>
                        <Button type="primary" @click="submitPrevStep()">上一步</Button>
                        <Button type="default" @click="handleCancelReturnList">取消</Button>
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
        let that = this;
        let validateLongitude = (rule, value, callback) => {
            if(value === "") {
                return callback(new Error('经度值不能为空'))
            } else if(value < -180 || value > 180 || isNaN(value)) {
                callback(new Error('请输入-180到180之间的经度值'))
            } else {
                callback();
            }
        };
        let validateDimension = (rule, value, callback) => {
            if(value === "") {
                return callback(new Error('纬度值不能为空'))
            } else if(value < -90 || value > 90 || isNaN(value)) {
                callback(new Error('请输入-90到90之间的纬度值'));
            } else {
                callback();
            }
        };
        let validateRatings = (rule, value, callback) => {
            var reg = /^\d+\.?\d{0,1}$/;
            if (!value || isNaN(value)) {
                return callback(new Error('请输入正确的推荐指数'));
            } else if( value < 0 || value > 5) {
                callback(new Error('请输入0到5之间的推荐指数'));
            } else if( !reg.test(value) ) {
                callback(new Error('最多输入一位小数'));
            } else {
                callback()
            }
        };
        let validatePeoplenum = (rule, value, callback) => {
            if (!value) {
                return callback();
            } else if(!Number.isInteger(value * 1) || value < 0) {
                callback(new Error('请输入正确的入园基数'));
            } else {
                callback()
            }
        };
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['景区门票','景区管理'],
            subTitle: (that.$route.query.id) ? '编辑景点' : '新建景点',
            currentItemId: that.$route.query.id,
            updateIcon: '',
            takeByList: [ // 取票信息checkBox list
                { id: 0, name: '姓名' },
                { id: 1, name: '联系电话' },
                { id: 2, name: '身份证号' }
            ],
            showForm1: "display: block",
            showForm2: "display: none",
            formData_1: {
                id: that.$route.query.id,
                name: "",
                address: "",
                longitude: "",
                dimension: "",
                opentime: "",
                peoplenum: "",
                ratings: "",
                remark: "",
                base64File: []
            },
            ratingNumber: "",
            formData_2: {
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
                imgInfo: []
            },
            uploadList: [], // 封面
            uploadAlbumList: [], // 图集
            visible: false,
            albumVisible: false,
            picIndex: "",
            ruleForm_1: {
                name: [
                    { required: true, type: 'string', max: 24, message: '请输入24字以内的景点名称', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '地址不能为空', trigger: 'blur' }
                ],
                longitude: [
                    { required: true, validator: validateLongitude, trigger: 'blur' }
                ],
                dimension: [
                    { required: true, validator: validateDimension, tirgger: 'blur' }
                ],
                peoplenum: [
                    { validator: validatePeoplenum, trigger: 'blur' }
                ],
                opentime: [
                    { required: true, message: '开放时间不能为空', trigger: 'blur' }
                ],
                ratings: [
                    { required: true, validator: validateRatings, trigger: 'blur' }
                ]
            },
            ruleForm_2: {
                takeBy: [
                    { required: true, type:'array', min: 1, message: '取票信息不能为空', trigger: 'change' }
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
        // this.uploadList = this.$refs.upload.fileList;
        // this.uploadAlbumList = this.$refs.uploadAlbum.fileList;
        // 初始化
        this.getScenicsDetailById()
        this.initUEeditor(this.formData_1.remark)
    },
    methods: {
        // 预览上传的封面图片
        handleView () {
            this.visible = true;
        },
        // 预览上传的图集图片
        handleAlbumView (index) {
            this.picIndex = index;
            this.albumVisible = true;
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
                    title: `最多只能上传 1 张封面图片`
                });
            } else {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                reader.readAsDataURL(file)            
                reader.onloadend = function (e) {
                    let picFormat = reader.result.split(";")[0].split("/")[1]
                    if(picFormat == "png" || picFormat == "jpeg") {  
                        file.url = reader.result
                        that.uploadList = []
                        that.uploadList.push(file)

                        that.formData_1.base64File = [
                            {
                                body: reader.result.split(",")[1], // 图片的文件编码string
                                suffix: picFormat // 图片的格式string
                            }
                        ]
                        console.log("that.formData_1.base64File:")
                        console.log(that.formData_1.base64File)
                    }
                }
            }
            return check;
        },
        // 限制要上传的景区图集不超过10张
        handleAlbumBeforeUpload (file) {
            let that = this
            const check = that.uploadAlbumList.length < 10;
            if (!check) {
                that.$Notice.warning({
                    title: `最多只能上传 10 张景区图片`
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
                        if(!that.formData_2.base64File1) { // 编辑时，formData_2中没有base64File1数组，无法push
                            that.formData_2.base64File1 = []
                        }
                        that.formData_2.base64File1.push(tempObj)
                        console.log(that.formData_2.base64File1)
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
        // 删除上传的图集图片
        handleAlbumRemove (file, index) {
            console.log(index)
            console.log(this.uploadAlbumList)
            let fileList = this.$refs.uploadAlbum.fileList;
            if(file.id) { // 需要删除的是从接口获取的图片
                console.log("id:" + file.id)
                this.formData_2.imgInfo.map((item, imgInfoIndex) => {
                    if(item.id == file.id) {
                        this.formData_2.imgInfo[imgInfoIndex] = { id: file.id }
                    }
                })
                this.uploadAlbumList.splice(index, 1); // 删除图集列表中该项
            } else { // 需要删除的是编辑时新增图片
                this.formData_2.base64File1.splice(index, 1); // 删除提交的图集信息中的该项
                this.uploadAlbumList.splice(index, 1);
                this.$refs.uploadAlbum.fileList.splice(index, 1); // 删除uploadAlbum中fileList的该项
            }
        },
        //初始化富文本框
        initUEeditor: function (content) {
            let self = this;
            self.$refs.ue.editor.ready(function () {
                self.$refs.ue.editor.setContent(content); // 设置编辑框内容为初始内容content
            });
        },
        /*********************************** 调用接口 ************************************/
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
                            that.formData_1.name = res.data.name
                            that.formData_1.address = res.data.address
                            that.formData_1.longitude = res.data.longitude * 1
                            that.formData_1.dimension = res.data.dimension * 1
                            that.formData_1.opentime = res.data.opentime
                            that.formData_1.peoplenum = res.data.peoplenum
                            that.formData_1.ratings = res.data.ratings
                            that.initUEeditor(res.data.remark) // 设置富文本框内容
                            that.uploadList = [ // 显示获取的封面
                                { url: that.imagePrefix + res.data.title[0].src }
                            ];
                            // ******************* 第二步信息 ******************
                            that.formData_2.subscriberemark = res.data.subscriberemark
                            that.formData_2.notice = res.data.notice
                            that.formData_2.specialPopulationPolicyRemark = res.data.specialPopulationPolicyRemark
                            that.formData_2.otherremark = res.data.otherremark
                            that.formData_2.returnticketrule = res.data.returnticketrule == 0 ? "支持退票" : "不支持退票";
                            that.formData_2.subscriberule = res.data.subscriberule == 0 ? "可预约当天门票" : "需提前一天预约";
                            // ticklabelname取出的是字符串，需要转化成数组takeBy
                            // that.formData_2.takeBy = res.data.ticklabelname.split("、")
                            
                            res.data.ticklabelname.split("、").map(ticklabelItem => {
                                that.takeByList.map(takeByItem => {
                                    if(ticklabelItem == takeByItem.name) {
                                        that.formData_2.takeBy.push(takeByItem.id)
                                    }
                                })
                            })
                            
                            that.formData_2.imgInfo = res.data.imgInfo
                            that.formData_2.imgInfo.map(item => { // 显示获取的图集图片
                                that.uploadAlbumList.push({ id: item.id, url: this.imagePrefix + item.src })
                            })
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
            let that = this, form1Check = true
            if(that.uploadList.length == 0) {
                that.$Message.warning("请上传封面图片");
                form1Check = false
            } else if(!that.$refs.ue.editor.getContent()) {
                that.$Message.warning("请填写景区介绍");
                form1Check = false
            }
            that.$refs[name].validate((valid) => {
                if (valid && form1Check) {
                    that.showForm1 = "display: none"
                    that.showForm2 = "display: block"
                    that.formData_1.remark = that.$refs.ue.editor.getContent()
                }else {
                    that.$Message.error("请检查填写项");
                    return false
                }
            })
        },
        // 保存景点 saveClass: 1 直接发布 2 保存待发布
        handleSubmitData(name, saveClass) {
            let that = this, listIsNotNull = true;

            if(that.uploadAlbumList.length == 0 || that.uploadList.length == 0) {
                listIsNotNull = false
                that.$Message.warning("封面图片和图集图片不能为空");
            }

		    that.$refs[name].validate(valid => {
                
                if (valid && listIsNotNull) {
                    that.formData_2.ticklabelname = "";
                    // 将取票信息多选框数组转换成字符串

                    that.formData_2.takeBy.sort().map((item, index) => {
                        if(index < that.formData_2.takeBy.length - 1) {
                            that.formData_2.ticklabelname += that.takeByList[item].name + "、"
                        } else {
                            that.formData_2.ticklabelname += that.takeByList[item].name
                        }
                    })
                    that.formData_2.subscriberule = that.formData_2.subscriberule == "可预约当天门票" ? 0 : 1;
                    that.formData_2.returnticketrule = that.formData_2.returnticketrule == "支持退票" ? 0 : 1;
                    

                    if(that.formData_2.imgInfo) { // 如果有删除图片的处理
                        let deleteList = []
                        that.formData_2.imgInfo.map((item, index) => {
                            if(!item.src) {
                                deleteList.push(item)
                            }
                        })
                        that.formData_2.imgInfo = deleteList
                    }

                    let allData = Object.assign({}, that.formData_1, that.formData_2);
                    allData.publishstate = saveClass;
                    allData.callBack = (res) => {
                        if (res && res.code == 200) {
                            if(saveClass == 1) {
                                that.$Message.success("发布成功");
                            } else {
                                that.$Message.success("保存成功");
                            }
                            that.$router.go(-1); // 保存成功，返回上一级
                        } else {
                            that.$Message.error(res.msg);
                            that.formData_2.subscriberule = that.formData_2.subscriberule == 0 ? "可预约当天门票" : "需提前一天预约";
                            that.formData_2.returnticketrule = that.formData_2.returnticketrule == 0 ? "支持退票" : "不支持退票";
                        }
                    }
                    console.log(allData)
                    scenicsTicketsMethod.handleSubmitScenics(allData);
				} else {
					that.$Message.error("请检查必填写");
				}
			});
        },
         // 取消按钮，返回列表
        handleCancelReturnList () {
            this.$Modal.confirm({
                title: '确定返回列表页？',
                onOk: () => {
                    this.$router.go(-1); // 取消，返回上一级
                }
            });
        },
        // 返回第一步 不需要验证必填
        submitPrevStep() {
            let that = this
            that.showForm1 = "display: block";
            that.showForm2 = "display: none";
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
