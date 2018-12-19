// axios 在传参数时需要将对象转化为字符串 引用qs转化
import iView from 'iview';

let qs = require('qs');
import axios from 'axios'

let {
    cacheClass
} = require('./tool/cacheClass');

/**
 *  请求类
 */
let ajax = {
    /**
     *通用的ajax异常回调处理
     *@response ajax异常返回的数据
     *@errorCallback 错误回调函数
     *@isNotErrorPropmt 是否需要错误提示
     */
    error_resp: function (response, errorCallback, isNotErrorPropmt) {
        if (!response) {
            isNotErrorPropmt && iView.Message.error("系统错误，请联系相关人员！");
            if (errorCallback instanceof Function) {
                errorCallback && errorCallback(response);
            }
        } else {
            // 登录超时
            if (response.code === 400 || response.code === 401) {

                iView.Message.error("登录超时，请重新登录");
                cacheClass.deleteAllCache();
                setTimeout(function () {
                    window.location.href = '/#/login';
                }, 2000);
            } else if (response.code === 406) {
                iView.Message.error("账号已在其他地方登录，请重新登录");
                cacheClass.deleteAllCache();
                setTimeout(function () {
                    window.location.href = '/#/login';
                }, 3000);
            } else {
                let errorMsg = response.msg || "系统错误，请联系相关人员！";
                if (errorCallback instanceof Function) {
                    errorCallback && errorCallback(response);
                    isNotErrorPropmt && iView.Message.error(errorMsg);
                } else {
                    isNotErrorPropmt && iView.Message.error(errorMsg);
                }
            }
        }
    },
    /**
     *通用的ajax成功回调处理
     *@response ajax成功返回的数据
     *@successCallback 成功回调函数
     *@errorCallback 错误的回调函数
     *@getDataType 获取回调数据{"list": 数据都在page里, "single": 数据都在formBean里}
     *@isNotErrorPropmt 是否不显示错误信息true:不显示
     */
    success_resp: function (response, successCallback, errorCallback, getDataType, isNotErrorPropmt) {
        if (!response) {
            iView.Message.error("系统错误,请联系相关人员！");
        } else if (response.code == "200" || response.status == "ok") { // response.status 智能接口状态
            let data;
            if (response.data) {
                data = response.data;
            }
            if (successCallback instanceof Function) {
                successCallback && successCallback(response, response.data);
            }
        } else {
            // 调用错误的通用回调
            ajax.error_resp(response, errorCallback, isNotErrorPropmt);
        }
    },
    /**
     * 发送请求方法
     * @requestConfig 设置请求对象
     *   @method 访问类型
     *   @url api地址
     *   @params 请求连接中的请求参数,url参数
     *   @data 请求提需要设置的数据
     *   @getDataType 获取回调数据{"list": 数据都在page里, "single": 数据都在formBean里}
     *   @successCallback 成功的回调函数
     *   @errorCallback 错误的回调函数
     *   @isNotErrorPropmt 是否不显示错误信息true:不显示
     *   @publicUrlType   必传  请求目录类型  1.webManager 2.matterManager 3. 服务运行 4. 电子监察
     */
    request: function (requestConfig, baseURL, loginAjax) {
        // console.log(requestConfig)
        axios({
            method: requestConfig.method,
            // url: requestConfig.url + "?" + parseInt(Math.random() * 10000),
            url: requestConfig.url,
            baseURL: baseURL ? baseURL : this.publicDirectory(requestConfig.publicUrlType), //
            //`headers`是自定义的要被发送的头信息
            /* headers:{
               'Content-Type': requestConfig.method != 'GET' ? "application/json" : 'application/x-www-form-urlencoded; charset=UTF-8'
             },*/
            headers: requestConfig.method == 'get' ? {
                'X-Requested-With': 'XMLHttpRequest',
                "Accept": "application/json",
                "Content-Type": "application/json; charset=UTF-8",
                "token": "" + (loginAjax ? "" : (cacheClass.localStorage.get("GT_LOGININFO") ? cacheClass.localStorage.get("GT_LOGININFO").userToken : '')),
                // "username": "" + (loginAjax ? "" : (cacheClass.localStorage.get("GT_LOGININFO") ? cacheClass.localStorage.get("GT_LOGININFO").userName : ''))
            } : {
                'X-Requested-With': 'XMLHttpRequest',
                "token": "" + (loginAjax ? "" : (cacheClass.localStorage.get("GT_LOGININFO") ? cacheClass.localStorage.get("GT_LOGININFO").userToken : '')),
                // "username": "" + (loginAjax ? "" : (cacheClass.localStorage.get("GT_LOGININFO") ? cacheClass.localStorage.get("GT_LOGININFO").userName : '')),
                'Content-Type': requestConfig.headerContentType ? 'application/x-www-form-urlencoded; charset=UTF-8' : 'application/json; charset=UTF-8'
            },
            // `params`是请求连接中的请求参数，必须是一个纯对象，或者URLSearchParams对象
            params: requestConfig.params || {},
            // `data`是请求提需要设置的数据
            // data: qs.stringify(requestConfig.data) || {},
            data: (requestConfig.headerContentType ? qs.stringify(requestConfig.data) : requestConfig.data) || {},
            // 如果请求的时间超过这个设定时间，请求将会停止
            timeout: 20000,
            traditional: true,
            // `responsetype`表明服务器返回的数据类型，这些类型的设置应该是
            // 'arraybuffer','blob','document','json','text',stream'
            responsetype: 'json',
        }).then(function (response) {
            // console.log(response.data);
            ajax.success_resp(response.data, requestConfig.successCallback, requestConfig.errorCallback, requestConfig.getDataType, requestConfig.isNotErrorPropmt);
        }).catch(function (error) {
            if (error.response) {
                //存在请求，但是服务器的返回一个状态码
                //他们都在2xx之外
                // console.log(error.response.data);
                ajax.error_resp(error.response.data, requestConfig.errorCallback, requestConfig.isNotErrorPropmt);
            } else {
                //一些错误是在设置请求时触发的
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    },
    //公共接口请求目录
    publicDirectory: function (val) {
        let publicUrl = '';
        switch (val) {
            case 1:
                publicUrl = '/tourManager/v1.0';
                break;
            default:
                publicUrl = '/tourManager/v1.0';
                break;
        }
        return publicUrl;
    }
};
export {
    ajax
};
