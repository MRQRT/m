<template>
	<div class="storAddress">
		<head-top>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goback">
			<span slot='custom' class="custom"></span>
		</head-top>
		<!-- 取件地址 -->
		<div class="title">
			<span>取件地址</span>
		</div>
		<section class="name_tel_addr" v-if="isHasAdd" @click="toAddress()">
			<div class="addr_left">
				<section class="_name_tel">
					<span class="__name">{{realName}}</span>
					<span class="__tel">{{telNum}}</span>
				</section>
				<section class="_addr">{{addr}}</section>
			</div>
			<div class="addr_right"></div>
		</section>
		<section class="name_tel_addr" v-else @click="toAddress('add')">
			<div class="addr_left" style="font-size: .28rem;">
				<span style="color:#999999; float: left;line-height:1.4rem;padding-left: .3rem;">到哪里找您取件？</span>
				<span style="#333333; float: right;line-height:1.4rem;padding-right: .08rem;">创建个地址</span>
			</div>
			<div class="addr_right"></div>
		</section>
		<!-- 存金方式 -->
		<div class="title">
			<span>存金方式</span>
		</div>
	    <section class="is_cash">
			<div class="isCash_top isCash_unChecked" :class="{'isCash_checked':direct==false}" @click="checkTypeFun(0)">
				<span style="font-size: .28rem;color: #666666;margin-left: .85rem;margin-right: .2rem;">存入克重</span><span style="color: #EDA835;font-size: .24rem;" v-show="!direct">保值抗通胀，可随时卖金变现</span>
			</div>
			<div class="isCash_bottom isCash_unChecked" :class="{'isCash_checked':direct==true}" @click="checkTypeFun(1)">
				<span style="font-size: .28rem;color: #666666;margin-left: .85rem;margin-right: .2rem;">直接变现</span><span style="color: #EDA835;font-size: .24rem;" v-show="direct">按结算当日实时金价直接变现到银行卡</span>
			</div>
		</section>
		<!-- 银行卡号 -->
		<div class="title" v-show="direct">
			<span>银行卡号</span>
		</div>
		<div v-show="bank_show">
			<div class="bank_content add_bank" v-if="isHasBank" @click="goto_bindBank">
				<span>绑定银行卡</span>
				<img src="../../images/right_jian.png">
			</div>
			<div class="bank_content has_bank" v-else>
				<span>{{bankName}}</span>
				<span style="float: right;">{{bankCardNo | tran_bankCardNo }}</span>
				<img :src="bankImgUrl">
			</div>
		</div>
		<!-- 身份认证 -->
		<div class="title" v-show="hasUploadPhoto">
			<span>身份认证</span>
		</div>
		<div class="id_photo_out" v-show="hasUploadPhoto">

			<p style="font-size: .24rem;color: #F2B643;line-height:.7rem;">*上传手持身份证照片，开启物流全额保价</p>
			<label class="id_photo_in" for="idCardInput" @click="selectImage">
				<input id="idCardInput" type="file" accept="image/*" name="file" class="ipt" @change="selectImage($event)" v-if="canPhoto">
				<img :src="photo" v-show="photo">
			</label>
		</div>
		<!-- 风险提示 -->
		<section class="argument">
			<input type="checkBox" class="check">
			<strong :class="{'change1':bg,'change2':!bg}" @click="changeBg" ref="arg"></strong>
			<div @click="arg" style="padding-top: .02rem;padding-left: .1rem">
				<span class="txt">我已阅读并同意<span style="color:#999999;">《黄金管家存金服务协议》</span></span>
			</div>
		</section>
	    <!-- 提交按钮 -->
		<div class="submit_btn no_submit" @click="submit_order">提交</div>
	</div>
</template>
<script type="text/javascript">
	import headTop from '@/components/header/head.vue'
	import { MessageBox,Toast,Indicator,Popup } from 'mint-ui'
	import { queryBankCard, withDrawMax, queryMyProfil, xmlUploadImg, addRecycleOrder, queryAddress } from '@/service/getData.js'
	import { mapState,mapMutations } from 'vuex'
	import { addHandId } from '@/images/addHandId.png'
	import { getRem, setStore, getStore, removeStore,checkAgent } from '@/config/mUtils.js'
	export default{
		data(){
			return {
				isHasAdd: false, //true表示有地址，false表示没有地址
				realName: '',
				  telNum: '',
					addr: '',
			      direct: false,
			       photo: '',
			    canPhoto: false,//可以拍照
				 noPhoto: true, //不可以拍照
				      bg: true,//是否阅读了协议
			   isHasBank: true,//是否绑定银行卡 true表示没有绑定   false表示绑定银行啦
			  bankImgUrl: '',
			    bankName: '',
			  bankCardNo: '',//用户银行卡号
	      hasUploadPhoto: '',//已经上传了手持身份证 true表示没有上传，false表示上传了手持身份证
	                 url: '',//上传手持身份证图片后返回的地址
	           bank_show: false,
	                 rem: '',
	         rightTelNum: '',//电话号正确的标记
				btn_lock: false,//防止表单重复提交的锁
				   agent: '',//
			}
		},
		created(){
			this.rem = getRem();
			if(window.stub){  //查看手机拍照读写权限(安卓手机需要验证)
				window.openPhoto();
				window.close('cancel');
			}else{
			    this.canPhoto=true; //苹果手机不需要验证权限
			    this.noPhoto=false;
		    }
		},
		mounted(){
			window.isApp();//是否在app
            var ag=checkAgent();//安卓和ios判断
            this.agent=ag;//
			this.queryMyProfil();//获取用户的信息
			this.queryBankCard();////获取用户银行卡
			if(this.$route.query.from && this.$route.query.from=='storArg' || this.$route.query.from && this.$route.query.from=='bindBank'){
				var ob = getStore('obj','session')
				this.isHasAdd=true
				this.realName = ob.contact,
				this.telNum = ob.telNum,
				this.addr = ob.addr,
				this.bg = ob.bg,
				this.direct = ob.direct,
				this.photo = ob.photo,
				this.url = ob.photo
			}else{
				this.queryAddress()//获取用户默认地址
			}
		},
		computed:{
			...mapState([
                'userInfo','token','recycleParams','address'
            ]),
		},
		watch:{
			direct(){
				this.direct==1?this.bank_show=true:this.bank_show=false
			},
			telNum: function(val){
				let reg = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{8}$/;
				if(val.match(reg)){
					this.rightTelNum = 1
				}else if(this.telNum ==''){
					this.rightTelNum = 0
				}else{
					this.rightTelNum = 0
				};
			},
		},
		filters: {
			tran_bankCardNo: function(val){
				return val.slice(0,3)+'**********'+val.slice(val.length-3,val.length)
			}
		},
		methods:{
			...mapMutations([
				'RECORD_RETURNRECYCLEORDER','RECORD_USERINFO','RECORD_RECYCLEPARAMS','RECORD_ADDRESS','set_initRulerData'
			]),
			/*选择是否变现*/
			checkTypeFun(val){
				this.direct=val
			},
			//协议阅读与否
			changeBg(){
				this.bg=!this.bg;
			},
			//获取用户信息
			async queryMyProfil(){
				var res=await queryMyProfil()
				if(res.code==100){
					this.RECORD_USERINFO(res.content)
					this.realnamed=res.content.realnamed
					if(this.userInfo){
							this.userInfo.isHandheldIDphoto==1?this.hasUploadPhoto=0:this.hasUploadPhoto=1
						}
				}
			},
			//获取用户的默认地址
			async queryAddress(){
				// console.log('进来')
				var getObj=getStore('obj','session');
				  const res = await queryAddress()
				//   console.log(res)
      			if(res.code==100){
					  //用户地址为空
      				if(res.content.length==0){
						//   console.log('地址空')
					  //再判断vuex中是否有地址，如果有，显示
					  this.isHasAdd=false
      				}else if(this.address){
						//   console.log('vuex有地址')
						this.isHasAdd=true
      					this.realName=this.address.contact
      					this.telNum=this.address.telephone
      					this.addr=this.address.address
      				//用户地址不为空，vuex中没有地址，取用户默认地址
      				}else{
						//   console.log('地址不为空')
						  this.isHasAdd=true
      					for(let i=0;i<res.content.length;i++){
      						if(res.content[i].isDefault==1){
      							this.realName=res.content[i].contact
      							this.telNum=res.content[i].telephone
      							this.addr=res.content[i].address
      						}else{
								this.realName=res.content[0].contact
      							this.telNum=res.content[i].telephone
      							this.addr=res.content[i].address
							  }
						  }
						  
      				}
				}
				//如果是从地址页过来的，将用户上传的身份证照片地址和是否变现重新绑定
				if(this.$route.query.from==2){
					let obj2 = getStore('obj2','session');
					this.photo = obj2.photo
					this.direct = obj2.direct
					this.url = obj2.photo
				}
      		},
      		toAddress(val){
      		//如果用户已经上传了证件照，将用户上传的身份证照片地址和是否变现进行保存
				let obj2={
					photo: this.url,
				   direct: this.direct
				}
				setStore('obj2',obj2,'session')
      			if(val){//没有地址时跳转添加地址
                    this.$router.push({
						path:'/personHomepage/addAddress',
                    	query:{
                    		from:2
                    	}
                    })
                }else{ //有地址时跳转我的地址
      				this.$router.push({
      					 path:'/personHomepage/address',
      				    query:{
      						from: 2,//参数2表示是从存金业务类型跳到我的地址页的
      					}
      				})
      			}
      		},
			/*选择身份证照片*/
			selectImage(e) {
			    if(this.noPhoto){  //查看手机拍照读写权限
				    if(window.backPerInfo){  //查看手机拍照读写权限
					    var res=window.backPerInfo();
					    if(res=='OK'){
						   this.canPhoto=true;
						   this.noPhoto=false;
					    }else{
						   this.canPhoto=false;
						   this.noPhoto=true;
						   Toast({
							  	message:'请在应用权限管理中打开“电话或读写手机存储”访问权限!',
							  	position: 'bottom',
							  	duration: 3000
						    })
						    return;
					    }
				    }
			    }
				if (!e.target.files || !e.target.files[0]){
					return;
				}
				Indicator.open();
				var t=this;
				var reader = new FileReader();
				reader.readAsDataURL(e.target.files[0]);
				reader.onload = function(evt) {
					// Indicator.close();
					t.photo=evt.target.result;
					t.uploadRecyclePic(evt.target.result);
                }
            },
            //图片上传
			uploadRecyclePic(value) {
				//参数一表示vue实例，参数二表示base64格式的图片，参数三表示方法，参数四表示mint-ui的加载的动画，参数五是Toast提示，参数六是缩小的比例,参数七表示订单数组的索引值
 				xmlUploadImg(this,value,'',Indicator,Toast)
            },
            //获取用户银行卡
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                    if(res.content.length==0){
                        this.isHasBank = true
                    }else{
                        this.isHasBank = false
                        const bankCard = res.content[0].bankCardNo
                        this.bankCardNo = bankCard
                        this.withDrawMax(bankCard)
                    }
                }
            },
            //获取银行卡名称
            async withDrawMax(value){
            	const res = await withDrawMax(value)
            	if(res.code==100){
	                //银行卡支持，返回content.errcode=0
	                if(res.content.errcode==0){
	                    // this.zanTing=false
	                    const content=res.content
	                    this.bankName = content.bankName;//银行名称
	                    this.bankImgUrl = content.bankImgUrl//银行图标
	               	}else{
	               		//银行卡不支持，返回content.errcode=1
	                    // this.zanTing=true
	                    const content=res.content
	                    this.bankName = content.bankName;//银行名称
	                    this.bankImgUrl = content.bankImgUrl;//银行图标
	                }
            	}
            },
            //立即绑卡
            goto_bindBank(){
            	var ob = {
            		contact: this.realName,
            		 telNum: this.telNum,
            		   addr: this.addr,
            		 direct: this.direct,
						 bg: this.bg,
					  photo: this.url, 
            	}
            	setStore('obj',ob,'session')
               	if(this.userInfo.realnamed!=1){
                    this.$router.push({
                    	path:'/personHomepage/authentication',
                    	query: {
                    		paths: '/storAddress'
                    	}
                    })
               	}else{
                    this.$router.push({
                    	path:'/personHomepage/bindBank',
                    	query:{
                    		paths: '/storAddress'
                    	}
                    })
               	}
            },
            //去存金协议页
            arg(){
            	var ob = {
            		contact: this.realName,
            		 telNum: this.telNum,
            		   addr: this.addr,
            		 direct: this.direct,
						 bg: this.bg,
					  photo: this.url,
            	}
            	setStore('obj',ob,'session')
            	this.$router.push({
            		path: "/storArg",
            	})
            },
            /*点击返回*/
            goback(){
            	this.$router.push({
            		path: '/stor',
            	})
            	Indicator.close();
            },
            /*点击提交*/
            async submit_order(){
            	if(this.realName==''){
            		Toast({
            			message: '先添加地址',
            			position: 'bottom',
            		})
            	}else if(this.direct==true && this.isHasBank==true){
        			Toast({
        				message: '请先绑定银行卡',
        				position: 'bottom',
            		})
            	}else if(this.hasUploadPhoto && this.photo=='' && this.url==''){
            		Toast({
            			message: '请上传手持身份证',
            			position: 'bottom',
            		})
            	}else if(this.bg==false){
            		Toast({
            			message: '请同意存金服务协议',
            			position: 'bottom',
            		})
            	}else{
            		if(this.btn_lock==true){
            			Toast({
            				message:'频繁操作',
            				position: 'bottom'
            			})
            			return
            		}
            		this.btn_lock=true
					Indicator.open()
					var recycleOrder = this.recycleParams;
					//如果是自定义品牌，参数里面的brandType的值和brandName的值需要重新修改
					if(Number(recycleOrder.brandType)!=1&&Number(recycleOrder.brandType)!=2&&Number(recycleOrder.brandType)!=3&&Number(recycleOrder.brandType)!=4&&Number(recycleOrder.brandType)!=5&&Number(recycleOrder.brandType)!=6&&Number(recycleOrder.brandType)!=7&&Number(recycleOrder.brandType)!=8&&Number(recycleOrder.brandType)!=9){
						recycleOrder.brandName=recycleOrder.brandType
						recycleOrder.brandType=10
					}
					delete(recycleOrder.images);
					delete(recycleOrder.checkType);
	            	let bb = JSON.stringify([recycleOrder])
	            	let isCash = this.direct?1:2
	            	removeStore('obj','session')
					removeStore('obj2','session')
					this.set_initRulerData(Number(10))//将ruler的初始值设置为10


					//添加下单推广渠道，手机浏览器、appcode
					if(getStore('isWebview','local')){//项目在app中
						if(this.agent=='And'){//项目在安卓
							let appsource=getStore('appsource','local');
							let source='ZYPT_Android_appstore-'+appsource+'_#';
							const res = await addRecycleOrder(bb,this.realName,this.telNum,this.addr,isCash,this.url,source)
							this.fanhuidata(res);								
						}else if(this.agent=='IOS'){//项目在ios
							const res = await addRecycleOrder(bb,this.realName,this.telNum,this.addr,isCash,this.url,'ZYPT_IOS_appleStore_#')
							this.fanhuidata(res);
						}
					}else{//项目不在app中
						if(getStore('tg','local')!='undefined'&&getStore('tg','local')!=null){//推广用户
							var tg=getStore('tg','local');
							var browser=getStore('browser','local')?getStore('browser','local'):'#';
							let source='TG_H5_'+tg+'_'+browser;
							const res = await addRecycleOrder(bb,this.realName,this.telNum,this.addr,isCash,this.url,source)
							this.fanhuidata(res);
						}else{//自营平台的用户
							var browser=getStore('browser','local')?getStore('browser','local'):'#';
							let source='ZYPT_H5_#_'+browser;
							const res = await addRecycleOrder(bb,this.realName,this.telNum,this.addr,isCash,this.url,source)
							this.fanhuidata(res);
						}
					}
    	        	// const res = await addRecycleOrder(bb,this.realName,this.telNum,this.addr,isCash,this.url)
            	}
			},
			//接口请求完处理返回信息
			fanhuidata(res){
				this.RECORD_RECYCLEPARAMS('')
				this.RECORD_ADDRESS('')
				if(res.code==100){
					Indicator.close()
					const or = {
						contact: this.realName,
						telephone: this.telNum,
						address: this.addr,
						bankCardNo: this.bankCardNo,
						isWithDraw: this.direct?1:0,
						orderArray: res.content.vo,
					}
					this.RECORD_RETURNRECYCLEORDER(or)
					this.$router.push({
						path: '/storResult',
					})
					this.btn_lock=false
				}else if(res.code==2004){
					Indicator.close()
					Toast({
						message: '操作过于频繁',
						position: 'bottom'
					})
				}else{
					Indicator.close();
					this.btn_lock=false
					Toast({
						message: res.message,
						position: 'bottom'
					})
				}
			}
		},
		components:{
			headTop: headTop,
		}
	}
</script>
<style type="text/css" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.storAddress{
	width: 100%;
	background-color: #f5f5f5;
	min-height:100vh;
	padding-top: .88rem;
	padding-bottom:1rem;
	position: relative;
}
.title{
	padding: 0.42rem .3rem 0.3rem .3rem;
}
.title>span:nth-child(1){
	display: inline-block;
	width: 25%;
	font-size: .3rem;
	color: #333333;
}
.title>span:nth-child(2){
	float: right;
	width: 25%;
	height: 1rem;
	line-height: 1rem;
	font-size: .3rem;
	text-align: right;
	color: #333333;
}
.name_tel_addr{
	width: 100%;
	height: 1.4rem;
	background-color: #ffffff;
}
.addr_left{
	width: 94%;
	height: 1.4rem;
	float: left;
}
.addr_right{
	width: 6%;
	height: 1.4rem;
	float: left;
	background-image: url(../../images/right_jian.png);
	background-repeat: no-repeat;
	background-size: .17rem;
	background-position: left center;
}
._name_tel{
	width: 100%;
	height: .7rem;
	line-height: .8rem;
	font-size: .3rem;
}
._addr{
	width: 100%;
	height: .7rem;
	line-height: .6rem;
	font-size: .24rem;
	padding-left: .3rem;
	overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
}
.__name{
	margin-right: .2rem;
	margin-left: .3rem;
}
.is_cash{
	width: 100%;
	height: 2.2rem;
	background-color: #ffffff;
}
.isCash_top{
	width: 92%;
	height: 1.1rem;
	line-height: 1.1rem;
	margin-left: 4%;
	position: relative;
}
.isCash_unChecked:before{
	content: '';
	width: .375rem;
	height: .375rem;
	background-image: url(../../images/select_gray.png);
	background-size: .36rem;
	position: absolute;
	left: .3rem;
	top: .39rem;
}
.isCash_checked:before{
	content: '';
	width: .375rem;
	height: .375rem;
	background-image: url(../../images/select_orange.png);
	background-size: .36rem;
	position: absolute;
	left: .3rem;
	top: .39rem;
}
.isCash_bottom{
	width: 92%;
	height: 1.1rem;
	line-height: 1.1rem;
	margin-left: 4%;
	position: relative;
}
@media(-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5),(-o-min-device-pixel-ratio:1.5){
	.isCash_top:after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.7);
		-o-transform: scaleY(0.7);
		-moz-transform: scaleY(0.7);
		transform:scaleY(0.7);
		position: absolute;
		bottom: 0;
	}
}
@media(-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2),(-o-min-device-pixel-ratio:1.5){
	.isCash_top:after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid #eee;
		-webkit-transform: scaleY(0.5);
		-o-transform: scaleY(0.5);
		-moz-transform: scaleY(0.5);
		transform:scaleY(0.5);
		position: absolute;
		bottom: 0;
	}
}
.bank_content{
	background-color: #ffffff;
	height: 1.4rem;
	line-height: 1.4rem;
	padding-right: .3rem;
	font-size: .3rem;
	color: #333333;
}
.add_bank{
	padding-left: 1.1rem;
	background-image: url(../../images/addBank.png);
	background-repeat: no-repeat;
	background-position: .28rem .42rem;
	background-size: .5rem;
}
.bank_content>img{
	width: .2rem;
	float: right;
	margin-top: .52rem;
}
.id_photo_out{
	width: 100%;
	height: 5.6rem;
	line-height: 5.6rem;
	background-color: #ffffff;
	text-align: center;
	position: relative;
	padding-top: .2rem;
}
.has_bank{
	padding: 0 .3rem 0 .3rem;
}
.has_bank>img{
	width: .55rem;
	float: left;
	margin-top: .4rem;
	margin-right: .4rem;
}
.id_photo_in{
	display: inline-block;
	width: 6.9rem;
	height: 4.16rem;
	border: 1px solid #F2B643;
	background: url(../../images/addHandId.png);
	background-repeat: no-repeat;
	background-size: 100%;
	background-position: center;
	position: relative;
}
.id_photo_in>img{
	position: absolute;
	top: 0;
	left: 0;
	width: 6.9rem;
	height: 4.16rem;
}
.ipt{
	opacity: 0;
}
.argument{
	margin-top:.4rem;
	font-size:.24rem;
	color:#9E9E9E;
	padding-left:.3rem;
	position: relative;
	padding-bottom: .52rem;
}
.check{
	display:none;
}
strong{
	width:.3rem;
	height:.3rem;
	position:absolute;
	left:0.3rem;
	top:.06rem;
}
.change1{
	background: url('../../images/readed.png') no-repeat;
	background-size: 100% 100%;
}
.change2{
	background-image: url('../../images/reading.png');
	background-repeat: no-repeat;
	background-position: 0 0;
	background-size: 100% 100%;
}
.txt{
	margin-left:.48rem;
	color: rgb(171, 171, 171)
}
.submit_btn{
	width: 100%;
	height: 1rem;
	line-height: 1rem;
	color: #ffffff;
	background-color: #F2B643;
	position: fixed;
	text-align: center;
	bottom: 0;
}
.submit_btn:active{
	background-color: #e4b864;
}
</style>