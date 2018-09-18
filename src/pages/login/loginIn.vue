<template>
	<div class="loginIn">
		<div class="head-top" id="head_top">
            <img src='../../images/blackClose.png' @click="backWard">
		</div>
    <!--logo模块-->
    <section class="logoPart">
        <img src="../../images/Mainlogo.png">
    </section>

    <!--登入方式模块-->
	<section class="loginPart">
        <!--登入方式切换-->
        <div class="tabPart">
            <div class="fastLogin" ref="fastLogin" @click="chooseMethod" :class="{'actived':withStyle1}" style="margin-right:.8rem;">手机号快捷登入
                <span class="activedBar" v-show="fast"></span>
            </div>

            <div class="pwdLogin" ref="pwdLogin" @click="chooseMethod" :class="{'actived':withStyle2}">账号密码登入
                <span class="activedBar" v-show="pwd"></span>
            </div>
        </div>

        <!--登入方式内容切换-->
         <div class="loginContent">
           <!--手机号快捷登录-->
           <div class="fastContent" ref="fastContent" v-show="fast">
               <div class="telephone">
                   <input type="number" id="inputTel" placeholder="请输入手机号" v-model="num" @focus="startInput" style="width:90%;" pattern="[0-9]*" maxlength="11">
                   <span class="wrongNumber" ref="wrongNumber" v-show="numWrong">手机号码格式错误</span>
                   <span class="getIdenCode" @click="getCode" ref="send_smscode">获取验证码</span>
               </div>
               <div class="identify">
                   <input type="number" id="identifyCode" placeholder="请输入验证码" @focus="iptCode" v-model="code" style="width:100%;" pattern="[0-9]*">
                   <span class="wrongIdenCode" ref="wrongIdenCode" v-show="codeWrong">请输入6位数字</span>
               </div>
               <p class="hotTip">温馨提示:&nbsp;未注册账号的手机号,登录时将自动注册</p>
           </div>
           <!--密码登录-->
           <div class="pwdContent" ref="pwdContent" v-show="pwd">
               <div class="account">
                   <input type="number" id="inputAcc" placeholder="请输入手机号" v-model="account" @focus="inputAcc" style="width:90%;" pattern="[0-9]*" maxlength="11">
                   <span class="wrongAcc" ref="wrongAccount" v-show="accWrong">手机号码格式错误</span>

                   <img src="../../images/clearinput.png" class="clear accIpt" v-show="hasShow" @click="clearAccIpt">
               </div>
               <div class="password">
                   <input type="password" v-if="close" id="inputPwd" @focus="startPwd" placeholder="请输入密码"  v-model="password" ref="inputPwd" maxlength="20" style="width:90%;">
                   <input v-else type="text"   placeholder="请输入密码" id="inputPwd" v-model="password" ref="inputPwd" @focus="startPwd"  maxlength="20">
                   <span class="visible" v-show="close"><img src="../../images/close.png" style="width:.36rem;height:.15rem;"  @click="toggleClose"></span>
                   <span class="visible" v-show="!close"><img src="../../images/open.png" style="width:.36rem;height:.22rem;"  @click="toggleOpen"></span>
                   <span class="wrongPwd" ref="wrongPassword" v-show="pwdWrong">密码格式错误</span>
               </div>
               <p class="forgetPwd">
                    <span @click="$router.push('/getBackPwd')" style="float:right">忘记密码?</span>
               </p>
           </div>
         </div>
    </section>
    <!--登入按钮-->
    <div class="login"  @click="goToNext" ref="login">
        <mt-button type="default" :class="{'hasActived':highLight,'noActived':dark}">登录</mt-button>
    </div>
    <!--微信登入-->
    <div class="weixin_login" style="display:none;">
        <p class="weixin_text">其他登录方式</p>
        <img src="../../images/weixinLogin.png" class="weixin_img" @click="weixinLogin">
    </div>
   <!--  <a class="login" @click="goToNext" :class="{'hasActived':highLight,'noActived':dark}" ref="login">登录</a> -->
    <!--遮罩层-->
    <section class="floatLayer" v-show="picCodeVisible"></section>

    <!--图片验证码-->
    <section class="pictureCode" v-show="picCodeVisible">
        <h3>输入图片验证码</h3>

        <section class="picPart">
           <div class="mainContent">
               <input type="text" class="iptPic" v-model="picture">
               <img :src="openAPI" class="picCode" v-if="picCodeVisible">
               <img src="../../images/replace.png" class="replace" @click="reloadCaptcha">
           </div>
        </section>
        <div class="btn">
            <span class="cancel" @click="picCancel">取消</span>
            <span class="ok" @click="picConfirm">确定</span>
        </div>
    </section>
	</div>
</template>
<script>
    import {setCookie,getCookie,openAPI,checkAgent,getStore,removeStore} from '@/config/mUtils.js'
    import {mapMutations,mapState} from 'vuex'
    import {sendSms,quickLogin,quickLogin2,login,picCheck,queryMyProfil} from '@/service/getData.js'
    import { Toast,Button } from 'mint-ui'
	export default {
		data(){
			return {
				lotteryUrl:'http://test.activity.au32.cn', //抽奖活动地址
                openAPI:openAPI()+'/v3/member/captcha',
                fast:true,
                pwd:false,
                withStyle1:true,
                withStyle2:false,
                numWrong:false,//控制快捷登录校验手机号
                codeWrong:false,//控制快捷登录校验验证码
                num:'',//手机号登入之手机号
                code:'',//手机号登录之验证码
                rightShow_1:0,//手机号验证正确图标显示开关(快捷登录)
                rightShow_2:0,//手机号验证正确图标显示开关(账号密码登录)
                account:'',//账号登入之账号
                password:'',//账号登录之密码
                highLight:false,//按钮高亮
                dark:true,   //默认登录按钮置灰
                accWrong:false,//控制账号登录校验账号
                pwdWrong:false,//控制账号登录校验密码
                hasShow:false,//密码登入手机号清除输入框之按钮显示与否
                close:true, //默认密码不可见眼睛睁开或闭合
                picCodeVisible:false,//图片验证码层显示与否
                errTimes:0,//登入错误次数图片验证码需要
                picture:'', //输入图片验证码字符
                iNow: true,//解决重复点击问题
                second: 60,//获取验证码的毫秒数
                params:null, //邀请好友链接带进来的邀请码
                inviteCode:null,//世界杯的邀请码
                activityId:null,//世界杯的活动id
                agent:'',//安卓和ios判断
			}
		},
        created() {

        },
		mounted() {
            window.isApp();//是否在app
            var ag=checkAgent();//安卓和ios判断
            this.agent=ag;//
            if(localStorage.getItem('isWebview')){
                document.querySelector('.weixin_login').style.display="block"
            }
            //从世界杯活动进来
            var obj=this.$route.query
            if(obj && obj.activityId){
                this.inviteCode=obj.inviteCode
                this.activityId=obj.activityId
                return
            }
            //积分邀请页跳登入页面
            if(window.location.hash && (window.location.hash.indexOf('?')!=-1)){
                var serach=window.location.hash.split('?')
                if(serach){
                    var arr=serach[1].split('=')
                    if(arr[0]=='inviteCode'){
                        this.params=arr[1]
                        if(this.params.indexOf('&')!=-1){  //删除微信额外加的出于其他目的的参数
                            this.params=this.params.split('&')[0]
                        }
                    }
                }
            }
		},
		computed:{
            ...mapState([
                'userInfo'
            ]),
		},
        watch:{
            //监听输入的手机号
            num(val){
                let reg = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{8}$/;
                if(val.length>11){
                    this.num = val.slice(0,11)
                }
                if(val.match(reg)){
                    this.rightShow_1 = 1
                }else if(val ==''){
                    this.rightShow_1 = 0
                }else{
                    this.rightShow_1 = 0
                }
            },
            //控制验证码长度
            code(val){
                if(val>6){
                    this.code=this.code.slice(0,6);
                }
                //按钮高亮
                if(val!=''&&val.length==6&&this.rightShow_1==1){
                    this.highLight=true;this.dark=false;
                }else{
                    this.highLight=false;this.dark=true;
                }
            },
            password(val){ //控制登入按钮高亮显示
                if(val!='' && this.rightShow_2==1 && val.length>=6){
                    this.highLight=true;this.dark=false;
                }else{
                    this.highLight=false;this.dark=true;
                }
            },
            account(val){  //控制账号登入之账号长度
                let reg = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{8}$/;
                this.account?this.hasShow=true:this.hasShow=false
                if(val.length>11){
                    this.account = val.slice(0,11)
                }
                if(val.match(reg)){
                    this.rightShow_2 = 1;
                }else if(val ==''){
                    this.rightShow_2 = 0
                }else{
                    this.rightShow_2 = 0
                }
                if(this.rightShow_2==1&&this.password!=''){
                    this.highLight=true;this.dark=false;
                }else{
                    this.highLight=false;this.dark=true;
                }
            }
        },
		methods:{
            ...mapMutations([
                'RECORD_TOKEN','RECORD_USERINFO'
            ]),
            //微信登入
            weixinLogin(){
                window.openWeChat()
            },
            //点击左上角关闭按钮
            backWard(){
                var from=this.$route.query && this.$route.query.from
                if(this.params){
                    window.toApp();
                    this.$router.push('/buyGold');
                }else if(from=='register' || from=='ranking' || from=='/productDetail'){
                    this.$router.back(-1);
                }else{
                    window.toApp();
                    this.$router.back(-1);
                }
            },
			chooseMethod($event){
                this.highLight=false;this.dark=true;
                if($event.target==this.$refs.fastLogin){
                    this.withStyle1=true;
                    this.withStyle2=false;
                    this.num='';
                    this.account='';
                    this.formetAcc='';
                    this.formetTel='';
                    this.fast=true;
                    this.pwd=false;
                    this.errTimes=0;
                    this.picture='';
                    this.password='';
                    this.code='';
                }else{
                    this.withStyle1=false;
                    this.withStyle2=true;
                    this.num='';
                    this.account='';
                    this.formetAcc='';
                    this.formetTel='';
                    this.fast=false;
                    this.pwd=true;
                    this.errTimes=0;
                    this.picture='';
                    this.password='';
                    this.code='';
                }
            },
            async reloadCaptcha(){  //重新加载图片验证码
                if(!document.querySelector('.picCode')) return;
                document.querySelector('.picCode').src=openAPI()+'/v3/member/captcha?r='+Math.random()
            },
            picCancel(){
                this.picCodeVisible=false;
                this.picture='';
            },
            async picConfirm(){
                this.picCodeVisible=false;
                var res=await picCheck(this.picture);
                if(res.code==100){
                    Toast({
                        message: '图片验证成功',
                        position: 'bottom',
                        duration: 3000
                    });
                    this.errTimes=0;
                }else{
                    Toast({
                        message: '图片验证失败',
                        position: 'bottom',
                        duration: 3000
                    });
                     this.errTimes++;
                }
            },
            resetPicCaptcha(){  //判断登入错误次数
                    this.picCodeVisible=true;//输入图片验证码区域出现
                    this.picture=''
                    this.reloadCaptcha()
            },
            async goToNext(){   //点击登录
                if(this.$refs.login.classList.contains('noActived')) {return;}//登录按钮未高亮不能进行下一步
                if(this.errTimes>=3){
                    this.resetPicCaptcha();
                    return;
                }
                if(this.fast){  //快捷登录
                    var reg=/\d{6}/;
                    var code=this.code,
                        phone=this.num;
                    if(!reg.test(code)){
                        this.codeWrong=true;
                        return;
                    }
                    if(this.params){
                        var reObj = await quickLogin(phone,code,this.params);
                    }else if(this.activityId){
                        var reObj = await quickLogin(phone,code,this.inviteCode,this.activityId);
                    }else{
                        if(getStore('isWebview','local')){//项目在app中
                            if(this.agent=='And'){//项目在安卓
                                let appsource=getStore('appsource','local');
                                let source='ZYPT_Android_appstore-'+appsource+'_#';
                                var reObj=await quickLogin2(phone,code,source);
                            }else if(this.agent=='IOS'){//项目在ios
                                var reObj=await quickLogin2(phone,code,'ZYPT_IOS_appleStore_#');
                            }
                        }else{//项目不在app中
                            if(getStore('tg','local')!='undefined'&&getStore('tg','local')!=null){//推广用户
                                var tg=getStore('tg','local');
                                var browser=getStore('browser','local')?getStore('browser','local'):'#';
                                let source='TG_H5_'+tg+'_'+browser;
                                var reObj = await quickLogin2(phone,code,source);
                            }else{//自营平台的用户
                                var browser=getStore('browser','local')?getStore('browser','local'):'#';
                                let source='ZYPT_H5_#_'+browser;
                                var reObj = await quickLogin2(phone,code,source);
                            }
                        }
                    }
                    if(reObj.code=='-1005'){//用户未设置登录密码
                        this.RECORD_TOKEN(reObj.content)
                        localStorage.setItem('needRender',true)  //依据此变量判断生金需不需要初始化数据
                        window.sendUserId(reObj.content.userId,reObj.content.token);//给APP传userId和token

                        if(this.$route.query.from){
                            var path=this.$route.query.from
                        }
                        if(path=='register'){ //该用户是经由世界杯活动注册的新用户
                            this.$router.push({
                                path:'/makePwd',
                                query:{
                                    from:'register'
                                }
                            })
                        }else if(path=='ranking'){
                            this.$router.push({
                                path:'/makePwd',
                                query:{
                                    from:'ranking'
                                }
                            })
                        }else{
                             this.$router.push({path:'/makePwd'})
                        }
                    }else if(reObj.code=='-1004'){
                            Toast({
                                message: reObj.message,
                                position: 'bottom',
                                duration: 3000
                            });
                            this.errTimes++;//验证码错误次数加1
                            if(this.errTimes>=3){
                                this.resetPicCaptcha();
                            }
                    }else if(reObj.code=='-1006'){ //手机号格式错误
                            Toast({
                                message: reObj.message,
                                position: 'bottom',
                                duration: 3000
                            });

                    }else if(reObj.code=='100'){
                        localStorage.setItem('needRender',true)  //依据此变量判断生金需不需要初始化数据
                        //登录成功后获取用户基本概况
                        this.userInforma();
                        //登入成功后去获取进入登入页的上一页,再跳转回去(带上对应的参数)
                        this.RECORD_TOKEN(reObj.content)
                        //调用与app交互的传userid方法
                        window.sendUserId(reObj.content.userId,reObj.content.token);//给APP传userId和token
                        var path="", id="";
                        if(this.$route.query.redirect){
                            path=this.$route.query.redirect
                        }
                        if(this.$route.query.from){
                            path=this.$route.query.from
                        }
                        if(this.$route.query.id){
                            id=this.$route.query.id
                        }
                        var authorization=res.content.userId+'_'+res.content.token
                        if(path==this.lotteryUrl){
                            window.location.href = this.lotteryUrl + '/#/lottery?authorization='+authorization
                            return
                        }
                        if(path!='' && id==''){
                            this.$router.replace({
                                path:path
                            })
                            return;
                        }
                        if(path!='' && id!=''){
                            this.$router.replace({
                                path:path,
                                query: {
                                    id: id
                                }
                            })
                            return
                        }
                        window.toApp();
                        this.$router.push('/buyGold');
                    }else{
                        Toast({
                            message: reObj.message,
                            position: 'bottom',
                            duration: 3000
                        });
                    }
                }else{  //密码登录
                    var regPwd=/^[0-9a-zA-Z]{6,20}$/;
                    if(this.rightShow_2!=1){
                        this.accWrong=true;
                        return;
                    }
                    if(!regPwd.test(this.password)){
                        this.pwdWrong=true;
                        return;
                    }
                    const res=await login(this.account,this.password)
                    if(res.code==100){
                        localStorage.setItem('needRender',true)  //依据此变量判断生金需不需要初始化数据
                        //登录成功后获取用户基本概况
                        this.userInforma();
                        //登入成功后去获取进入登入页的上一页,再跳转回去(带上对应的参数)
                        this.RECORD_TOKEN(res.content)
                        //调用与app交互的传userid方法
                        window.sendUserId(res.content.userId,res.content.token);//给APP传userId和token
                        var path="",id="";
                        if(this.$route.query.redirect){
                            path=this.$route.query.redirect
                        }
                        if(this.$route.query.from){
                            path=this.$route.query.from
                        }
                        if(this.$route.query.id){
                            id=this.$route.query.id
                        }
                        var authorization=res.content.userId+'_'+res.content.token
                        if(path==this.lotteryUrl){
                            window.location.href = this.lotteryUrl + '/#/lottery?authorization='+authorization
                            return
                        }
                        if(path!=''&&id==''){
                            this.$router.replace({
                                path:path
                            })
                            return;
                        }else if(path!=''&&id!=''){
                            this.$router.replace({
                                path:path,
                                query: {
                                    id: id
                                }
                            })
                            return
                        }else{
                            window.toApp();
                            this.$router.push('/buyGold');
                        }
                    }else{
                        Toast({
                            message: res.message,
                            position: 'bottom',
                            duration: 3000
                        });
                        this.errTimes++;//验证码错误次数加1
                        if(this.errTimes>=3){
                            this.resetPicCaptcha();
                        }

                    }
                }
            },
            startInput(){
                this.numWrong=false;  //输入手机号时手机号错误提示窗消失
            },
            iptCode($event){  //控制是否可输入验证码
                this.codeWrong=false;
            },
            //获取短信验证码
            async getCode(){
                this.code=''
                if(this.errTimes>=3){
                    this.resetPicCaptcha();
                    return;
                }
                var send_smscode = this.$refs.send_smscode;
                if(send_smscode.innerHTML != '获取验证码') return;
                //获取验证码之前先验证手机号格式是否正确
                if(!this.rightShow_1){
                    this.numWrong=true;
                    return;
                }
                var that=this;
                if(this.iNow==true){
                    this.iNow = false;
                    let timer = setInterval(function(){
                        send_smscode.style.color="#666";
                        that.second--;
                        send_smscode.innerHTML = that.second+'s';
                        if(that.second==-1){
                            clearInterval(timer);
                            that.iNow=true;
                            send_smscode.style.color="#eda835";
                            send_smscode.innerHTML = '获取验证码';
                            that.second = 60;
                        }
                    },1000)
                    const res=await sendSms(this.num);
                }
            },
            //获取用户基本概况
            async userInforma(){
                const res = await queryMyProfil()
                if(res.code==100){
                    this.RECORD_USERINFO(res.content)
                }
            },
            clear(){   //清除输入框
                this.num='';
            },
            inputAcc(){   //账号登入输入时手机号格式错误提示窗消失
                 this.accWrong=false;
            },
            startPwd(){
                 this.pwdWrong=false;
            },
            clearAccIpt(){  //清除输入框
                this.account='';
            },
            toggleClose(){
                this.close=false;
            },
            toggleOpen(){
                this.close=true;
            }
        },

	}
</script>

<style scoped>
    input{
        caret-color: #333333;
    }
    .head-top img{
        width:.36rem;
        height:.36rem;
        position: absolute;
        left:.28rem;
        top:.28rem;
    }
    .logoPart{
        height:2.56rem;
        padding-top:.5rem;
        margin-top:.88rem;
        text-align: center;
    }
    .logoPart img{
        width:1rem;
    }
    .loginPart{
        height:5.76rem;
    }
    .loginPart .tabPart{
        height:.55rem;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
        display: flex;
        -webkit-justify-content:center;
        -moz-justify-content:center;
        -o-justify-content:center;
        justify-content: center;
        font-size:.3rem;
        color:#333333;
    }
    .actived{
        color:#EDA835;
    }
    .tabPart .fastLogin, .tabPart .pwdLogin{
        position: relative;
    }
    .tabPart .activedBar{
        width:.44rem;
        height:.04rem;
        position: absolute;
        background-color: #EDA835;
        bottom: 0;
        left:50%;
        margin-left: -.22rem;
    }
    .loginContent{
        padding-top:.54rem;
        padding-left:.3rem;
        padding-right:.28rem;
    }
    .telephone,.identify{
        position: relative;
    }
    .clear{
        position: absolute;
        width:.36rem;
        height:.36rem;
        top:0.4rem;
        right:1.8rem;
    }
    .right{
        position: absolute;
        width: .36rem;
        top: 0.4rem;
        right: 2.4rem;
    }
    .accIpt{
        right:0.2rem;
    }
    .wrongNumber,.wrongIdenCode,.wrongAcc,.wrongPwd{
        height:.3rem;
        line-height: .3rem;
        color:red;
        font-size:.24rem;
        position: absolute;
        left: 0.22rem;
        bottom:0;
    }
    .telephone,.identify,.account,.password{
        height:1.1rem;
        border-bottom: 1px solid #EFEFEF;
        line-height:1.1rem;
        position: relative;
    }
    .telephone{
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .telephone #inputTel{
        flex:2.5;
        -webkit-flex:2.5;
        -moz-flex:2.5;
        -o-flex:2.5;
    }
    .telephone .getIdenCode{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
        text-align: center;
        color:#EDA835;
        font-size:.26rem;
    }
    .telephone #inputTel,.identify #identifyCode,.account #inputAcc,.password #inputPwd{
        border:none;
        font-size:.3rem;
        color:#333333;
        outline-style: none;
        padding-left:.22rem;
    }
    #inputPwd.visibleYN{
        background-color: transparent;
        color:transparent;
    }
    .hotTip{
        margin-top:.48rem;
        font-size:.22rem;
        color:#999999;
        padding-left:.2rem;
    }
.login{
    width:92.4%;
    margin:0 auto;
    border-radius: 5px;
}
.mint-button{
    width:100%;
    height:0.9rem;
    line-height:0.9rem;
    font-size:.36rem;
    text-align: center;
}
.mint-button--normal{
    width:100%;
}
.hasActived{
    background-color: #F2B643;
    color:#fff;
}
.hasActived:link{
    background-color: #F2B643;
}
.hasActived:hover{
    background-color: #F2B643;
 }
.hasActived:active{
    background-color: #eda835;
 }
.hasActived:visited{
    background-color: #F2B643;
}
.noActived{
    background-color: #f2b643;
    opacity: .5;
    color:#FEFCF9;
}
.visible{
    position: absolute;
    right:0.2rem;
}
.forgetPwd{
    margin-top:.3rem;
    text-align: right;
    padding-right:0.2rem;
    color:#EDA835;
    font-size:.28rem;
}
.floatLayer{
    width:100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
    z-index:300;
    background-color: rgba(0,0,0,.5);
}
.pictureCode{
    width:4.94rem;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left:50%;
    z-index:400;
    margin-left:-2.47rem;
    top:3.52rem;
    padding-top:.4rem;
}
.pictureCode h3{
    font-size:.32rem;
    text-align:center;
}
.picPart{
    position: relative;
    margin-top:.86rem;
    padding-left:.3rem;
    padding-right:.33rem;
}
.mainContent .iptPic{
    width:2.26rem;
    height:.6rem;
    font-size:.5rem;
    color:#F1BE68;
    border:none;
    outline-style: none;
}
.mainContent{
    padding-bottom:.26rem;
    border-bottom: 1px solid #EEEEEE;
}
.replace{
    position: absolute;
    width:.36rem;
    height:.36rem;
    top:.12rem;
    right:0.33rem;
}
.btn{
    margin-top:.42rem;
    border-top:1px solid #EEEEEE;
}
.btn .cancel,.btn .ok{
    display: inline-block;
    height:.9rem;
    width:48%;
    text-align: center;
    line-height: .9rem;
    font-size:.3rem;
    color:#F1BE68;
}
.btn .cancel{
    border-right: 1px solid #EEEEEE;
}
.picCode{
    width:1.5rem;
    height:.6rem;
    vertical-align: bottom;
    margin-left:-.1rem;
}
.weixin_login{
    margin-top:1rem;
    text-align:center;
}
.weixin_text{
    font-size:.24rem;
    color:#999999;
    position:relative;
}
.weixin_text:before,.weixin_text:after{
    width:2.2rem;
    content:'';
    position:absolute;
    border-top:1px solid #EEEEEE;
    top:50%;
    transform:translate(0,-50%);
}
.weixin_text:before{
    left:.4rem;
}
.weixin_text:after{
    right:.4rem;
}
.weixin_img{
    width:.44rem;
    margin-top:.5rem;
}
</style>
