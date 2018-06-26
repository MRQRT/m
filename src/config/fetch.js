import router from '@/main.js'
import {a} from '@/main.js'//将vue实例引入
import axios from 'axios'
import qs from 'qs'
import { Toast, MessageBox} from 'mint-ui'
import store from '../store'
import { removeCookie,IP }  from '@/config/mUtils.js'
axios.defaults.baseURL = process.env.API_ROOT   //配置接口地址
// axios.defaults.timeout = 5000; //配置请求的超时时间，超时将被中断
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前将参数序列化
    if(config.method  === 'post' || config.method === 'put') {
        config.data = qs.stringify(config.data);
        config.params = qs.stringify(config.url)
    }
    if(config.method === 'get') {
        config.params = qs.stringify(config.data)
    }
    if(store.getters.token) {
        config.headers['Authorization'] = store.getters.token// 让每个请求携带token
    }
    if(config.url.indexOf('checkCaptcha')!=-1){
        config.withCredentials = true
    }else{
        config.withCredentials = false
    }
    return config;
},(error) =>{
     _.toast("错误的传参", 'fail');
    // return Promise.reject(error);
});

// 拦截响应response，并做一些错误处理
axios.interceptors.response.use(
    response => {
    /*通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页*/
        const res = response
        //401:Token 过期了,未登录授权
        if (res.data.code === 401) {
            store.commit('CLEAR_TOKEN')
            store.commit('CLEAR_USERINFO')
            //页面有登录和未登录两种状态的不做重新登录弹框
            if(a.$route.path!='/currentAndHistory' && a.$route.path!='/buyGold' && a.$route.path!='/buyProductDetail'  && a.$route.path!='/storeGold' && a.$route.path!='/mine' && a.$route.path!='/benefit' && a.$route.path!='/stor' && a.$route.path!='/productDetail' && a.$route.path!='/storOrder' && a.$route.path!='/register' && a.$route.path!='/rule' && a.$route.path!='/ranking'){
                MessageBox.alert('用户身份信息已失效，请重新登录', {
                    confirmButtonText: '重新登录',
                    type: 'warning'
                }).then(() => {
                    // console.log(localStorage.getItem('isWebview'))
                    //再APP环境下，直接地址全部重新加载
                    if(localStorage.getItem('isWebview')){
                        window.location.href=IP()+"/#/loginIn"
                    }else{
                        router.replace({path:'/loginIn'})
                    }
                })
            }
        }
        return Promise.resolve(response)
    },error => {
        if (error.response) {
            // alert("报错了")
            switch (error.response.status) {
                case 400:
                    Toast({
                        message: '请求出错',
                        position: 'bottom',
                        duration: 3000
                    });
                    break;
                case 401:
                    //返回 401 清除token信息并跳转到登录页面
                    MessageBox.alert('用户身份信息已失效，请重新登录', {
                        confirmButtonText: '重新登录',
                        type: 'warning'
                    }).then(() => {
                        store.commit('CLEAR_TOKEN')
                        router.replace({path:'/loginIn'})
                    })
                    break;
                case 500:
                    Toast ({
                        message:'服务器出错',
                        position: 'bottom',
                        duration: 3000,
                    })
                    break;
            }
        }
        return Promise.reject(error)  // 返回接口返回的错误信息
    })

//返回一个Promise(发送post请求)
export function fetch(url, params, method) {
    var method=method.toLowerCase();
    return new Promise((resolve, reject) => {
        axios[method](url, params)
        .then(response => {
            resolve(response.data)
        }, err => {
            reject(error)
        })
        .catch((error) => {
           reject(error)
       })
    })
}

