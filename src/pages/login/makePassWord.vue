<template>
	<div class="makePassword">
		<head-top class="head-top" id="head_top" headTitle='设置登录密码'>
			<img slot='head_goback' class="head_goback" src='../../images/back.png' @click="$router.back(-1)">
            <span slot="custom" class="custom"  @click="toHome">跳过</span>
        </head-top>
        <!--温馨提示区-->
        <p class="orangeTip"><img src="../../images/yellowGTH.png">设置密码后,您就可以使用手机号+密码登录</p>
        
        <!--设置密码区-->
        <section class="makePwd">
            <div class="core">
                <input type="password" v-if="close" class="makePwdPart" placeholder="请输入密码(6-20位数字、字母或组合)"  v-model="pwd" maxlength="20">
                <input v-else type="text"   placeholder="请输入密码(6-20位数字、字母或组合)" class="makePwdPart" v-model="pwd" maxlength="20">
                
                <span class="visible" v-show="close" @click="toggleClose"><img src="../../images/close.png" style="width:.36rem;height:.15rem;"></span>
                <span class="visible" v-show="!close" @click="toggleOpen"><img src="../../images/open.png" style="width:.36rem;height:.22rem;"></span>
            </div>
        </section>

        <section class="confirmBtn" @click="checkPwd">确定</section>
    </div>
</template>

<script>
	import headTop from '../../components/header/head.vue'
    import { addPwd } from '@/service/getData.js'
    import { Toast } from 'mint-ui'
	export default {
		data(){
			return {
                close:true,//默认密码不可见
                pwd:''
			}
		},
		methods:{
			toggleClose(){
                this.close=false;
            },
            toggleOpen(){
                this.close=true;
            },
            async checkPwd(){
                var regExp=/^[0-9a-zA-Z]{6,20}$/;
                var val=this.pwd;
                if(!regExp.test(val)){
                    Toast({
                        message: '密码格式错误',
                        position: 'bottom',
                        duration: 3000
                    });
                }else{
                    let makePwdRes = await addPwd(this.pwd)
                    if(makePwdRes.code==100){
                        Toast({
                            message: '设置成功',
                            position: 'bottom',
                            duration: 1800
                        });
                        var that=this;
                        if(this.$route.query.from=='register'){ //该用户是经由世界杯活动注册的新用户
                            setTimeout(function(){
                                that.$router.replace('register')
                            },2200)
                            return
                        }
                        if(this.$route.query.from=='ranking'){ //该用户是经由世界杯活动注册的新用户
                            setTimeout(function(){
                                that.$router.replace('ranking')
                            },2200)
                            return
                        }
                        window.toApp();//回APP
                        this.$router.push({path:'/buyGold'})
                    }else{
                        Toast({
                            message: makePwdRes.message,
                            position: 'bottom',
                            duration: 3000
                        });
                    }
                }
            },
            toHome(){
                if(this.$route.query.from=='register'){ //该用户是经由世界杯活动注册的新用户
                    this.$router.replace('register')
                    return
                }
                if(this.$route.query.from=='ranking'){ //该用户是经由世界杯活动注册的新用户
                    this.$router.replace('ranking')
                    return
                }
                window.toApp()
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    #head_top{
        border-bottom: none;
    }
    .custom{
        font-size:.28rem;
        color:#707070;
    }
    .orangeTip{
        margin-top:.88rem;
        height:.62rem;
        line-height:.62rem;
        color:#EDAA3C;
        font-size:.26rem;
        padding-left:.3rem;
        background-color: #FEF8EC;
    }
    .orangeTip img{
        width:.24rem;
        height:.24rem;
        margin-right:.12rem;
    }
    .makePwd{
        margin-top:.56rem;
        height:1.08rem;
        line-height:1.08rem; 
        padding-left:.3rem;
        padding-right:.3rem;
    }
    .core{
        border-bottom: 1px solid #EFEFEF;
        position: relative;
    }
    .makePwdPart{
        border:none;
        width:6.12rem;
        font-size:.28rem;
        color:#999999;
        outline-style: none;
        padding-left:.22rem;
    }
    .confirmBtn{
        width:6.93rem;
        height:0.9rem;
        line-height:0.9rem;
        background-color: #F2B643;
        font-size:.36rem;
        color:#fff;
        text-align: center;
        margin:0 auto;
        border-radius: 5px;
        margin-top:5.8rem;
    }
    .visible{
        position: absolute;
        right:0.2rem;
    }
</style>