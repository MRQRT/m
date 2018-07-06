<template>
	<div class="my-bank-container" v-show="finish">
		<head-top headTitle='我的银行卡' class="head-top" id="head_top" ref="topHead">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack()">
			<img src='../../images/points.png' slot="custom" class="points custom" @click="unbundling" v-show="!noBankShow">
		</head-top>
        <!--未绑卡时显示-->
        <div v-if="noBankShow" class="noBank">
            <img src="../../images/noBank.png">
            <p>您没有绑定银行卡，立即绑卡！</p>
            <p style="padding-top: 0"><span @click="goto_bindBank">立即绑卡</span></p>
        </div>
		<!--绑卡时显示-->
		<div v-if="!noBankShow" class="bank-area" ref="bankArea">
			<div class="bank-container">
				<div class="bank-top-part">
				    <!--银行卡logo-->
					<div class="left-top-part">
						<img :src="imgUrl" class="bankLogo">
					</div>
					<!--银行卡名称和限额-->
					<div class="right-top-part">
						<p class="p1">{{bankName}}</p>
						<p class="p2" v-show="!zanTing">单笔最高{{singleHigh}},单日最高{{dayHigh}}</p>
						<p class="p3" v-show="zanTing">暂不支持该银行卡，请联系客服！</p>
					</div>
				</div>
				<div class="bank-bottom-part">
					<p class="bankNum">**** **** ****  {{lastNum}}</p>
					<p class="bankType">{{category==0?'借记卡':'信用卡'}}</p>
				</div>
			</div>
		</div>
		<!--遮罩-->
		<div class="mask" v-show="bankTipShow || bankTelShow"></div>
		<!--解除银行卡盒子-->
        <mt-popup
        v-model="needBankShow"
        position="bottom" id="popupVisibleExtractJB">
            <div class="unbundleBank">
			    <p class="unbundle-p1" @click="confirmUnbundle">解除银行卡</p>
			    <p class="unbundle-p2" @click="confirmCancel">取消</p>
		    </div>
        </mt-popup>
		<!--解除银行卡（异常或账户不为零）时提示的小盒子-->
		<div class="unbundleBankTip" v-show="bankTipShow">
			<h4>提示</h4>
			<p>{{contactServer}}</p>
			<div>
				<span class="cancelLeft" @click="cancelUnbundle" style="color:#000;">取消</span>
				<span @click="teleNumber">客服电话</span>
			</div>
		</div>
		<!--拨打客服电话的小盒子-->
		<div class="bankTele" v-show="bankTelShow">
			<h4>400-819-6199</h4>
			<div>
				<span class="cancelLeft" @click="cancelTel" style="color:#000;">取消</span>
				<span @click="telPhone('4008196199')">呼叫</span>
			</div>
		</div>
	</div>
</template>

<script>
import headTop from '../../components/header/head.vue';
import bankDefault from '@/images/bankDefault.png'
import { queryBankCard, bankCardBin, unBindCard } from '@/service/getData.js'
import { mapState } from 'vuex'

import { checkAgent,getRem } from '@/config/mUtils'

import { Popup,Toast } from 'mint-ui'

	export default {
		data(){
			return {
				      imgUrl: bankDefault,//银行卡图标地址
				needBankShow: false,//遮罩层显示控制
				 bankTipShow: false,//账户余额不为0的时候的提示框
				 bankTelShow: false,//拨打电话小提示
                  noBankShow: true, //是否绑卡 true为没有绑卡，false为已绑卡
                  bankCardNo: '',//银行卡号
                    bankName: '',//银行卡名字
               singleHighest: '',//单笔最高限额
                  dayHighest: '',//单日最高限额
                    category: '',//银行卡类型
                     lastNum: '',//后四位
                          id: '',//银行卡Id
                popupVisible: false,//弹出层开关
                   equipment: null,//什么系统
               contactServer: '',//解除银行卡（异常或账户不为零）时提示的内容
                     zanTing: false,//银行卡不支持提示文字
                      finish: false,//银行卡信息请求回之后再渲染页面

			}
		},
		mounted() {
            this.token ? this.queryBankCard() : ''
            let agent=checkAgent();
            this.equipment=agent//手机系统识别
        },
        watch:{
            token(){
                this.token ? this.queryBankCard() : ''
            }
        },
		computed:{
			...mapState([
                'userInfo','token'
            ]),
            singleHigh(){
                return ((parseInt(this.singleHighest/10000))>=1)?parseFloat(this.singleHighest/10000)+'w':parseFloat(this.singleHighest);
            },
            dayHigh(){
                return ((parseInt(this.dayHighest/10000))>=1)?parseFloat(this.dayHighest/10000)+'w':parseFloat(this.dayHighest);
            }
		},
		methods:{
            //返回首页
            goBack(){
                window.toApp();
                this.$router.push('/mine');
            },
            //立即绑卡
            goto_bindBank(){
                   if(this.userInfo.realnamed!=1){
                        this.$router.push('/personHomepage/authentication')
                   }else{
                        this.$router.push('/personHomepage/bindBank')
                   }
            },
            //解绑银行卡
			unbundling(){//调用接口去判断是否可以直接解绑卡
				this.needBankShow=true;//遮罩层控制变量
			},
            //客服电话弹出层的取消按钮
			cancelTel(){
				this.needBankShow=false;//遮罩层控制变量
				this.bankTelShow=false;//打电话提示开关
			},
            //客服电话弹出层打电话按钮
			telPhone(number){
                if(window.getPhonePer){
                    window.getPhonePer(number);
                }
				this.needBankShow=false;//遮罩层控制变量
				this.bankTelShow=false;//打电话提示开关
			},
            //账户不为零提示框的取消按钮
			cancelUnbundle(){
				this.needBankShow=false;//遮罩层控制变量
				this.bankTipShow=false;//账户余额不为0的时候的提示框
			},
            //账户不为零提示框的客服电话按钮
			teleNumber(){
                if(this.equipment=="IOS"){
                    phone("400-819-6199");
                }else{
                    this.bankTelShow=true;//打电话提示开关
				    this.bankTipShow=false;//账户余额不为0的时候的提示框
                }
			},
            //点击解除银行卡
			async confirmUnbundle(){
                const res = await unBindCard(this.id)
                if(res.code==100){
                    Toast({
                        message: '银行卡解绑成功',
                        position: 'bottom',
                        duration: 4000
                    });
                    this.needBankShow=false;//遮罩层控制变量
                    this.queryBankCard();//解绑成功重新请求银行卡
                }else{
                    this.contactServer = res.message
                    this.needBankShow=false;//遮罩层控制变量
                    this.bankTipShow=true;//账户余额不为0的时候的提示框
                }
			},
            //解绑银行卡弹出层取消按钮
			confirmCancel(){
				this.needBankShow=false;//遮罩层控制变量
			},
            //获取用户银行卡
            async queryBankCard(){
                const res = await queryBankCard()
                if(res.code==100){
                    if(res.content.length==0){
                        this.finish=true;
                        this.noBankShow = true
                    }else{
                        this.finish=true;
                        this.noBankShow = false
                        this.bankCardNo = res.content[0].bankCardNo
                        this.id = res.content[0].id
                        this.bankCardBin()
                    }
                }
            },
            //获取用户银行卡的信息
            async bankCardBin(){
                const res = await bankCardBin(this.bankCardNo)
                if(res.code==100){
                    if(res.content.errcode==0){
                        this.zanTing = false
                        this.bankName = res.content.bankName;
                        this.imgUrl = res.content.bankImgUrl;
                        this.category = res.content.cardType;
                        this.singleHighest = res.content.eachMaxMoney;
                        this.dayHighest = res.content.eachDayMaxMoney;
                        this.lastNum = res.content.fourNum;
                    }else{
                        this.zanTing = true
                        this.bankName = res.content.bankName;
                        this.imgUrl = res.content.bankImgUrl;
                        this.zanTing = true
                        this.lastNum = res.content.fourNum;
                        this.category = res.content.cardType;
                    }
                }

            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    *{
    	box-sizing: border-box;
    	margin:0;
    	padding:0;
    }
    /*控制头部样式*/
    #head_top{
    	border:none;
    }
    #head_top .head_goback{
    	width:.19rem;
        height:.36rem;
    }
    #head_top .points{
    	width:.48rem;
    	height:.14rem;
    	top:.4rem;
    }
    .mint-popup#popupVisibleExtractJB{
        width:100%;
    }
    /*银行卡内容区域*/
    .my-bank-container{
    	padding-top:.88rem;
        min-height: 100vh;
        background-color: #F2F2F2;
    }
    .my-bank-container .bank-area{
        width: 100%;
    	background-color: #F2F2F2;
    }
    .my-bank-container .bank-container{
    	width:100%;
    	height:4.86rem;
    	margin:0 auto;
    	background: url(../../images/bankBg.png);
    	background-size: 100%;
    	position: relative;
    }
    .bank-container .bank-top-part{
    	position: absolute;
    	top:0.8rem;
    	left:0.66rem;
    	display: flex;
        display: -webkit-flex;
        display: -moz-flex;
        display: -o-flex;
    }
    .bank-container .bank-bottom-part{
    	position: absolute;
    	top:2.8rem;
    	left:1.22rem;
    }
    .bank-container .bank-bottom-part .bankNum{
    	font-size:.36rem;
    	font-weight: bold;
    }
    .bank-container .bank-bottom-part .bankType{
    	font-size:.26rem;
    	color:#44413D;
    }
    .bank-container .bank-top-part .bankLogo{
    	width:.8rem;
    	height:.8rem;
    }
    .bank-top-part .right-top-part{
    	margin-left:.2rem;
    }
    .bank-top-part .right-top-part .p1{
		font-size:.32rem;
		font-weight: bold;
    }
    .bank-top-part .right-top-part .p2{
		font-size:.24rem;
		color:#44413D;
    }
    .bank-top-part .right-top-part .p3{
        font-size:.24rem;
        color:red;
    }
    .btnStyle{
    	font-size:3.6rem;
    	color:red;
    }
    /*遮罩*/
    .mask{
    	width:100%;
    	height:100%;
    	position: absolute;
    	top:0;
    	left:0;
    	z-index: 200;
    	background-color: rgba(0,0,0,.5);
    }
    /*解除银行卡的小盒子*/
    .my-bank-container .unbundleBank{
		height:2.2rem;
		background-color: #fff;
		width:100%;
    }
    .my-bank-container .unbundleBank p{
    	height:1.1rem;
    	line-height: 1.1rem;
    	text-align: center;
    	font-size:.34rem;
    	font-weight: bold;
    }
    .my-bank-container .unbundleBank .unbundle-p1{
    	border-bottom:1px solid #F5F5F5;
    }
    /*解绑银行卡时提示的内容*/
    .my-bank-container .unbundleBankTip,
    .my-bank-container .bankTele{
    	width:4.92rem;
    	background-color: #fff;
        -webkit-border-radius:10px;
        -moz-border-radius:10px;
        -o-border-radius:10px;
        border-radius:10px;
    	left:50%;
    	margin-left:-2.46rem;
    	top:4.3rem;
    	position: absolute;
    	z-index: 250;
    	padding-top:.4rem;
    }
    .my-bank-container .unbundleBankTip h4{
		height:.52rem;
		font-size:.33rem;
		text-align: center;
    }
    .my-bank-container .unbundleBankTip p{
		font-size:.25rem;
		padding-left:.32rem;
		padding-right:.3rem;
		color:#353535;
        padding-top: 5px;
        text-align: center;
    }
    .my-bank-container .unbundleBankTip div,
     .my-bank-container .bankTele div{
    	margin-top:.4rem;
    	border-top:1px solid #F3F3F3;
    }
    .my-bank-container .unbundleBankTip div span,
    .my-bank-container .bankTele div span{
    	width:48%;
    	display: inline-block;
    	text-align: center;
    	height:.9rem;
    	line-height:.9rem;
        font-size:.32rem;
        color:#EDA835;
    }
    .my-bank-container .unbundleBankTip .cancelLeft,
    .my-bank-container .bankTele .cancelLeft{
    	border-right:1px solid #F3F3F3;
    }
    /*拨打电话*/
    .my-bank-container .bankTele h4{
		font-size:.34rem;
		text-align: center;
    }
    .my-bank-container .noBank{
        text-align: center;
        padding-top:2.6rem;
        height: 12rem;
        background-color: #f5f5f5;
    }
    .my-bank-container .noBank img{
        width:3.05rem;
        height:2.43rem;
    }
    .my-bank-container .noBank p{
        font-size:.32rem;
        padding-top:.8rem;
        color:#7B7B7B;
    }
    .my-bank-container .noBank span{
        display: inline-block;
        width:2.2rem;
        height:.7rem;
        line-height:.7rem;
        text-align: center;
        font-size:.3rem;
        color:#fff;
        background-color:#F2B643;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        -o-border-radius: 3px;
        margin-top:.38rem;
    }
</style>
