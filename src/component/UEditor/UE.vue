<template>
  <div>
    <script :id=id type="text/plain"></script>
  </div>
</template>
<script>
    import '../../assets/static/UE/ueditor.config.js'
    import '../../assets/static/UE/ueditor.all.js'
    import '../../assets/static/UE/lang/zh-cn/zh-cn.js'
    import '../../assets/static/UE/ueditor.parse.js'
    export default {
        name: 'UE',
        data () {
            return {
                editor: null,
            }
        },
        props: {
            defaultMsg: {
                type: String
            },
            config: {
                type: Object
            },
            id: {
                type: String
            },
        },
        mounted() {
            const _this = this;
            _this.config.initialFrameWidth=800;
            _this.config.initialFrameHeight=400;
            this.editor = UE.getEditor(this.id, this.config); // 初始化UE
            
            // this.editor.addListener("ready", function () {
            //     _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            // });
        },
        methods: {
            getUEContent() { // 获取内容方法
                return this.editor.getContent()
            },
            getUEContentTxt() { // 获取纯文本内容方法
                return this.editor.getContentTxt()
            }
        },
        destroyed() {
            this.editor.destroy();
        }
    }
</script>
