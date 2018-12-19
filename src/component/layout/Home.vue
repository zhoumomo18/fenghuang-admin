<template>
    <Layout>
        <Header>
            <layout-header></layout-header>
        </Header>
        <Layout :style="asideStyle">
            <Sider hide-trigger>
                <layout-sidebar></layout-sidebar>
            </Sider>
            <Layout :style="{background:'#e5e5e5'}">
                <Content :style="{margin: '24px'}">
                    <router-view></router-view>
                </Content>
                <Footer>
                    <layout-footer></layout-footer>
                </Footer>
            </Layout>
        </Layout>
    </Layout>
</template>

<script>
import layoutHeader from './Header.vue';
import layoutSidebar from './Sidebar.vue';
import layoutFooter from './Footer.vue';
export default {
    name: "home",
    components: {
        layoutHeader,
        layoutSidebar,
        layoutFooter
    },
    data() {
        return {
            asideStyle: {
                height: document.documentElement.clientHeight - 64 + 'px'
            }
        }
    },
    mounted() {
        let _this = this;
        window.onresize = function () {
            _this.asideStyle.height = document.documentElement.clientHeight - 64 + 'px';
        }
    }
}
</script>

