/**
 * API切换
 * 
 */

export function openAPI(){
    let API=process.env.API_ROOT
    return API
}

/**
 * 测试网址和生产网址切换
 * 
 */

export function IP(){
    // let IP="http://10.88.88.22:8080";
    let IP="https://waptest.au32.cn";
    // let IP="https://wap.au32.cn";
    return IP
}
/**
 * 解析url参数
 * Created by yi on 2016-12-28.
 * @return Object {id:12334}
 */

export function urlParse(){
    var url = window.location.search;
    var obj = {};
    var reg = /[?&][^?&]+=[^?&]+/g;
    var arr = url.match(reg);

    if (arr) {
        arr.forEach(function (item) {
            var tempArr = item.substring(1).split('=');
            var key = decodeURIComponent(tempArr[0]);
            var val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
    }
    return obj;
}

/**
 * Created by yi on 2016-12-27.
 */
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
//清除非数字
export function clearNoNum(a,b){
    if(typeof a == 'number'){
        a = a+''
    }
    a=a.replace(/[^\d.]/g,"");
    a=a.replace(/^\./g,"");
    a=a.replace(/\.{2,}/g,".");
    a=a.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    a=a.replace(new RegExp("^(\\-)*(\\d+)\\.(\\d{0,"+b+"}).*$","gmi"),"$1$2.$3");
    return a;
}

/**
 * Created by yi on 2016-12-28.
 */
export function savaToLocal(id, key, value) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(seller);
}
export function loadFromlLocal(id, key, def) {
    let seller = window.localStorage.__seller__;
        if (!seller) {
        return def;
    }
    seller = JSON.parse(seller)[id];
    if (!seller) {
        return def;
    }
    let ret = seller[key];
    return ret || def;
}

/**
 * 设置本地存储
 */
export const setStore = (name, content, type) => {
    if (!name) return;
    content = JSON.stringify(content);
    if(window.localStorage && type=='local'){
        window.localStorage.setItem(name, content);
    }
    if(window.sessionStorage && type=='session'){
        window.sessionStorage.setItem(name, content);
    }
}

/**
 * 获取本地存储
 */
export const getStore = (name, type)=> {
    if (!name) return;
    if(window.localStorage && type=='local'){
        let val = window.localStorage.getItem(name)
        try{
            val = JSON.parse(val)
        }catch(err){
            val = window.localStorage.getItem(name)
        }finally{
            return val
        }
    }
    if(window.sessionStorage && type=='session'){
        let val = window.sessionStorage.getItem(name)
        try{
            val = JSON.parse(val)
        }catch(err){
            val = window.sessionStorage.getItem(name)
        }finally{
            return val
        }
    }
}

/**
 * 删除本地存储
 */
export const removeStore = (name, type) => {
    if (!name) return;
    if(window.localStorage && type=='local'){
        window.localStorage.removeItem(name)
    }
    if(window.sessionStorage && type=='session'){
        window.sessionStorage.removeItem(name)
    }
}

/**
 * 设置cookie
 */
export function setCookie(name, value, iDay){
    var oDate=new Date();
    oDate.setDate(oDate.getDate()+iDay); //用来设置过期时间用的，获取当前时间加上传进来的iDay就是过期时间
    document.cookie=name+'='+value+';expires='+oDate;
};


/**
 * 获取cookie
 */
export function getCookie(name){
    var arr=document.cookie.split('; '); //多个cookie值是以; 分隔的，用split把cookie分割开并赋值给数组
    for(var i=0;i<arr.length;i++){ //历遍数组
        var arr2=arr[i].split('='); //原来割好的数组是：user=simon，再用split('=')分割成：user simon 这样可以通过arr2[0] arr2[1]来分别获取user和simon 
        if(arr2[0]==name&&arr2[1]!=-1){ //如果数组的属性名等于传进来的name
            return arr2[1]; //就返回属性名对应的值
        }
    }
};

/**
 * 删除cookie
 */
export function removeCookie(name){
    setCookie(name, -1, -1); 
};

/**
 * 格式化银行卡号
 */
export function formatBankNo (BankNo){
    var account = new String (BankNo);
    account = account.substring(0,22); /*帐号的总数, 包括空格在内 */
    if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
        /* 对照格式 */
        if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
        ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
            var accountNumeric = accountChar = "", i;
            for (i=0;i<account.length;i++){
                accountChar = account.substr (i,1);
                if (!isNaN (accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
            }
            account = "";
            for (i=0;i<accountNumeric.length;i++){    /* 可将以下空格改为-,效果也不错 */
                if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
                if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
                if (i == 12) account = account + " ";/* 帐号第十二位后数后加空格 */
                account = account + accountNumeric.substr (i,1)
            }
        }
    }
    else
    {
        account = " " + account.substring (1,5) + " " + account.substring (6,10) + " " + account.substring (14,18) + "-" + account.substring(18,25);
    }
    if (account != BankNo.value) BankNo.value = account;
}
/**
 * 添加自定义动画
 * @param  {[type]}   tag [description]
 * @param  {[type]}   obj [description]
 * @param  {Function} fn  [description]
 * @return {[type]}       [description]
 */
export function animate(tag, obj, fn1, fn2, that) {
    clearInterval(tag.timer);
    fn1 && fn1();
    tag.timer = setInterval(function () {
        var flag = true;
        for (var k in obj) {
            if (k == "opacity") {
                var target = obj[k] * 100;
                var leader = getStyle(tag, k) * 100 || 0;
                //缓动运动公式
                var step = (target - leader) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                leader = leader + step;
                //设置的时候
                tag.style[k] = leader / 100;
            } else if (k == "zIndex") {
                //直接设置层级，不需要渐变
                tag.style.zIndex = obj[k];
            } else {
                //普通的，带单位的样式
                //k - 属性名 - 字符串形式 - attr
                //obj[k] - 属性值 - target
                var target = obj[k];//我想要变成得属性值，也就是我传进来的值
                var leader = parseInt(getStyle(tag, k)) || 0;//getStyle(tag, k)是当前被点击元素的属性值
                //缓动运动公式
                var step = (target - leader) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                leader = leader + step;
                //设置的时候
                tag.style[k] = leader + "px";
                if(Math.abs(leader-target)<step){
                  tag.style[k] = target + "px";
                }
            }

            //检测，当前这个属性是否到达了指定位置
            if (leader != target) {
                //阻止清除定时器
                flag = false;
            }
        }

        //我们需要保证obj中每一个obj都运动到位置
        if (flag) {
            clearInterval(tag.timer);
            
            fn2 && fn2();            
        }
    }, 50);
}
/*
获取样式
 */
export function getStyle(tag, attr) {
    return tag.currentStyle ? tag.currentStyle[attr] : getComputedStyle(tag, null)[attr];
}

/*
获取rem,设置动画时有用
 */
export function getRem(){
    var width = document.documentElement.getBoundingClientRect().width; //获取移动设备的宽度
    var maxWidth = 750;
    if (width > maxWidth) {
        width = maxWidth;
    }
    var rem = width * 100 / 750;
    return rem;
}


export function checkAgent(){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid) return 'And';
    else return 'IOS';
}

//检测安卓版本号
export function checkAndroAgent(){
    var userAgent = navigator.userAgent;
    var index = userAgent.indexOf("Android")
    if(index >= 0){
        var androidVersion = parseFloat(userAgent.slice(index+8));
        return androidVersion
    }
}

//检测IOS版本号
export function iosVersion(){
    var str= navigator.userAgent.toLowerCase(); 
    var ver=str.match(/cpu iphone os (.*?) like mac os/);
    if(!ver){
        return null
    }else{
        var asa = ver[1].replace(/_/g,".").split('.')[0]
        return asa
    }
}