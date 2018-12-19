<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white" v-show="step==1">
            <div class="infoBox">基本信息</div>
            <Form ref="form1" :rules="rules1" :model="form1" :label-width="120">
                <FormItem label="上传封面：" prop="cover" ref="cover">
                    <div class="upload-list" v-for="item in uploadList1">
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView1()"></Icon>
                            <Icon type="ios-trash-outline" @click="handleRemove1(item)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="upload1"
                        :format="['jpg','jpeg','png']"
                        :max-size="3072" 
                        action="/tourManager/v1.0/other/filedonothing/anon" 
                        :show-upload-list="false"
                        :on-format-error="handleFormatError1"
                        :before-upload="handleBeforeUpload1">
                        <div class="ivu-cover-image">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="visible1">
                        <img :src="uploadList1[0].url" v-if="visible1" style="width: 100%">
                    </Modal>
                    <p class="#999">60 x 60，请上传 .png .jpg图片，3M以内</p>
                </FormItem>
                <FormItem label="酒店名称：" prop="name">
                    <Input v-model="form1.name" placeholder="请输入酒店名称" style="width: 800px;" />
                </FormItem>
                <FormItem label="酒店地址：" prop="address">
                    <Input v-model="form1.address" placeholder="请输入酒店地址" style="width: 800px;" />
                </FormItem>
                <FormItem label="经度：" prop="longitude" style="display: inline-block;">
                    <Input v-model="form1.longitude" placeholder="请输入经度" style="width: 200px;" />
                </FormItem>
                <FormItem label="纬度：" prop="dimension" style="display: inline-block;">
                    <Input v-model="form1.dimension" placeholder="请输入纬度" style="width: 200px;" />
                </FormItem>
                <FormItem label="装修时间：" prop="openTime">
                    <DatePicker type="year" @on-change="openTimeChange" :value="form1.openTime" placeholder="请选择装修时间"  style="width: 800px" ></DatePicker>
                </FormItem>
                <FormItem label="周边景区：" prop="scenics">
                    <Select v-model="form1.scenics" multiple  style="width:800px" clearable @on-change="scenicsChange">
                    <Option v-for="item in scenicsOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="等级：" prop="grade">
                    <Select v-model="form1.grade" style="width:800px" clearable @on-change="gradeChange">
                    <Option v-for="item in gradeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                </FormItem>
                <FormItem label="酒店电话：" prop="telephone">
                    <Input v-model="form1.telephone" placeholder="请输入酒店电话" style="width: 800px;" />
                </FormItem>
                <FormItem label="酒店介绍：" prop="remark">
                    <Input v-model="form1.remark" type="textarea" placeholder="请输入酒店介绍" style="width: 800px"/>
                </FormItem>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="submitNextStep('form1')">下一步</Button>
                        <Button type="default" @click="handleCancelBtn1">取消</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>

         <div class="page-form-group bg-white" v-show="step==2">
            <Form ref="form2" :rules="rules2" :model="form2" :label-width="120">
                <p class="infoBox">设备与服务</p>
                <FormItem label="公共设备">
                    <CheckboxGroup v-model="form2.publicEquipmentArray" @on-change ="publicEquipmentChange">
                        <Checkbox v-for="item in publicEquipmentOptions" :label="item.name" :key="item.name"></Checkbox>
                    </CheckboxGroup> 
                    <p><Button type="text" style="color:rgb(0, 171, 234)" @click="addDefinition(1)">添加自定义</Button></p>   
                </FormItem>  
                <FormItem label="客房设备">
                    <CheckboxGroup v-model="form2.roomEquipmentArray" @on-change ="roomEquipmentChange">
                        <Checkbox v-for="item in roomEquipmentOptions" :label="item.name" :key="item.name"></Checkbox>
                    </CheckboxGroup> 
                    <p><Button type="text" style="color:rgb(0, 171, 234)" @click="addDefinition(2)">添加自定义</Button></p>   
                </FormItem>  
                <FormItem label="酒店服务">
                    <CheckboxGroup v-model="form2.hotelServiceArray" @on-change ="hotelServiceChange">
                        <Checkbox v-for="item in hotelServiceOptions" :label="item.name" :key="item.name"></Checkbox>
                    </CheckboxGroup>
                    <p><Button type="text" style="color:rgb(0, 171, 234)" @click="addDefinition(3)">添加自定义</Button></p>    
                </FormItem>  
                <p class="infoBox">预订规则</p>
                <FormItem label="有效预订期限：" prop="effectiveTimeLimit">
                    <Select v-model="form2.effectiveTimeLimit" style="width:800px" clearable @on-change="effectiveTimeLimitChange">
                    <Option v-for="item in effectiveTimeLimitOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem> 
                <FormItem label="入住信息" prop="checkIninformationArray">
                    <CheckboxGroup v-model="form2.checkIninformationArray" @on-change ="checkIninformationChange">
                        <Checkbox v-for="item in checkIninformationOptions" :label="item.label" :key="item.label"></Checkbox>
                    </CheckboxGroup>    
                </FormItem>   
                <p class="infoBox">其他</p>
                <FormItem label="预订须知：" prop="notes">
                    <Input v-model="form2.notes" type="textarea" placeholder="请输入预订须知" style="width: 800px"/>
                </FormItem>
                <FormItem label="酒店图片：" prop="pics" ref="pics">
                    <div class="upload-list" v-for="item in uploadList2">
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView2(item)"></Icon>
                            <Icon type="ios-trash-outline" @click="handleRemove2(item)"></Icon>
                        </div>
                    </div>
                    <Upload
                        ref="upload2"
                        multiple
                        :format="['jpg','jpeg','png']"
                        :max-size="3072" 
                        action="/tourManager/v1.0/other/filedonothing/anon" 
                        :show-upload-list="false"
                        :on-format-error="handleFormatError2"
                        :before-upload="handleBeforeUpload2">
                        <div class="ivu-cover-image">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="visible2">
                        <img :src="imageUrl" v-if="visible2" style="width: 100%">
                    </Modal>
                    <p class="#999">60 x 60，请上传 .png .jpg图片，最多10张</p>
                </FormItem>
                
                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="submitBtn('form2')">保存</Button>
                        <Button type="primary" @click="submitPrevStep('form2')">上一步</Button>
                        <Button type="default" @click="handleCancelBtn1">取消</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>

        <Modal
        v-model="modal1"
            title="取消编辑"
            @on-cancel="cancel1">
            <p style="text-align:center;color:red">放弃此次酒店编辑？</p>
            <p slot="footer" style="text-align:center">
                <Button type="primary" @click="confirm1">确认</Button>
                <Button @click="cancel1">取消</Button>
            </p>
        </Modal>
        <Modal
            v-model="modal2"
                title="添加自定义"
                @on-cancel="cancel1">
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
    </div>
</template>

<script>
let { hotelMethod } = require('../../script/page.js');
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
    data() {
        let self = this;
        let dimensionValidator = (rule, value, callback) => {
            if(value < -90 || value > 90 || isNaN(value)) {
                callback(new Error('请输入-90到90之间的纬度值'));
            }else {
                callback();
            }
        };
        let longtitudeValidator = (rule, value, callback) => {
            if(value < -180 || value > 180 || isNaN(value)) {
                callback(new Error('请输入-180到180之间的经度值'))
            }else {
                callback();
            }
        };
        return {
            step: 1, // 控制新建酒店的步骤
            imagePrefix: self.imagePrefix,
            breadcrumbs: ['酒店预订','酒店管理'],
            subTitle: (self.$route.query.id) ? '编辑酒店' : '新建酒店',
            uploadList1: [],
            form1: {
                coverBase64File: [],
                name: '',
                address: '',
                longitude: '',
                dimension: '',
                openTime: '',
                scenics: [],
                rimScenicSpot: [],
                grade: '',
                telephone: '',
                remark: '',
                sort: 100
            },
            rules1: {
                cover: [
                    { required: true, message: '酒店封面不能为空', trigger: 'change'}
                ],
                name: [
                    { required: true, message: '酒店名称不能为空', trigger: 'blur' },
                    { type: 'string', max: 25, message: '酒店名称不能超过25个字', trigger: 'blur'}
                ],
                address: [
                    { required: true, message: '酒店地址不能为空', trigger: 'blur' },
                    { type: 'string', max: 50, message: '酒店名称不能超过25个字', trigger: 'blur'}
                ],
                longitude: [
                    { required: true, message: '经度不能为空', trigger: 'blur' },
                    { validator: longtitudeValidator, trigger: 'blur' }
                ],
                dimension: [
                    { required: true, message: '纬度不能为空', trigger: 'blur' },
                    { validator: dimensionValidator, tirgger: 'blur' }
                ],
                openTime: [
                    { required: true, message: '装修时间不能为空', trigger: 'change'}
                ],
                scenics: [
                    { required: true, type: 'array', message: '周边景点不能为空', trigger: 'change' }
                ],
                grade: [
                    { required: true, type: 'number', message: '等级不能为空', trigger: 'change' }
                ],
                telephone: [
                    { required: true, message: '酒店电话不能为空', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '酒店介绍不能为空', trigger: 'blur' }
                ],
            },
            visible1: false,
            modal1: false,
            modal2: false,
            gradeOptions: [
                { label: '民宿/客栈', value: 1 },
                { label: '经济型', value: 2 },
                { label: '高档型', value: 3 },
                { label: '豪华型', value: 4 }
            ],
            scenicsOptions: [], 
            // 第二步
            uploadList2: [],
            form2: {
                publicEquipmentArray: [],
                publicEquipments: [
                    { name: '停车场', isChecked: 0, type: 1 },
                    { name: '健身房', isChecked: 0, type: 1 },
                    { name: '游泳馆', isChecked: 0, type: 1 },
                    { name: '温泉', isChecked: 0, type: 1 }
                ],
                roomEquipmentArray: [],
                roomEquipments: [
                    { name: '免费WIFI', isChecked: 0, type: 2 },
                    { name: '24h热水', isChecked: 0, type: 2 },
                    { name: '洗衣机', isChecked: 0, type: 2 },
                    { name: '空调', isChecked: 0, type: 2 }
                ],
                hotelServiceArray: [],
                hotelServices: [
                    { name: '叫醒服务', isChecked: 0, type: 3 },
                    { name: '行李寄存', isChecked: 0, type: 3 },
                    { name: '泊车指引', isChecked: 0, type: 3 }
                ],
                effectiveTimeLimit: '',
                checkIninformationArray: [],
                checkIninformation: '',
                notes: '', 
                hotelbase64Files: [],
                deleteIds: []   
            },
            rules2: {
                effectiveTimeLimit: [
                    { required: true, type: 'number', message: '有效预定期限不能为空', trigger: 'change' }
                ],
                checkIninformationArray: [
                    { required: true, type: 'array', min: 1, message: '入住信息不能为空', trigger: 'change' }
                ],
                notes: [
                    { required: true, message: '预订须知不能为空', trigger: 'blur' },
                    { type: 'string', max: 250, message: '预订须知不能超过250个字', trigger: 'blur'}
                ],
                pics: [
                    { required: true, message: '酒店图片不能为空', trigger: 'change' }
                ] 
            },
            releaseStatus: 0, // 发布状态
            imageUrl: '',
            visible2: false,
            effectiveTimeLimitOptions: [
                { label: '一个月内', value: 1 },
                { label: '两个月内', value: 2 },
                { label: '三个月内', value: 3 }
            ], 
            checkIninformationOptions: [
                { id: 1, label: '姓名' },
                { id: 2, label: '手机号' },
                { id: 3, label: '身份证号' }
            ],
            publicEquipmentOptions: [
                { name: '停车场', isChecked: 0, type: 1 },
                { name: '健身房', isChecked: 0, type: 1 },
                { name: '游泳馆', isChecked: 0, type: 1 },
                { name: '温泉', isChecked: 0, type: 1 }
            ],
            roomEquipmentOptions: [
                { name: '免费WIFI', isChecked: 0, type: 2 },
                { name: '24h热水', isChecked: 0, type: 2 },
                { name: '洗衣机', isChecked: 0, type: 2 },
                { name: '空调', isChecked: 0, type: 2 }
            ],
            hotelServiceOptions: [
                { name: '叫醒服务', isChecked: 0, type: 3 },
                { name: '行李寄存', isChecked: 0, type: 3 },
                { name: '泊车指引', isChecked: 0, type: 3 }
            ],
            addDefinitionType: 1,
            formDynamic: {
                items: [
                    { value: '', index: 1, status: 1}
                ]
            },
            index: 1

        }
    },
    components: {
        breadcrumb
    },
    created() {
        this.getScenicsList();
        this.getHotelById();
    },
    mounted() {
        if(this.$refs.upload2) {
            this.uploadList2 = this.$refs.upload2.fileList;
        }
    },
    methods: {
        // 第一步
        // 图片预览
        handleView1() {
            this.visible1 = true;
        },
        // 验证要上传的图片格式
        handleFormatError1 (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        // 限制要上传的封面为1张图片
        handleBeforeUpload1(file) {
            let self = this;
            let check = self.uploadList1.length < 1;
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
                        self.uploadList1.push(file);
                        self.rules1.cover = [];
                        self.$refs.cover.validateState = 'success';

                        let tempObj = {
                            body: reader.result.split(",")[1], // 图片的文件编码string
                            suffix: picFormat // 图片的格式string
                        }
                        self.form1.coverBase64File.push(tempObj);
                    }
                }
            }
            return check;
        },
        // 删除上传的图片
        handleRemove1 (file) {
            const fileList = this.$refs.upload1.fileList;
            this.$refs.upload1.fileList.splice(fileList.indexOf(file), 1);
            this.uploadList1 = [];
        },
        openTimeChange(date) {
            this.form1.openTime = date;
        },
        gradeChange(item) {
            this.form1.grade = item;
        },
        scenicsChange(item) {
            this.form1.rimScenicSpot = item.map(val => {
                return {
                    id: val
                }
            });
        },
        submitNextStep(name) {
            let self = this;
            self.$refs[name].validate((valid) => {
                if (valid) {
                    self.step = 2;
                }
            })
        },
        submitPrevStep(name) {
            let self = this;
            self.step = 1;
        },
        handleCancelBtn1() {
            this.modal1 = true;
        },
        cancel1 () {
            this.modal1 = false;
            this.modal2 = false;
        },
        confirm1() {
            this.modal1 = false;
            this.$router.push('/hotelManage');
        },
        // 第二步
        //图片预览
        handleView2(file) {
            this.visible2 = true;
            this.imageUrl = file.url;

        },
        // 验证要上传的图片格式
        handleFormatError2 (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        // 限制要上传的封面为10张图片
        handleBeforeUpload2(file) {
            let self = this;
            let check = self.uploadList2.length < 10;
            if(!check) {
                self.$Notice.warning({
                    title: `最多只能上传 10 张图片`
                });
            }else {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function(e) {
                    let picFormat = reader.result.split(';')[0].split('/')[1];
                    if(picFormat == 'png' || picFormat == 'jpeg') {
                        file.url = reader.result;
                        self.uploadList2.push(file);
                        self.uploadList2.forEach((value, index) => {
                            if(!value.url) {
                                self.uploadList2.splice(index, 1);
                            }
                        });
                        if(!check) {    
                            self.uploadList2.splice(10, self.uploadList2.length - 10);
                        }
                        self.rules2.pics = [];
                        self.$refs.pics.validateState = 'success';

                        let tempObj = {
                            body: reader.result.split(",")[1], // 图片的文件编码string
                            suffix: picFormat // 图片的格式string
                        }
                        self.form2.hotelbase64Files.push(tempObj);
                    }
                }
            }
            return check;
        },
        // 删除上传的图片
        handleRemove2 (file) {
            let fileList = this.$refs.upload2.fileList;
            let fileIndex = this.uploadList2.findIndex(item => {
                    return item == file;
                });
                this.uploadList2.splice(fileIndex, 1);
            if(file.id) {
                this.form2.deleteIds.push(file.id);
            }else {
                this.form2.hotelbase64Files.splice(fileIndex, 1);
            }
        },
        effectiveTimeLimitChange(item) {
            this.form2.effectiveTimeLimit = item;
        },
        checkIninformationChange(item) {
            let sortArr = this.checkIninformationOptions.filter((value, index) => {
                if(item.includes(value.label)) {
                    return {
                        index: value.id,
                        value: value.label
                    }
                }
            });
            sortArr.sort(function(a, b) {
               return a.index - b.index; 
            });
            this.form2.checkIninformation = sortArr.map(value=> {
                return value.label;
            }).join(';');
        },
        publicEquipmentChange(item) {
            this.form2.publicEquipments = this.publicEquipmentOptions.map(val => {
                if(item.includes(val.name)) {
                    val.isChecked = 1;
                }else {
                    val.isChecked = 0;
                }
                return val;
            });
        },
        roomEquipmentChange(item) {
            this.form2.roomEquipments = this.roomEquipmentOptions.map(val => {
                if(item.includes(val.name)) {
                    val.isChecked = 1;
                }else {
                    val.isChecked = 0;
                }
                return val;
            });
        },
        hotelServiceChange(item) {
            this.form2.hotelServices = this.hotelServiceOptions.map(val => {
                if(item.includes(val.name)) {
                    val.isChecked = 1;
                }else {
                    val.isChecked = 0;
                }
                return val;
            });
        },
        // 添加自定义
        addDefinition(type) {
            let self = this;
            self.modal2 = true;
            self.addDefinitionType = type;
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
                    switch(self.addDefinitionType) {
                        case 1:
                            self.publicEquipmentOptions.push(...addItems);
                            self.$Message.success('添加成功');
                            break;
                        case 2:
                            self.roomEquipmentOptions.push(...addItems);
                            self.$Message.success('添加成功');
                            break;
                        case 3:
                            self.hotelServiceOptions.push(...addItems);
                            self.$Message.success('添加成功');
                            break;
                        default:
                    }
                    self.$refs[name].resetFields();
                    self.formDynamic = {
                        items: [
                            { value: '', index: 1, status: 1}
                        ]
                    }
                    self.modal2 = false;
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
            this.modal2 = false; 
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
        getHotelById() {
            let self = this;
            if(!self.$route.query.id) {
                return;
            }
            let params = {
                id: self.$route.query.id,
                callBack(res) {
                    if(res && res.code && res.data) {
                        self.$Message.success('数据请求成功');
                        self.releaseStatus = res.data.releaseStatus;
                        self.form1 = res.data;
                        // 封面回显
                        self.uploadList1 = [ 
                                { url: self.imagePrefix + res.data.coverFileList[0].src }
                        ];
                        if(self.uploadList1.length) {
                            self.rules1.cover = [];
                            self.$refs.cover.validateState = 'success';
                        }
                        // 周边景区
                        self.form1.scenics = res.data.rimScenicSpot.map(item => {
                            return item.id;
                        });
                        // 公共设备
                        self.publicEquipmentOptions = res.data.publicEquipments;
                        res.data.publicEquipments.forEach(item => {
                            if(item.isChecked) {
                                self.form2.publicEquipmentArray.push(item.name);
                            }
                        });
                        self.form2.publicEquipments = res.data.publicEquipments;
                        // 客房设备
                        self.roomEquipmentOptions = res.data.roomEquipments;
                        res.data.roomEquipments.forEach(item => {
                            if(item.isChecked) {
                                self.form2.roomEquipmentArray.push(item.name);
                            }
                        });
                        self.form2.roomEquipments = res.data.roomEquipments;
                        // 酒店服务
                        self.hotelServiceOptions = res.data.hotelServices;
                        res.data.hotelServices.forEach(item => {
                            if(item.isChecked) {
                                self.form2.hotelServiceArray.push(item.name);
                            }
                        });
                        self.form2.hotelServices = res.data.hotelServices;
                        // 有效预订期限
                        self.form2.effectiveTimeLimit = res.data.effectiveTimeLimit;
                        // 入住信息回显
                        self.form2.checkIninformationArray = res.data.checkIninformation.split(';');
                        self.form2.checkIninformation = res.data.checkIninformation;
                        // 预订须知
                        self.form2.notes = res.data.notes;
                        // 酒店图片
                        res.data.hotelFileList.forEach(item => {
                            self.uploadList2.push(
                                { 
                                    url: self.imagePrefix + item.src,
                                    id: item.id
                                 }
                            );
                        });
                        if(self.uploadList2.length) {
                            self.rules2.pics = [];
                            self.$refs.pics.validateState = 'success';
                        }
                        self.form1.coverBase64File = [];
                        self.form2.hotelbase64Files = [];

                    }
                }
            }
            hotelMethod.getHotelById(params);
        },
        // 获取所有景区
        getScenicsList() {
            let self = this;
            let params = {
                callBack(res) {
                    if(res && res.code == 200 && res.data) {
                        self.scenicsOptions = res.data.map(item => {
                            return {
                                label: item.name,
                                value: item.id
                            }
                        }); 
                    }
                }
            }
            hotelMethod.getScenicsSelect(params);
        },
        // 酒店保存
        hotelSave() {
            let self = this;
            let form = Object.assign({}, self.form1, self.form2);
            let params = {
                form,
                callBack(res) {
                    if(res && res.code == 200) {
                        self.$Message.success('保存成功');
                        self.$router.push('/hotelManage');
                    }else {
                        self.$Message.error(res.msg);
                    }
                }
            }
            hotelMethod.hotelSave(params);
        },
        hotelUpdate(type) {
            let self = this;
            let form = Object.assign({}, self.form1, self.form2, {id: self.$route.query.id, releaseStatus: self.releaseStatus });
            let params = {
                form,
                callBack(res) {
                    if(res && res.code == 200) {
                        self.$Message.success(res.msg);
                        self.$router.push('/hotelManage');
                    }else {
                        self.$Message.error(res.msg);
                    }
                }
            }
            hotelMethod.hotelUpdate(params);
        },
        submitBtn(name) {
            let self = this;
            self.$refs[name].validate((valid) => {
                if (valid) {
                    if(self.$route.query.id) {
                        self.hotelUpdate();
                    }else {
                        self.hotelSave();
                    }
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
