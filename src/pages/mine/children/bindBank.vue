<template>
	<div class="bindBank">
		<head-top headTitle='添加银行卡'>
			<img slot='head_goback' src='../../../images/back.png' class="head_goback" @click="togo">
		</head-top>
		<div class='input' style="margin-top: .88rem;">
			<section style="position: relative;">
				<input type="text" name="bankNum" placeholder="请输入有效的银行卡号" maxlength="19" v-model="bankNum" pattern="[0-9]*" @input="redSec()" ref="bankNum_input" v-on:blur="check(bankNum)">
				<img :src="delImg" v-show="clear1" @click="del('b')">
			</section>
		</div>
		<div class="bCardType" style="color: red" v-show="tipShow"><span>{{tip}}</span></div>
		<div class="bCardType" style="color: green" v-show="bankTYPEshow"><span>{{cardType}}/</span><span>{{bankName}}</span></div>
		<!-- 信用卡卡验证码输入框 -->
		<div class='input' v-show="creditCard">
			<section>
				<input type="text" name="cvvCode" placeholder="卡验证码（卡背面末三位数字）" style="width: 65%; float: left;" pattern="[0-9]*" v-model="cvvCode" maxlength="3">
			</section>
		</div>
		<!-- 信用卡有效期输入框 -->
		<div class='input' v-show="creditCard">
			<section>
				<input type="text" name="expirDate" placeholder="月/年（有效期）" style="width: 65%; float: left;" readonly="readonly" @click="pickerShow" v-model="pickerValue2">
			</section>
		</div>
		<div class='input'>
			<section>
				<input type="text" name="telNum" placeholder="请输入银行预留手机号" style="width: 65%; float: left;" pattern="[0-9]*" maxlength="11" v-model="telNum">
				<span class="getVerif" @click="getVerif" ref="send_smscode">获取验证码</span>
				<!-- <img :src="delImg" style="margin-right: .2rem" v-show="clear2" @click="del('p')"> -->
				<!-- <img :src="right" style="float: right; margin-right: .1rem;" v-show="rightShow"> -->
			</section>
		</div>
		<div class='input'>
			<section>
				<input type="text" name="verifiCode" placeholder="请输入验证码" v-model="validNum" pattern="[0-9]*">
				<img :src="delImg" v-show="clear3" @click="del('v')">
			</section>
		</div>
		<div class="submit">
			<section :class="has&&support?'noStor':'isStor'" @click="stor">保存</section>
		</div>
		<!-- 信用卡有效期选取框 -->
		<mt-popup v-model="popupVisible" position="bottom">
			<mt-picker :slots="slots" @change="onValuesChange" v-if="isShow"></mt-picker>
		</mt-popup>
	</div>
</template>
<script type="text/javascript">
	import	headTop from '@/components/header/head'
	import {formatBankNo} from '@/config/mUtils'
	import	delImg from '@/images/delImg.png'
	import	right from '@/images/right.png'
	import { Toast, MessageBox, Picker, Popup } from 'mint-ui'
	import { boundBankCard,sendSms,bankCardBin } from '@/service/getData.js'
	import { clearNoNum,formatDate } from '@/config/mUtils.js'
	export default{
		data(){
			return{
				bankNum: "",//银行卡号
				 telNum: '',//手机号
        	   validNum: '',//验证码
          		 delImg: delImg,
           		  right: right,//手机号输入正确后的提示icon
          		 clear1: 0,
			     // clear2: 0,
           		 clear3: 0,
        	  rightShow: 0,
			       iNow: true,//状态变量,解决重复点击问题
			     second: 60,
			        has: 0,//保存按钮高亮开关
			      timer: '',//定时器
			        tip: null,//银行卡提示
			    tipShow: false,
		   bankTYPEshow: false,//银行卡类型控制显示与否
		       cardType: null,//卡类型
			   bankName: null,//银行名称
			  expirDate: null,//有效期
			 expiryYear: null,//信用卡有效期年
		    expiryMonth: null,//信用卡有效期月
		        cvvCode: '',//信用卡的cvvCode(卡检验码)
		     creditCard: false,//是否是信用卡，true是信用卡，false不是信用卡
		    pickerValue: null,//信用卡有效期选取框的值
		   pickerValue2: '',//经过格式化的值
		   popupVisible: false,
		         isShow: false,//是否
            support: false,//银行是否支持
		          slots: [//信用卡有效期选取框配置
        			{
          				flex: 1,
          			  values: ['01', '02', '03', '04', '05', '06','07','08','09','10','11','12'],
                   className: 'slot1',
                   textAlign: 'right'
                    }, {
                     divider: true,
                     content: '/',
                   className: 'slot2'
                    }, {
                        flex: 1,
                      values: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027','2028','2029','2030','2031','2032', '2033', '2034', '2035', '2036', '2037','2038','2039','2040'],
                   className: 'slot3',
                   textAlign: 'left'
                   }
                ]

			}
		},
		watch: {
			telNum: function(value){
				let reg = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{8}$/;
				// this.telNum!=''?this.clear2=1:this.clear2=0
				if(this.telNum.match(reg)){
					this.rightShow = 1
				}else if(this.telNum ==''){
					this.rightShow = 0
				}else{
					this.rightShow = 0
				}
			},
			//银行卡号
			bankNum: function(val){
				if(this.bankNum!=''){
					this.clear1=1
				}else{
					this.clear1=0
					this.bankTYPEshow=false
				}
				if(val.length<19){
					this.bankTYPEshow=false
				}
			},
			//监听时间选取框的值，并将转换格式后的时间绑定到'取金时间'上
			pickerValue: function(){
				this.pickerValue2 = this.pickerValue
				this.expiryMonth = this.pickerValue.split('/')[0]
				this.expiryYear = this.pickerValue.split('/')[1]
			},
			//验证码
			validNum: function(){
				this.validNum!=''?this.clear3=1:this.clear3=0
				//判断银行卡类型是否正确显示，若正确显示，再判断是借记卡还是信用卡，
				if(this.bankTYPEshow){
					if(this.cardType=='信用卡' && this.creditCard){
						//验证码不为空，手机号正确，银行卡号不为空，cvvCode不为空，有效期不为空，
						if(this.validNum!='' && this.rightShow==1 && this.bankNum!='' && this.cvvCode!='' && this.pickerValue2!='' && this.cvvCode.length==3){
							this.has=1
						}else{
							this.has=0
						}
					}else if(this.cardType=='借记卡'){
						//验证码不为空，手机号正确，银行卡号不为空，
						if(this.validNum!='' && this.rightShow==1 && this.bankNum!=''){
							this.has=1
						}else{
							this.has=0
						}
					}
				}
			},
		},
		mounted(){
			
		},
		methods:{
			//返回跳转按钮
			togo(){
				window.toApp();
				if(this.$route.query.paths){//若带着地址参数，按原路返回
					if(this.$route.query.paths=='/modifiRecycleOrder'){
						this.$router.push({
							path:'/modifiRecycleOrder',
							query:{
								from:'bindBank'
							}
						})
						return
					}
					this.$router.replace(this.$route.query.paths)
				}else{
					this.$router.replace('/buyGold')
				}
			},
			//格式化银行卡号（暂时先去掉，后期优化）
			redSec: function(){
				// let num = 0;
  		// 		const str = this.bankNum;
  		// 		const elem = this.$refs.bankNum_input;
  		// 		if(str.length > num){
    //   				const c = str.replace(/\s/g,  "");
    //   				if(str != "" && c.length > 4 && c.length % 4 == 1){
    //     				this.bankNum = str.substring(0, str.length - 1)+ " " + str.substring(str.length - 1, str.length);
    //   				}
  		// 		}
  		// 		if(elem.setSelectionRange){//W3C
    //     			setTimeout(function(){
    //         			elem.setSelectionRange(elem.value.length,elem.value.length);
    //         			elem.focus()
    //     			},0);
    // 			}else if(elem.createTextRange){//IE
    //         		const textRange=elem.createTextRange()
    //         		textRange.moveStart("character",elem.value.length)
    //         		textRange.moveEnd("character",0)
    //         		textRange.select()
    // 			}
  		// 		num = str.length
			},
			//校验银行卡号
			check(value){
				const num = /^[a-z0-9\s]{16,19}$/
				if(num.test(value)){
					this.tipShow=0
					const formatBankN = this.bankNum.replace(/\s/g, "")
					this.checkBankCard(formatBankN)
				}else if(value.length!=''){
					this.tipShow=true
					this.bankTYPEshow=false
					this.tip='请输入正确的银行卡号'
				}else{
					this.tipShow=false
					this.bankTYPEshow=false
				}
			},
			//校验银行卡是借记卡还是信用卡
			async checkBankCard(value){
				const res = await bankCardBin(value)
				if(res.code==100){
				    //errcode=0表示支持该种银行
				    if(res.content.errcode==0){
              this.support=true
              this.bankName=res.content.bankName
              res.content.cardType==1?this.cardType='信用卡':this.cardType='借记卡'
              res.content.cardType==1?this.creditCard=true:this.creditCard=false
              this.bankTYPEshow=true
              //errcode=1表示不支持该种银行
            }else if(res.content.errcode==1){
              this.tip='暂不支持该银行卡'
              this.tipShow=true
              this.support=false
            }
				}else{
					this.bankTYPEshow=false
					this.tipShow=true
					this.tip=res.message
				}
			},
			//点击输入有效期选取框
			pickerShow(){
				this.popupVisible=true
				this.isShow=true
			},
			//有效期选取组件中选取值改变时触发的方法
			onValuesChange(picker, values) {
        this.pickerValue=values[0]+'/'+values[1]
      },
			//获取验证码
			async getVerif(){
				let that = this
        		let send_smscode = this.$refs.send_smscode
        		let i = this.second
        		//判断银行卡类型是否正确显示，若正确显示，再判断是借记卡还是信用卡，
				if(this.bankTYPEshow){
					if(this.cardType=='信用卡' && this.creditCard){
						//手机号正确，银行卡号不为空，cvvCode不为空，有效期不为空，秒为60，that.iNow为真
						if(this.rightShow==1 && this.bankNum!='' && this.cvvCode!='' &&this.cvvCode.length==3 && this.pickerValue2!='' && that.iNow==true && this.second==60){
							that.iNow = false
                    		const res=await sendSms(this.telNum)
                    		that.timer = setInterval(function(){
                        		send_smscode.style.color="#666"
                        		i--
                        		send_smscode.innerHTML = i+'s'
                        		if(i==-1){
                            		clearInterval(that.timer)
                            		that.iNow=true
                            		send_smscode.style.color="#eda835"
                            		send_smscode.innerHTML = '获取验证码'
                            		that.second = 60
                        		}
                    		},1000)
						}else{
							//卡验证码不为空
							if(this.cvvCode!='' && this.cvvCode.length==3){
								//卡有效期不为空
								if(this.pickerValue2!=''){
									//手机号不为空
									if(this.rightShow==1){

									}else{
										Toast("请输入正确的手机号")
									}
								}else{
									Toast("请输入银行卡有效期")
								}
							}else{
								Toast("请输入卡验证码")
							}
						}
					}else if(this.cardType=='借记卡'){
						//验证码不为空，手机号正确，银行卡号不为空，
						if(this.rightShow==1){
							if(this.iNow==true && this.second==60 && this.bankTYPEshow==1){
                    			that.iNow = false
                    			const res=await sendSms(this.telNum)
                    			that.timer = setInterval(function(){
                        			send_smscode.style.color="#666"
                        			i--
                        			send_smscode.innerHTML = i+'s'
                        			if(i==-1){
                            			clearInterval(that.timer)
                            			that.iNow=true
                            			send_smscode.style.color="#eda835"
                            			send_smscode.innerHTML = '获取验证码'
                            			this.second = 60
                        			}
                    			},1000)
							}
						}else if(this.bankNum == '' && this.rightShow==1){
							Toast("请先输入银行卡号")
						}else if(this.bankNum == '' && this.rightShow==0 && this.telNum!=''){
							Toast("请先输入银行卡号")
						}else if(this.bankNum=='' && this.telNum==''){
							Toast("请先输入银行卡号")
						}else if(this.bankNum!='' && this.telNum==''){
							Toast("请输入手机号")
						}else if(this.bankNum!='' && this.telNum!='' && this.rightShow!=1){
							Toast("请输入正确的手机号")
						}else{
							// console.log('其他情况')
						}
					}
				}
			},
			//删除按钮
			del: function(val){
				if(val=='b'){
					this.bankNum = ''
				}else if(val=='p'){
					this.telNum = ''
				}else if(val=='v'){
					this.validNum = ''
				}
			},
			//绑定银行卡
			async stor(){
				if(this.has){
					const formatBankN = this.bankNum.replace(/\s/g, "")
					const res = await boundBankCard(formatBankN, this.telNum, this.expiryYear, this.expiryMonth, this.cvvCode, this.validNum)
					if(res.code==100){
						Toast('绑定成功')
						if(this.$route.query.paths){
							this.$router.push({
								path: this.$route.query.paths,
								query: {
									from: 'bindBank'
								}
							})
						}else{
							this.$router.replace('/buyGold')
						}
					}else{
						MessageBox({
							title: '提示',
							message: res.message+',请重新输入',
							confirmButtonText: '我知道了'
						})
						this.validNum=''
						let send_smscode = this.$refs.send_smscode
						clearInterval(this.timer)
						send_smscode.style.color="#eda835"
                        send_smscode.innerHTML = '获取验证码'
                        this.second = 60
						this.iNow=true
					}
				}
			}
		},
		computed: {

		},
		filters: {

		},
		components:{
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
.bindBank{
	width: 100%;
	height: 100%;
	background-color: #f5f5f5;
	position: absolute;
	top: 0;
	z-index: 100;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.bindBank>.input>section:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2)(-o-min-device-pixel-ratio:1.5){
	.bindBank>.input>section:after{
		content: '';
		display: inline-block;
		width: 100%;
		border-bottom: 1px solid #eeeeee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
	}
}
.bindBank>.input{
	width: 100%;
	height: 1.1rem;
	padding: 0 .3rem 0 .3rem;
	background-color: #fff;
}
.bindBank>.input>section{
	width: 100%;
	height: 100%;
}
.bindBank>.input>section>input{
	width: 80%;
	height: .5rem;
	outline: none;
	border: none;
	margin-top: .3rem;
	font-size: .3rem;
	float: left;
}
.bindBank>.input>section>.getVerif{
	display: inline-block;
	height: .3rem;
	margin-top: .35rem;
	font-size: .28rem;
	float: right;
	color: #eda835;
}
.second{
	color: #666;
}
.bindBank>.input>section>img{
	width: .3rem;
	height: .3rem;
	margin-top: .38rem;
	float: right;
}
.submit{
	width: 100%;
	height: .88rem;
	text-align: center;
}
.submit>section{
	display: inline-block;
	width: 6.9rem;
	text-align: center;
	height: .88rem;
	line-height: .88rem;
	font-size: .3rem;
	color: #fff;
	border-radius: .05rem;
	-webkit-border-radius: .05rem;
	-moz-border-radius: .05rem;
	-o-border-radius: .05rem;
	margin-top: .9rem;
}
.isStor{
	background-color: #f3d59c;
}
.noStor{
	background-color: #f2b643;
}
.bCardType{
	width: 100%;
	height: .6rem;
	line-height: .6rem;
	font-size: .25rem;
	color: #666666;
	padding: 0 .3rem 0 .3rem;
}
.mint-datetime-action{
	color: #eda835;
}
</style>
<style type="text/css">
.mint-datetime-action{
	color: #eda835;
}
.mint-popup-bottom{
	width: 100%;
}
</style>
