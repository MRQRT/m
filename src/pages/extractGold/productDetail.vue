<template>
	<div class="productDetail">
		<head-top headTitle='商品详情' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/extractGoldList')">
		</head-top>
		<!--产品详情-->
		<div class="product">
			<!--轮播图-->
            <section class="carousel">
                <div class="swiper-container swiper-container-detail">
			        <div class="swiper-wrapper">
				        <div class="swiper-slide" v-for="(item,index) in (productObj.imageUrls)" :key="index"><img :src="item"></div>
			        </div>
			        <div class="swiper-pagination"></div>
		        </div>
            </section>
			<!--产品名称和价格-->
			<section class="basic">
			 	<h3 class="proName">{{productObj.name}}</h3>
			 	<p class="price"><span class="sp1">¥</span><span class="sp2">{{formatPrice}}</span></p>
			</section>
			<!--产品相关信息-->
			<section class="mainProductMess">
                <img :src="productObj.packImgUrl">
			</section>
			<!--提金按钮-->
			<my-button class="extractBtn" @click.native="extract" buttonText="立即提金"></my-button>
		</div>
        <!--选择规格的提金盒子-->
        <mt-popup
        v-model="popupVisibleExtract"
        position="bottom" id="popupVisibleExtract">
            <section class="extract-gold-box">
                <img :src="productObj.imageUrls?productObj.imageUrls[0]:''" class="small-picture">
                <div class="name_price">
                    <h3>
                        <span>{{productObj.name}}</span>
                        <img src="../../images/blackClose.png" class="close-box" @click="closeExtract">
                    </h3>
                    <p class="price_box"><span class="price_unit">¥</span><span class="price_amount">{{unitPrice | formatPrice}}</span></p>
                </div>
                <!--选择规格的部分-->
                <div class="coreBox">
                    <!--规格-->
                    <div class="standard">
                        <p class="standard-title">规格</p>
                        <div class="stans" ref="stans">
                            <span v-for="(item,index) in standards" @click="selectThis($event,item)" :id="item.physicalId" :key="index" :data-index="index">{{item.weight | formatWeight}}g</span>
                        </div>
                    </div>
                    <!--数量-->
                    <div class="extractCount">
                        <p class="countText">数量<span class="stock">(库存{{stock}}件)</span></p>
                        <p class="iptCount">
                            <span style="-webkit-flex:1;-moz-flex:1;-o-flex:1;flex:1;text-align: center;line-height:.3rem;"  @touchstart="decreaseCount">
                                <img src="../../images/minus.png" class="minusNum" style="width:.24rem;height:.02rem;">
                            </span>
                            <input type="number" v-model="extractNum" style="-webkit-flex:2;-moz-flex:2;-o-flex:2;flex:2;" pattern="[0-9]*">
                            <span style="-webkit-flex:1;-moz-flex:1;-o-flex:1;flex:1;text-align: center;line-height:.5rem;"  @touchstart="increaseCount">
                                <img src="../../images/plus.png" class="plusNum" style="width:.25rem;height:.25rem;">
                            </span>
                        </p>
                    </div>
                    <!--支付方式-->
                    <div class="pay_method">
                        <p class="pay_method_title">支付方式</p>
                        <div class="pay_method_name">
                            <p class="weight_method" :class="{'selected':weightMethod}" @click="chooseMethod(0)">克重兑换</p>
                            <p class="cash_method" :class="{'selected':cashMethod}" @click="chooseMethod(1)">现金支付</p>
                        </div>
                    </div>
                </div>
                <!--确认支付按钮-->
                <section class="confirm_recharge">
                    <div class="recharge_amount" @click="explainWord">
                        <p class="recharge_title">{{weightMethod?'预估扣除总克重':'总金额'}}
                            <img src="../../images/definitions.png" class="word_explain" v-show="weightMethod">
                        </p>
                        <p class="recharge_number">{{spendWeightCash}}{{weightMethod?'克':'元'}}</p>
                    </div>
                    <p class="buy_btn" @click="extractGold">{{weightMethod?'兑换':'购买'}}</p>
                </section>
            </section>
        </mt-popup>
        <!--身份认证弹窗-->
        <mt-popup
        v-model="popupVisibleExtractSM"
        position="middle" id="popupVisibleExtractSM">
            <div class="identity">
                <h4>为保障您的账户安全,</h4>
                <h4>请先进行实名认证</h4>
                <!--点击进入实名认证-->
                <div class="btns">
                    <span @click="cancelIdentity" style="border-right:1px solid #EFEFEF;">取消</span>
                    <span @click="$router.push('/personHomepage/authentication')">确定</span>
                </div>
            </div>
        </mt-popup>
        <!--名词 解释弹出框-->
        <div class="explain_word_box" v-show="wordExplainShow">
            <div class="explain_content">
                <h4>名词解释</h4>
                <p>预估扣除总克重＝商品总价／实时金价</p>
                <div @click="wordExplainShow=false">我知道了</div>
            </div>
        </div>
	</div>
</template>
<script type="text/javascript" src="@/plugins/swiper.min.js"></script>
<script>
import '@/style/swiper.min.css'
import headTop from '../../components/header/head.vue';
import myButton from '../../components/myButton/myButton.vue';
import store from '@/store'
import {queryGoodsDetail,queryGoodsWeightList,queryMyProfil} from '@/service/getData'
import { setStore } from '@/config/mUtils'
import {Toast,Popup} from 'mint-ui'
import { mapState } from 'vuex'
	export default {
		data(){
			return {
                productObj:{},//产品详情
				standards:[],//产品规格
				extractNum:1,//提金数量默认为1
                physicalId:null,//所选产品的克重id
                realnamed:0,//是否实名认证过
                popupVisibleExtract:false,//选择规格的盒子是否出现
                popupVisibleExtractSM:false,//提示实名认证弹窗
                stock:10,//库存
                weightMethod:true,//克重兑换
                cashMethod:false,//现金兑换
                wordExplainShow:false,//名词解释提示框是否显示
                physicalIndex:null //选中规格的索引
			}
		},
		mounted() {
		    this.getProduceDetail();//进入页面即加载商品详情
            this.token ? this.queryMyProfil() : '';
            this.queryGoodsWeightList();//请求商品克重规格
		},
        filters:{
            formatWeight(val){
                if(!val) return '0.000';
                return (val*1).toFixed(3)
            },
            formatPrice(val){
                if(!val) return '0.00';
                return (val*1).toFixed(2)
            },
        },
		computed:{
            ...mapState([
                'currentPrice','token'
            ]),
			formatPrice(){
                if(!this.productObj.minPrice) return;
                if(this.productObj.minPrice==this.productObj.maxPrice){
                    return (this.productObj.minPrice).toFixed(2);
                }else{
                    return (this.productObj.minPrice).toFixed(2)+'~'+(this.productObj.maxPrice).toFixed(2);
                }
            },
            //预估扣除金额或克重(需要判断是饰品还是金条)
            spendWeightCash(){
                //兑换克重
                if(this.weightMethod){ 
                    var tempValue=this.unitPrice*this.extractNum/this.currentPrice
                    return tempValue.toFixed(4)
                }else{ //支付金额
                    return (this.unitPrice*this.extractNum).toFixed(2)
                }
            },
            //单价
            unitPrice(){
                if(this.physicalIndex==null) return;
                //priceMode  0实时金价按克、1一口价按件'
                if(!this.standards[this.physicalIndex].priceMode){
                    return this.standards[this.physicalIndex].weight*(this.currentPrice+this.productObj.labourFee)
                }else{
                    return this.standards[this.physicalIndex].unitPrice
                }
            }
		},
		methods:{
            //名词解释弹框出现
            explainWord(){
                if(!this.weightMethod) return;
                this.wordExplainShow=true
            },
			decreaseCount(){  //提金数量减1
                if(this.extractNum<=1){
                    return;
                }
                this.extractNum--;
            },
            increaseCount(){  //设置提金加1
                if(this.extractNum>=this.stock){
                    return;
                }
                this.extractNum++;
            },
            chooseMethod(val){
                if(!val){
                    if(this.weightMethod) return;
                    this.weightMethod=true;this.cashMethod=false;
                }else{
                    if(this.cashMethod) return;
                    this.cashMethod=true;this.weightMethod=false;
                }
            },
            //请求商品克重规格
            async queryGoodsWeightList(){
                var id=this.$route.query.id;
                var list=await queryGoodsWeightList(id);
                if(list.code==100){
                    this.standards=list.content;
                    this.stock=this.standards[0].quantity
                    this.physicalIndex=0
                }
            },
            //点击立即提金
            async extract(){ 
                if(!store.state.token){
                   this.$router.push({
                    path: '/loginIn',
                    query: {
                        'from': '/productDetail',
                        'id': this.$route.query.id
                    }
                  });
                  return;
                }
                
                //克重规格请求返回空数组的话，提示用户已售罄
                if(this.standards.length){
                    //默认选中第一个
                    this.popupVisibleExtract=true
                    document.querySelector('.stans').childNodes[0].click();
                }else{
                    Toast({
                          message: '已售罄!',
                          position: 'bottom',
                          duration: 1500
                    });
                }
            },
            closeExtract(){  //选择规格的盒子消失
                this.physicalId=null;
                this.extractNum=1;
                var spans=document.querySelector('.stans').children;
                Array.from(spans).forEach( function(element, index) {
                    if(element.classList.contains('selectStyle')){
                        element.classList.remove('selectStyle');
                    }
                });
                this.popupVisibleExtract=false
            },
            selectThis($event,item){  //选择规格
                this.physicalId=$event.target.id;
                this.physicalIndex=$event.target.dataset.index
                this.stock=item.quantity
                var childs=$event.target.parentNode.children;
                for(var i=0;i<childs.length;i++){
                    if(childs[i]==$event.target){
                        childs[i].classList.add('selectStyle');
                    }else if(childs[i]!==$event.target && childs[i].classList.contains('selectStyle')){
                        childs[i].classList.remove('selectStyle');
                    }
                }
            },
            extractGold(){ //选完规格确定提金
            
                //再判断有没有实名认证
                if(!this.realnamed){
                    this.popupVisibleExtractSM=true
                    return;
                }

                if(this.extractNum<=0){
                   Toast({
                          message: '数量不能小于等于0!',
                          position: 'top',
                          duration: 1500
                    });
                    return;
                }
                if(this.extractNum>this.stock){
                   Toast({
                          message: '库存不足!',
                          position: 'top',
                          duration: 1500
                    });
                    return;
                }
                if(!this.physicalId){
                    Toast({
                          message: '请选择规格!',
                          position: 'top',
                          duration: 1500
                      });
                    return;
                }

                this.$router.push(
                    {
                        path:'/fillInOrder', 
                        query:{
                            physicalId: this.physicalId,
                            count:this.extractNum,
                            buyMethod:this.weightMethod,
                            path:'productDetail',
                            price:this.unitPrice, //购金时的单价
                            spendWeightCash:this.spendWeightCash,  //预估扣除克重或支付总金额
                            currentPrice:this.currentPrice //下单时的实时金价
                        }
                    }
                );
            },
            async queryMyProfil(){  //查看是否实名认证
                var res=await queryMyProfil();
                if(res.code==100) {
                    this.realnamed=res.content.realnamed;   //是否实名认证
                }
            },
            cancelIdentity(){ //关闭实名认证提醒弹窗
                this.popupVisibleExtractSM=false
            },
            //获取产品详细信息
            async getProduceDetail(){
                var id=this.$route.query.id;
                setStore('goodsId',id,'local');
                var res=await queryGoodsDetail(id);
                if(res.code==100){
                    this.productObj=res.content;
                    var that = this;
                    setTimeout(function(){
                        that.bannerSwiper();
                    },100)
                }
            },
            //提金产品列表swiper初始化
            bannerSwiper(){
                var swiper2 = new Swiper('.swiper-container-detail', {
                    direction:'horizontal',
                    pagination: '.swiper-pagination',
                    paginationClickable :true,
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    coverflow: {
                        rotate:30,
                        stretch: 30,
                        depth: 100,
                        modifier: 2,
                        slideShadows : false
                    },
                    paginationElement : 'li',
                })
            }
		},
        watch:{
            popupVisibleExtract(val){
                if(val) return;
                this.physicalId=null;
                this.extractNum=1;
            },
            token(){
                this.token ? this.queryMyProfil() : '';
            }
        },
		components:{
            headTop,
            myButton
		}
	}
</script>

<style scoped lang="less">
@import '../../style/common.less';
    .productDetail{
        position: relative;
        padding-top:.88rem;
        background-color: #fff;
    }
    .product .carousel{
    	height:5.7rem;
    }
    .swiper-pagination{
    	top:5.1rem;
    }
    .swiper-container{
      padding-top:.06rem;
      height:7.5rem;
    }
    .swiper-slide {
    	background-position: center;
    	background-size: cover;
    	width: 300px;
    	height: 300px;
    }
    .carousel{
    	padding-top:.46rem;
    	text-align: center;
    	position: relative;
    }
    .carousel img{
    	width:5rem;
        height:5rem;
        -moz-box-shadow: 0 2px 15px 6px #f5f5f5;
        -webkit-box-shadow: 0 2px 15px 6px #f5f5f5;
        -o-box-shadow: 0 2px 15px 6px #f5f5f5;
    	box-shadow:0 0px 20px 6px #f5f5f5;
    }
    .product .basic{
    	margin-top:.44rem;
    	padding-left:.3rem;
    }
    .basic .proName{
    	font-size:.34rem;
        color:#000000;
        font-weight: bold;
    	height:.66rem;
    }
    .basic .price{
    	color:#EDA835;
        height:.88rem;
    }
    .basic .price .sp1{
        font-size:.22rem;
        font-weight:bold;
    }
    .basic .price .sp2{
        font-size:.44rem;
        font-weight:bold;
    }
    .product .mainProductMess{
        border-top:1px solid #EEEEEE;
        padding-bottom:.98rem;
        text-align:center;
        img{
            width:100%;
        }
    }
    .extractBtn{
    	height:.98rem;
    	line-height:.98rem;
    	text-align: center;
    	background-color: #F2B643;
    	color:#fff;
    	font-size:.34rem;
        position: fixed;;
        bottom:0;
        width:100%;
    }
    .extract-gold-box{
    	width:100%;
        background-color: #fff;
    }
    .coreBox{
        padding-left:.28rem;
        padding-right:.28rem;
    }
    .extract-gold-box .name_price{
    	height:1.7rem;
        border-bottom: .01rem solid #EEEEEE;
        padding-left:2.4rem;
        padding-top:.3rem;
    }
    .extract-gold-box h3{
        position:relative;
        line-height:.36rem;
        height:.34rem;
        overflow: hidden;
    }
    .extract-gold-box h3 span{
        display: inline-block;
        width:90%;
        height:.34rem;
        font-size:.32rem;
        font-weight: 600;
        color:#010101;
    }
    .extract-gold-box .standard{
    	padding-top:.4rem;
    }
    .extract-gold-box .standard .standard-title{
    	height:.56rem;
    	font-size:.28rem;
    	color:#333333;
    }
    .stans span{
    	display: inline-block;
    	width:1.5rem;
    	height:.5rem;
    	line-height: .5rem;
    	text-align: center;
    	font-size:.24rem;
    	background-color: #F5F5F5;
    	color:#666666;
    	margin-right:.3rem;
        margin-bottom:.3rem;
        .radius(2px);
    }
    .stans span:nth-child(4n){
		margin-right:0;
    }
    .extractCount{
        .flex-simple;
        margin-top:.4rem;
        margin-bottom:.8rem;
    }
    .extractCount .iptCount{
        background-color: #F5F5F5;
        width:2.2rem;
        height:.5rem;
        .radius(2px);
        .flex-simple;
    }
    .iptCount span:active{
        background-color: rgba(0,0,0,.3);
    }
    .extractCount .countText{
    	font-size:.28rem;
        color:#333333;
        flex:9;
        -webkit-flex:9;
        -moz-flex:9;
        -o-flex:9;
    }
    .extractCount .countText .stock{
        .font-style(0.22rem,#999999);
        padding-left:.1rem;
    }
    .extractCount input{
    	height:.5rem;
    	line-height: .5rem;
    	border:none;
    	outline-style: none;
    	background-color: #F5F5F5;
    	text-align: center;
    	font-size:.2rem; 
    	font-weight: bold;
        width:.92rem;
    }
    .extractCount .minusNum{
        width:.24rem;
        height:.02rem;
    }
    .extractCount .plusNum{
        width:.25rem;
        height:.25rem;
    }
    .pay_method{
        margin-bottom:.8rem;
        .pay_method_title{
            .font-style(0.28rem,#333333);
            padding-bottom:.3rem;
        }
        .pay_method_name{
            padding-bottom:0.8rem;
            p{
                display: inline-block;
                background-color: #F5F5F5;
               .font_common(1.76rem,.5rem);
               .font-style(0.28rem,#666666);
               .radius(2px);
            }
        }
    }
    .pay_method .cash_method{
        margin-left:.3rem;
    }
    .pay_method p.selected{
        background-color: #F2B643;
        color:#fff;
    }
    .price_box{
        padding-top:.1rem;
        .price_unit{
            .font-style(0.22rem,#EDA835);
            font-weight:600;
        }
        .price_amount{
            .font-style(0.44rem,#EDA835);
            font-weight:600;
        }
    }
    .small-picture{
        width:1.82rem;
        height:1.82rem;
        position: absolute;
        top:-.42rem;
        left:0.28rem;
        border: 1px solid #eee;
    }
    .close-box{
        width:.26rem;
        height:.26rem;
        position:absolute;
        right:.3rem;
        bottom:0;
    }
    .stans .selectStyle{
        background-color: #F2B643;
        color:#fff;
    }
    .identity{
        width:4.96rem;
        background-color: #fff;
        .radius(10px);
        padding-top:.4rem;
    }
    .identity h4{
        text-align: center;
        font-size:.3rem;
    }
    #popupVisibleExtract.mint-popup{
        width:100vw;
    }
    #popupVisibleExtractYE.mint-popup,#popupVisibleExtractSM.mint-popup,#popupVisibleExtractIDCARD.mint-popup{
      width:4.96rem;
    }
    .confirm_recharge{
        .flex-simple;
        position: absolute;
        width:100%;
        height:.98rem;
        bottom:0;
        .recharge_amount{
            width:66.67%;
            background-color: #F8F8F8;
            padding-left:.3rem;
            padding-top:.12rem;
        }
        .buy_btn{
            width:33.33%;
            background-color: #F2B643;
            .font-style(0.34rem,#fff);
            text-align: center;
            line-height:.98rem;
        }
    }
    .recharge_amount .recharge_title{
        .font-style(0.22rem,#999999);
        position: relative;
    }
    .recharge_title .word_explain{
        width:.24rem;
        height:.24rem;
        position: absolute;
        bottom:0.04rem;
        right:2.76rem;
    }
    .recharge_amount .recharge_number{
        .font-style(0.34rem,#EDA835);
    }
    .explain_word_box{
        position:fixed;
        width:100%;
        height:100%;
        background-color:rgba(0,0,0,.4) ;
        top:0;
        left:0;
        z-index:10000;
        .explain_content{
            width:4.9rem;
            background-color: #fff;
            position: absolute;
            text-align:center;
            padding-top:.38rem;
            .radius(10px);
            .position_middle(4.9rem,2.44rem);
        }
    }
    .explain_content h4{
        .font-style(0.32rem,#000000);
        font-weight:600;
        padding-bottom:.14rem;
    }
    .explain_content p{
        .font-style(0.24rem,#333333);
        padding-bottom:.38rem;
        border-bottom:1px solid #EEEEEE;
    }
    .explain_content div{
        .font-style(0.32rem,#EDA835);
        padding-top:.2rem;
        padding-bottom:.2rem;
    }
    .identity .btns{
        border-top: 1px solid #eee;
        margin-top: .14rem;
        height: .9rem;
        display: -webkit-flexbox;
        display: -moz-flex;
        display: -o-flex;
        display: flex;
    }
    .identity .btns span{
        -webkit-flex: 1;
        -moz-flex: 1;
        -o-flex: 1;
        flex: 1;
        height: 100%;
        line-height: .9rem;
        text-align: center;
        font-size: .3rem;
        color: #eda835;
    }
</style>
<style>
  li.swiper-pagination-bullet{
    width:.12rem;
    height:.04rem;
    background-color: #E1E1E1;
  }
  li.swiper-pagination-bullet-active{
    background-color: #F2B643;
    opacity: 1;
  }
</style>