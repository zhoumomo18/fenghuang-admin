<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="formValidate" :label-width="120" :rules="ruleValidate" :model="formData">
                <FormItem label="广告位名称：" prop="name">
                    <Input v-model="formData.name" placeholder="请输入广告位名称"/>
                </FormItem>
                <FormItem label="状态：" prop="chooseStatus">
                    <RadioGroup v-model="formData.chooseStatus">
                        <Radio label="启用" class="adSenseDetai-radio"></Radio>
                        <Radio label="禁用"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                        <Button type="default" @click="handleCancel">返回</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
let { adManageMethod } = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue";
export default {
	props: {},
	data() {
		return {
			breadcrumbs: ["广告管理", "广告位管理"],
			subTitle: "新建广告位",
			status: "1",
			formData: {
				name: "",
				chooseStatus: "启用"
			},
			ruleValidate: {
				name: [
					{ required: true, message: "广告位名称不能为空", trigger: "blur" }
                ],
                chooseStatus: [
					{ required: true, message: "广告位状态不能为空", trigger: "blur" }
                ]
			}
		};
	},
  	components: {
		breadcrumb
  	},
	mounted() {
		console.log(this.$route.query);
		this.getDetailInfo()
	},
    methods: {
		getDetailInfo() {
            let that = this;
            if(that.$route.query.id) {
                let params = {
                    id: that.$route.query.id,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.$Message.success("数据请求成功");
                            that.formData.name = res.data.name;
                            that.formData.chooseStatus = res.data.status == "1" ? "启用" : "禁用";
                        } else {
                            that.$Message.error(res.msg);
                        }
                    }
                };
                adManageMethod.getAdsenseById(params);
            }
		},
		handleSubmit(name) {
			let that = this;
		    that.$refs[name].validate(valid => {
				if (valid) {	
					let data = {
						id: that.$route.query.id,
						name: that.formData.name,
                        status: that.formData.chooseStatus == "启用" ? "1" : "2",
                        callBack: res => {
							if (res && res.code == 200) {
                                that.$Message.success("保存成功");
                                that.$router.go(-1);
							} else {
                                that.formData.chooseStatus = that.formData.chooseStatus == "1" ? "启用" : "禁用";
								that.$Message.error(res.msg);
							}
						}
                    };
                    adManageMethod.handleAdsenseSubmit(data);
				} else {
					this.$Message.error("请检查必填项");
				}
			});
		},
		handleCancel() {
            this.$Modal.confirm({
                title: '返回广告位列表页？',
                onOk: () => {
                    this.$router.go(-1);
                }
            });
			
		}
    }
};
</script>


<style lang="less" scoped>
.page-form-group {
  padding: 24px;
  .ivu-row-flex {
    padding-top: 20px;
    margin-bottom: 16px;
    .ivu-btn {
      margin-right: 24px;
    }
  }
  .ivu-cover-image {
    width: 180px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #dcdee2;
  }
  .red {
    color: #f00;
  }
}

.adSenseDetai-radio {
  margin-right: 65px;
}
</style>
