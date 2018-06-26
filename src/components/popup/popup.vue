<template>
	<div class="popup_bottom">
		<section v-if="first">
			<div class="tanHead">
				<img :src="blackClose" v-on:click="close">
				<p>输入短信验证码</p>
			</div>
			<p class="fasongtishi"><span>已发送至手机号187****2550，</span><span @click="question">收不到验证码？</span></p>
			<div class="shuru">
				<input type="" name="" placeholder="请输入短信验证码" pattern="[0-9]*" maxlength="6" v-model="yanzhengma">
				<span class="getVerif" @click="getVerif" ref="send_smscode">获取验证码</span>
				<span class="biankuang"></span>
			</div>
			<div class="queren">
				<span ref="confirm_button">确认支付</span>
			</div>
		</section>
		<section v-else>
			<img :src="blackClose" @click="close_second" style="position:absolute;top: .3rem; width:.28rem;margin-left: .25rem;">
			<div class="tanHead" style="margin-top:1.1rem;height: 1.5rem;">
				<p>收不到验证码</p>
				<p style="padding: 0 .8rem;"><span style="display:inline-block; width:100%" class="biankuang"></span></p>
			</div>
			<p class="answer">1.请检查短信是否被手机安全中心拦截；</p>
			<p class="answer">2.如银行预留手机号已变更，请重新绑定；</p>
			<p class="answer">3.获取更多帮助，请拨打客服电话</p>
			<p class="answer answer2">400-650-6932</p>
		</section>
	</div>
</template>
<script type="text/javascript">
import	blackClose from '@/images/blackClose.png'
import { sendSms } from '@/service/getData.js'
import { mapState } from 'vuex'

export	default{
		data(){
			return {
			 blackClose: blackClose,
			 	   iNow: true,//状态变量,解决重复点击问题
			     second: 60,
			      timer: '',//定时器
			 yanzhengma: '',
			querenyanse: false,
			      first: true,
			     telNum: null

			}
		},
		props: ['popupData'],
		mounted(){
			this.telNum = this.userInfo.userName
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		watch: {
			yanzhengma(value){
				if(value.length==6){
					this.$refs.confirm_button.style.backgroundColor="#eda835"
					this.querenyanse=true
				}else{
					this.$refs.confirm_button.style.backgroundColor="#f8daa1"
					this.querenyanse=false
				}
			},
			popupData(value){
				value?this.getVerif():''
			}
		},
		methods:{
            //确认充值
            confirm(){
            	if(this.is){
            		this.popupVisible=true
            		this.getVerif()
            	}
            },
            //关闭弹出框
            close(){
            	this.$emit('closePopup')
            },
            //获取验证码
            async getVerif(){
            	let that=this
                let send_smscode=this.$refs.send_smscode
                let i = this.second

                if( that.iNow==true && this.second==60){
                    that.iNow = false
                    const res = await sendSms(that.telNum)
                    that.timer = setInterval(function(){
                        send_smscode.style.color="#666"
                        i--
                        send_smscode.innerHTML = i+'S'
                        if(i==-1){
                            clearInterval(that.timer)
                            that.iNow=true
                            send_smscode.style.color="#eda835"
                            send_smscode.innerHTML = '获取验证码'
                            this.second = 60;
                        }
                    },1000)
				}
            },
            //收不到和验证码弹框
            question(){
            	this.first=false
            	this.iNow=true
            },
            //关闭问题窗口
            close_second(){
            	this.first=true
            }

		},
	}
</script>
<style type="text/css" scoped>
/*短信弹框*/
.tanHead{
	width: 100%;
	height: .75rem;
	color: #000;
	font-size: .3rem;
	padding: .25rem 0 0 0;
}
.tanHead>img{
	position: absolute;
	width: .28rem;
	margin-left: .25rem;
}
.tanHead>p{
	height: .5rem;
	line-height: .5rem;
	text-align: center;
}
.fasongtishi{
	width: 100%;
	height: .5rem;
	line-height: .5rem;
	font-size: .23rem;
	padding-left: .3rem; 
}
.fasongtishi>span:first-child{
	color: #999999;
}
.fasongtishi>span:nth-child(2){
	color: #eda835;
}
.shuru{
	width: 100%;
	height: 1rem;
	line-height: 1rem;
	padding-left: .3rem;
	padding-right: .3rem;
}
.shuru>input{
	border: none;
	width: 65%;
	height: .35rem;
	line-height: .38rem;
	outline:medium;
	font-size: .3rem;
}
.shuru>.getVerif{
	display: inline-block;
	font-size: .28rem;
	float: right;
	color: #eda835;
	line-height: .4rem;
	margin-top: .3rem;
	margin-right: .28rem;
}
.biankuang{
	width: 100px;
}
.queren{
	margin-top: .4rem;
	width: 100%;
	height: .9rem;
	text-align: center;
	margin-bottom: .4rem;
}
.queren>span{
	display: inline-block;
	width: 90%;
	height: .9rem;
	line-height: .9rem;
	color: #fff;
	background-color: #f8daa1;
	border-radius: .05rem;
}
.answer{
	padding-left: .8rem;
	font-size: .25rem;
	color: #292929;
	height: .4rem;
	line-height: .4rem;
}
.answer2{
	height: .6rem;
	padding-left: 1rem;
	line-height: .6rem;
	font-size: .4rem;
	color: #000;
	font-weight: bold;
	margin-bottom: 2rem;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.biankuang:before{
		content: '';
		display: inline-block;
		width: 90%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		float: left;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)(-o-min-device-pixel-ratio:1.5){
	.biankuang:before{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		float: left;
	}
}
</style>