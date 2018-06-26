<template>
	<div class="loginIn">
		<head-top class="head-top" id="head_top" headTitle='找回密码'>
			<img slot='head_goback' class="head_goback" src='../../images/back.png' @click="$router.back(-1)">
        </head-top>
        <!--设置密码区-->
        <section class="backPwd">
            <div class="tele">
                <input type="number" id="iptTel" placeholder="请输入手机号" v-model="tel" pattern="[0-9]*" @focus="telWrong=false;" maxlength="11">
                <span class="getIdenCode" @click="identifyTele" ref="send_smscode" style="font-size:.26rem;">获取验证码</span>
                <span class="wrongTel" ref="wrongTel" v-show="telWrong">手机号格式错误</span>
                <!-- <img src="../../images/right.png" class="right" v-show="rightShow" style="position: absolute; width: .36rem; top: 0.35rem; right: 1.8rem;"> -->
            </div>
            <div class="idenCode">
                <input type="number" id="iptCode" ref="iptCode" placeholder="请输入验证码" v-model="code" style="width:100%;">
                <span class="wrongCode" ref="wrongCode" v-show="codeWrong">验证码格式错误</span>
            </div>
            <div class="newPwd">
                
                <input type="password" v-if="close" id="iptPwd" placeholder="请设置密码(6-20位数字、字母或组合)"  v-model="pwd"  ref="iptPwd" maxlength="20">
                <input v-else type="text"   placeholder="请设置密码(6-20位数字、字母或组合)" id="iptPwd" v-model="pwd"  ref="iptPwd" maxlength="20">
                <span class="visible" v-show="close" @click="toggleOpen"><img src="../../images/close.png" style="width:.36rem;height:.15rem;"></span>
                <span class="visible" v-show="open" @click="toggleClose"><img src="../../images/open.png" style="width:.36rem;height:.22rem;"></span>
            </div>
        </section>

        <a class="confirmBtn" :class="{'noActived':dark,'hasActived':highLight}" @click="confirm">确定</a>

        <!--遮罩层-->
        <section class="floatLayer" v-show="picCodeVisible"></section>

        <!--图片验证码-->
        <section class="pictureCode" v-show="picCodeVisible">
          <h3>输入图片验证码</h3>

          <section class="picPart">
           <div class="mainContent">
             <input type="text" class="iptPic" v-model="pic">
             <img :src="openAPI"  class="picCode">
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
  import headTop from '../../components/header/head.vue';
  import { Toast } from 'mint-ui';
  import { mapMutations } from 'vuex'
  import {sendSms,checkSms,picCheck,updatePwd,login} from '@/service/getData.js'
  import { openAPI } from '@/config/mUtils.js'
	export default {
		data(){
			return {
                 openAPI: openAPI()+'/v3/member/captcha',
                     tel: '', 
                    code: '', 
                     pwd: '',
                    dark: true,
               highLight: false,
                   close: true,
                    open: false ,
                telWrong: false,
               codeWrong: false,//将图片验证码初始值设置为
               telAccess: 1,
          picCodeVisible: 0,
                errTimes: 0,
                     pic: '',//图片验证码区域
                    iNow: true,//解决重复点击问题
                  second: 60,//获取验证码的毫秒数	
               rightShow: 0,//手机号验证正确图标显示开关
		    }
		},
		mounted() {
			
		},
        watch:{
            tel(value){
                let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0134678]|18[0-9]|14[57])[0-9]{8}$/;
                if(value.length>11){
                    this.tel = value.slice(0,11)
                }
                if(value.match(reg)){
                    this.rightShow = 1
                }else{
                    this.rightShow = 0
                }
                if(this.rightShow&&this.pwd.length>=6&&this.code.length==6){
                    this.dark=false
                    this.highLight=true
                }else{
                    this.dark=true
                    this.highLight=false
                }
            },
            code(value){
                if(this.code.length>6){
                    this.code=this.code.slice(0,6)
                }
                if(value.length==6&&this.rightShow&&this.pwd.length>=6){
                    this.dark=false
                    this.highLight=true
                }else{
                    this.dark=true
                    this.highLight=false
                }
            },
            pwd(value){
                if(value.length>=6&&this.rightShow&&this.code.length==6){
                    this.dark=false
                    this.highLight=true
                }else{
                    this.dark=true
                    this.highLight=false
                }
            }
        },
		computed:{
			
		},
		methods:{
            ...mapMutations([
                'RECORD_TOKEN'
            ]),
			toggleOpen(){
                this.open=true;
                this.close=false;
            },
            toggleClose(){
                this.close=true;
                this.open=false;
            },
            myToast(message){
                Toast({
                    message: message,
                    position: 'bottom',
                    duration: 3000
                });
            },
            picCancel(){
                this.picCodeVisible=0;
                this.pic='';
            },
            async picConfirm(){
                this.picCodeVisible=0;
                var res=await picCheck(this.pic);
                if(res.code==100){
                    this.myToast('图片验证成功');
                    this.errTimes=0;
                }else{
                    this.myToast('图片验证失败');
                }
            },
            reloadCaptcha(){  //重新加载图片验证码
                document.querySelector('.picCode').src=this.openAPI+'?r='+Math.random()
            },
            resetPicCaptcha(){  //判断登入错误次数
                    this.picCodeVisible=1;//输入图片验证码区域出现
                    this.pic=''
                    this.reloadCaptcha()
            },
             //点击获取验证码符合条件开始倒计时
            async identifyTele(){ 
                if(this.errTimes>=3){
                    this.resetPicCaptcha();
                    return;
                }
                var send_smscode = this.$refs.send_smscode
                if(send_smscode.innerHTML != '获取验证码') return;
                if(!this.rightShow){
                    this.telWrong=true;
                    return;
                }
                let that = this
                let i = this.second;
                if(this.iNow==true){
                    that.iNow = false;
                    let timer = setInterval(function(){
                        send_smscode.style.color="#666"
                        i--;
                        send_smscode.innerHTML = i+'s';
                        if(i==-1){
                            clearInterval(timer);
                            that.iNow=true;
                            send_smscode.style.color="#eda835"
                            send_smscode.innerHTML = '获取验证码'
                            that.second = 60;
                        }
                    },1000)
                    const res=await sendSms(this.tel);
                }
            },
            async confirm(){
                if(this.dark==true){
                    return;
                }
                if(this.errTimes>=3){
                    this.resetPicCaptcha();
                    return;
                }
                var regCode=/\d{6}/;
                var regPwd=/^[0-9a-zA-Z]{6,20}$/;
                if(!regCode.test(this.code)){
                    this.codeWrong=true;
                    return;  //验证码基础校验
                }   
                if(!regPwd.test(this.pwd)){
                    this.myToast('密码格式错误');  //密码基础校验
                    return;
                }
                var res=await checkSms(this.tel,this.code)//手机验证码校验，根据返回状态码去判断验证码是否错误，错误则toast提示
                if(res.code!=100){
                    this.myToast('验证码错误');
                    this.errTimes++;
                    if(this.errTimes>=3){
                        this.resetPicCaptcha();
                    }
                }else{
                    var res=await updatePwd(this.tel,this.pwd,this.code);
                    if(res.code==100){
                        this.errTimes=0;
                        // this.myToast('密码重设成功')
                        // 密码找回成功则跳登入
                        this.login(this.tel,this.pwd)
                    }else{
                        this.myToast(res.message);
                    }
                }
            },
            async login(tel,pwd){
                var result=await login(tel,pwd);
                if(result.code==100){
                    this.RECORD_TOKEN(result.content)
                    //调用与app交互的传userid方法
                    sendUserId(result.content.userId);
                    window.toApp();//回app
                    this.$router.push({path:'/buyGold'})
                }else{
                    this.myToast(result.message);
                }
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .backPwd{
        margin-top:.88rem;
        height:8.1rem;
        padding-top:.54rem;
        padding-left:.3rem;
        padding-right:.28rem;
    }
    .tele,.idenCode,.newPwd{
        height:1.1rem;
        border-bottom: 1px solid #EFEFEF;
        line-height:1.1rem;
    }
    .tele,.newPwd,.idenCode{
        position: relative;
    }
    .tele{
        display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .tele #iptTel{
        flex:2.5;
        -webkit-flex:2.5;
        -moz-flex:2.5;
        -o-flex:2.5;
    }
    .tele .getIdenCode{
        flex:1;
        -webkit-flex:1;
        -moz-flex:1;
        -o-flex:1;
        color:#EDA835;
        text-align: center;
    }
    .tele #iptTel,.idenCode #iptCode,.newPwd #iptPwd{
        border:none;
        font-size:.3rem;
        color:#999999;
        outline-style: none;
        width:5.5rem;
        padding-left:.22rem;
    }
    .confirmBtn{
        width:6.93rem;
        height:0.9rem;
        line-height:0.9rem;
        font-size:.36rem;
        text-align: center;
        margin:0 auto;
        border-radius: 5px;
        display: block;
    }
    .visible{
        position: absolute;
        right:0.2rem;
    }
    .hasActived{
        background-color: #F2B643;
        color: #fff;
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
        background-color: #F8DAA1;
        color:#FEFCF9;
    }
    .wrongTel,.wrongCode{
        height:.3rem;
        line-height: .3rem;
        color:red;
        font-size:.24rem;
        position: absolute;
        left: 0.22rem;
        bottom:0;
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
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -o-border-radius: 10px;
        position: absolute;
        left:50%;
        z-index:400;
        margin-left:-2.47rem;
        top:1.52rem;
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
</style>