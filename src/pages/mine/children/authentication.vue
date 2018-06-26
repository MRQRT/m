<template>
	<div class="authentication">
		<head-top headTitle='实名认证'>
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<mt-field label="" placeholder="请输入您的真实姓名" v-model="username" style="margin-top: .8rem; padding-right: .3rem;padding-left: .1rem; font-size: .3rem;"></mt-field>
		<mt-field label="" placeholder="请输入身份证号" v-model="validIDcard" style="padding-right: .3rem;padding-left: .1rem; font-size: .3rem;" :state="state"></mt-field>
		<div class="next_step">
			<a :class="isNext?'allow':'noallow'" @click="confirm">确定</a>
		</div>
		<transition name="fade">
			<router-view></router-view>
		</transition>
	</div>
</template>
<script type="text/javascript">
	import headTop from '@/components/header/head'
	import {Field, Toast } from 'mint-ui'
	import { realNameAuth,queryBankCard } from '@/service/getData.js'

	export default{
		data(){
			return{
				 isNext: 0,
		       username: '',
		    validIDcard: '',
		          state: '',
		     noBankShow: null,//检查用户是否有银行卡 true:没有 false:有

			}
		},
		mounted(){
			this.queryBankCard()
		},
		watch: {
			//验证身份证号码是否正确
			validIDcard: function(){
				let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
				this.validIDcard!=''?this.clear2=1:this.clear2=0
				if(this.validIDcard.match(reg) && this.validIDcard!=''){
					this.state = 'success'
				}else if(this.validIDcard==''){
					this.state = ''				
				}else{
					this.state = 'warning'
				}
			},
			username: function(value){
				return value!='' && this.state=='success'?this.isNext=1:this.isNext=0;
			},
			state: function(value){
				return value=="success" && this.username!=''?this.isNext=1:this.isNext=0;
			}
		},
		methods: {
			//获取用户银行卡
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                    if(res.content.length==0){
                        this.noBankShow = true//没有银行卡
                    }else{
                        this.noBankShow = false//有银行卡
                    }
                }
            },
			async confirm(){
				if(this.isNext==1){
					const res = await realNameAuth(this.username, this.validIDcard);
					if(res.code==100){
						Toast({
							message: '实名认证成功',
							position: 'middle',
							duration: 2500
						});
						if(this.$route.query.paths!=''&&this.noBankShow==true){//没有银行卡
							this.$router.replace({
								path:'/personHomepage/bindBank',
								query: {
									paths: this.$route.query.paths
								}
							})
						}else if(this.noBankShow==true){//没有银行卡
							this.$router.replace('/personHomepage/bindBank')
						}else{
							this.$router.replace('/mine')
						}
					}else{
						Toast({
							message: res.message,
							position: 'middle',
							duration: 5000
						});
					}
				}
			},
			//返回上一页
			goBack(){
				window.toApp()
				if(this.$route.query && this.$route.query.paths=='/modifiRecycleOrder'){
					this.$router.push({
						path:'/modifiRecycleOrder',
						query:{
							from:3
						}
					})
				}else{
					this.$router.back(-1)
				}
			}	
		},
		components: {
			headTop: headTop
		}
	}
</script>
<style type="text/css">
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.authentication{
	position: absolute;
	width: 100%;
	top: 0;
	background-color: #f5f5f5;
	height: 12.94rem;
	z-index: 11;
}
.authentication>.input{
	width: 100%;
	height: 1.1rem;
	background-color: #fff;
	padding: 0 .3rem 0 .3rem;
}
.authentication>.input>section{
	width: 100%;
	height: 1.1rem;
	border-bottom: 1px solid #eeeeee;
	position: relative;
}
.authentication>.input>section>input{
	width: 100%;
	height: .5rem;
	font-size: .28rem;
	color: #000;
	margin-top: .3rem;
	border: none;
	outline: medium;
}
.authentication>.input>section>img{
	width: .33rem;
	height: .33rem;
	position: absolute;
	right: 0;
	top: .37rem;
}
.authentication>.next_step{
	width: 100%;
	height: .88rem;
	padding: 0 .3rem 0 .3rem;
	margin-top: 1.5rem;
}
.authentication>.next_step>a{
	display: inline-block;
	width: 100%;
	height: .88rem;
	line-height: .88rem;
	text-align: center;
	color: #fff;
	font-size: .33rem;
	border-radius: .07rem;
}
.allow{
	background-color: #f2b643;
	color: green;
}
.allow:active{
	background-color: #eda835;
}
.noallow{
	background-color: #f3d59c;
}
</style>