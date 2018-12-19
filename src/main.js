import Vue from 'vue';
import VueRouter from "vue-router";
import routes from './router.js';    //路由配置
import App from './App.vue';
import iView from 'iview';
import './style/common.less';
import 'iview/dist/styles/iview.css';
import {imagePrefix } from './script/config.js';
//iVew主题样式
import '../my-theme/index.less';

var {cacheClass} =  require('./script/common.js');
import hasAuthorityDirective from './script/directive/hasAuthority.js';
import hasMenuAuthorityDirective from './script/directive/menuAuthority.js';

Vue.use(VueRouter);
Vue.use(iView);
Vue.prototype.imagePrefix = imagePrefix; //挂载到Vue实例上面~

const router = new VueRouter(
    routes
)

/**
* 导航钩子函数
*/
router.beforeEach((transition, from, next) => {
	if(transition.meta.title){
		document.title=transition.meta.title;
	}
	// 登录路径不执行
	// if(transition.path.indexOf('login') == -1){
	// 	// 判断缓存信息是否存在，不存在则直接跳转登录页
	// 	cacheClass.judgeLoginOut(function(){
	//     	return next({ path: '/login' });
	// 	})
	// }
	 next();
})

const app = new Vue({
	el: "#application",
	router,
	// store,//使用store
	render: h => h(App),
});

/**
* 权限指令
*/
Vue.directive("hasAuthority", {
	// 自定义指令的三个生命周期
	//bind 第一次绑定到DOM元素上的时候触发
	bind: function(el, binding) {
        // 判断缓存信息是否存在，不存在则直接跳转登录页，否则取里面的数据
        var judgeLoginOut = cacheClass.judgeLoginOut();
        var loginInfo = judgeLoginOut.loginInfo;

		var hasPermission = hasAuthorityDirective.hasAuthority(binding.value, loginInfo);
		if(!hasPermission){
			el.remove();
		}
	},
	//update bind完成之后立刻触发，以后每当参数更新的时候都会触发  
	//Directive 接收到一个值的更新的时候就会执行对应的代码。
	//update函数接收的参数就是用户通过 Attr 传入的值。
	update: function(el, binding, vnode, oldVnode) {
        // 判断缓存信息是否存在，不存在则直接跳转登录页，否则取里面的数据
        var judgeLoginOut = cacheClass.judgeLoginOut();
        var loginInfo = judgeLoginOut.loginInfo;

		var hasPermission = hasAuthorityDirective.hasAuthority(binding.value, loginInfo);
		if(!hasPermission){
			el.remove();
		}
	},
	//unbind 解除和DOM元素的绑定时触发 
	unbind: function() {
	}
});
Vue.directive("menuAuthority", {
	bind: function(el, binding) {
        // 判断缓存信息是否存在，不存在则直接跳转登录页，否则取里面的数据
        var judgeLoginOut = cacheClass.judgeLoginOut();
        var loginInfo = judgeLoginOut.loginInfo;

		var hasPermission = hasMenuAuthorityDirective.menuAuthority(binding.value, loginInfo);
		if(!hasPermission){
			el.remove();
		}
	},
	update: function(el, binding, vnode, oldVnode) {
        // 判断缓存信息是否存在，不存在则直接跳转登录页，否则取里面的数据
        var judgeLoginOut = cacheClass.judgeLoginOut();
        var loginInfo = judgeLoginOut.loginInfo;

		var hasPermission = hasMenuAuthorityDirective.menuAuthority(binding.value, loginInfo);
		if(!hasPermission){
			el.remove();
		}
	},
	unbind: function() {
	}
});
