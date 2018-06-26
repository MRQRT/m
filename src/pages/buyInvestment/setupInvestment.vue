<template>
	<div class="investementSetUp">
        <div class="content">
          <head-top headTitle='定投设置' class="head-top">
             <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
         </head-top>
        <!--主体部分-->
         <section class="main">
            <!--定投信息banner-->
             <img :src="currentSelect.middlePath">
            <!--梦想寄语-->
             <section class="dreams">
                 <p class="title">大家都在为梦想而努力</p>
                 <div class="dreamMess">
                     <span class="dreamItem" @click="chooseDream($event,item.name,item.id)" v-for="item in products" :class="{'activedDream':item.id==productId}">{{item.name}}</span>
                 </div>
             </section>
             <!--梦想设置-->
             <section class="setUp">
                 <!--我的梦想寄语-->
                 <div class="myDream">
                     <p>我的梦想是</p>
                     <div class="iptBox">
                         <span class="dream" style="color:#000;font-weight: bold;">{{dream}}</span>
                     </div>
                 </div>
                 <!--我的梦想预算-->
                 <div class="myBudget">
                     <p>{{budgetTitle}} <span class="depenMoney" @click="toggleWay">切换成{{budgetMess}}</span></p>
                     <div class="iptBox">
                         <p class="symbolCash" v-show="isShow"><span>金额</span><img src="../../images/cash.png"  v-show="isShow && budget" style="width:.2rem;height:auto;margin-left:.3rem;"></p>
                         <span class="symbolWeight" v-show="!isShow">克重</span>
                         <input type="number" class="dream" :placeholder="place" :class="{'distance':isShow && budget}" v-model="budget"  @keyup="checkInput(budget+'')" @blur="checkNum">
                        
                         <img src="../../images/clearinput.png" class="clear" v-show="budget" @click="cleaript">
                         <!--预估部分-->
                         <div class="estimate" v-show="budget"><span>{{estimateTitle}}:<strong></strong>{{count}}{{isShow ? '克' : '元'}}</span></div>
                     </div>
                 </div>
                 <!--下一步-->
                 <a @click="goToSet" class="next" id='click_btn' :class="{'used':budget!='','unused':budget==''}">
                 下一步
                 </a>
             </section>
         </section>
        </div>
	</div>
</template>
<script>
	import headTop from '../../components/header/head.vue';
    import { mapState } from 'vuex';
    import { getStore,clearNoNum } from '@/config/mUtils'
	export default {
		data(){
			return {
                budgetTitle:'我的梦想预算(克)',
                budgetMess:'按资金',
                place:'请输入梦想克重',
                isShow:false,//元字符是否显示
                dream:'',//输入框中的梦想寄语
                budget:'',//输入框中的梦想预算
                estimateTitle:'预估资金',//默认是预估克重
                refer:1, //按克重为1  按资金为2
                productId:null,//选择产品的id
                currentSelect:{},//当前选中的定投产品
                products:[] //所有的定投产品
			}
		},
        created(){
            this.productId=this.$route.query.productId;
            this.products=this.regularProducts;
            this.changeProduct();
        },
        computed:{
            ...mapState([
                'currentPrice','regularProducts'
            ]),
            count(){
                //预估金额,保留2位小数，向上截取
                //预估克重,保留4位小数，向下截取
                if(this.isShow){
                    return (this.budget/this.currentPrice).toFixed(4);
                }else{
                    return (this.budget*this.currentPrice).toFixed(2);
                }
            }
        },
        watch:{
            currentPrice(val){
                return val
            }
        },
		methods:{
			toggleWay(){
                if(this.budgetMess=='按资金'){
                    this.budgetMess='按克重';
                    this.budgetTitle='我的梦想预算(元)';
                    this.place="请输入梦想金额";
                    this.estimateTitle='预估克重';
                    this.isShow=true;
                    this.budget=null;
                    this.refer=2;
                }else{
                    this.budgetMess='按资金';
                    this.budgetTitle='我的梦想预算(克)';
                    this.place="请输入梦想克重";
                    this.estimateTitle='预估资金';
                    this.isShow=false;
                    this.budget=null;
                    this.refer=1;
                }
            },
            chooseDream($event,text,id){
                //定投产品发生相应改变
                var arr1=$event.target.parentNode.children;
                var tar=$event.target;
                tar.classList.add('activedDream');
                this.dream=text;
                this.productId=id;
                for(var i=0;i<arr1.length;i++){
                    if(arr1[i]!==tar && arr1[i].classList.contains('activedDream')){
                        arr1[i].classList.remove('activedDream')
                    }
                }
            },
            checkInput(val){
                (this.isShow==true)?this.budget=clearNoNum(val,2):this.budget=clearNoNum(val,3);
                this.limitMoney(this.budget)
             },
            checkNum(){  //输入框停止输入时校验数字
               this.budget=this.budget.replace(/[^0-9.]/g,'');

            },
            limitMoney(val){
                 if(val.indexOf('.')!=-1){
                    if(val.indexOf('.')>10){
                        this.budget=val.substring(0,10)+'.'
                    }
               
                 } else{
                    if(val.length>10){
                        this.budget=val.substring(0,10);
                    }
                 }

            },
            cleaript(){
                this.budget='';
            },
            //点击下一步
            goToSet(e){
                if(e.target.classList.contains('unused')) return;
                this.$router.push({
                    path:'/investmentMess',
                    query:{
                        refer:this.refer, 
                        budget:this.budget,
                        productId:this.productId
                    }
                })
            },
            changeProduct(){
                var t=this;
                this.products.forEach(function(val,ind) {
                    if(val.id==t.productId){
                        t.currentSelect=val;
                        t.dream=val.name;
                        return;
                    }
                });
            }
		},
        watch:{
            productId(){
                this.changeProduct();
            }
        },
		components:{
			headTop,
		}
    }
</script>

<style scoped>
    #head_top{
        border-bottom: none;
    }
    .investementSetUp{
        background-color: #fff;
        padding-top:.88rem;
    }
    .main{
        position: relative;
    }
    .main img{
        width:7.5rem;
        height:5.62rem;
    }
    .main .dreams{
        height:5.8rem;
        padding-top:4.2rem;
        padding-left:.5rem;
        margin-top:-0.06rem;
    }
    .dreams .title{
        font-size:.28rem;
        color:#686868;
    }
    .dreamMess{
        margin-top:.32rem;
    }
    .dreamMess .dreamItem{
        display: inline-block;
        font-size:.24rem;
        color:#9A9A9A;
        height:.5rem;
        line-height:.5rem;
        text-align: center;
        border:1px solid #EEEEEE;
        margin-right:.2rem;
        margin-bottom:.2rem;
        border-radius: 4px;
        padding:0 .24rem;
    }
    .main .setUp{
        width:7.12rem;
        position: absolute;
        box-shadow: 0px 8px 8px #F5F5F5;
        position: absolute;
        left:50%;
        margin-left:-3.56rem;
        top:3.1rem;
        background-color: #fff;
        z-index:10; 
        padding:.4rem .3rem 0 .32rem;
        border-radius: 3px;
    }
    .setUp .myBudget{
        margin-top:.75rem;
    }
    .setUp .myDream p,
    .setUp .myBudget p{
        font-size:.26rem;
        color:#6F6F6F;
        line-height: .26rem;
    }
    .myBudget p .depenMoney{
        font-size:.26rem;
        color:#eda835;
        float:right;
    }
    .myDream .iptBox,.myBudget .iptBox{
        margin-top:.29rem;
        height:.9rem;
        line-height: .9rem;
        background-color:#F5F5F5;
        padding-left:.22rem;
        position: relative;
        border-radius: 3px;
    }
    .myDream .iptBox .dream,.myBudget .iptBox .dream{
        width:100%;
        border:none;
        /* margin-top:.27rem; */
        outline-style: none;
        color:#000;
        font-weight: bold;
        font-size: .34rem;
        background-color: inherit;
    }
    .myBudget .iptBox .dream{
         padding-left:.98rem;
    }
    .iptBox .symbolWeight{
        position: absolute;
        font-weight: bold;
        font-size:.34rem;
        color:#000;
    }
    .iptBox p.symbolCash{
        position: absolute;
        height:.9rem;
        line-height: .9rem;
    }
    .iptBox p.symbolCash span{
        font-weight: bold;
        font-size:.34rem;
        color:#000;
    }
    .iptBox .dream.distance{
        padding-left:1.22rem;
    }
    ::-webkit-input-placeholder{
        font-weight: normal;
        color:#999999;
    }
    ::-moz-placeholder{
        font-weight: normal;
        color:#999999;
    }
    :-moz-placeholder{
        font-weight: normal;
        color:#999999;
    }
    :-ms-input-placeholder{
        font-weight: normal;
        color:#999999;
    }
    .setUp .myBudget .clear{
        width:.36rem;
        height:.36rem;
        position: absolute;
        right:.22rem;
        top:50%;
        margin-top:-.18rem;
    }
    .estimate{
        position: absolute;
        height:.42rem;
        background-color:#F2B643;
        border-radius: 3px;
        line-height:.42rem;
        padding-left:.2rem;
        padding-right:.2rem;
        font-size:.22rem;
        top:.76rem;
        left:0.36rem;
    }
    .estimate span{
        position: relative;
        z-index: 1;
        color:#fff;
    }
    .estimate span strong{
        display: inline-block;
        width:.2rem;
    }
    .estimate:before{
        content:'';
        width:.28rem;
        height:.28rem;
        background-color:#F2B643;
        position: absolute;
        top:-.05rem;
        left:50%;
        margin-left:-.14rem;
        transform: rotate(45deg);
    }
    .setUp .next{
        width:6.5rem;
        height:.9rem;
        margin:.88rem auto .3rem;
        font-size:.34rem;
        line-height:.9rem;
        text-align: center;
        color:#fff;
        border-radius: 4px;
    }
    .setUp #click_btn.used{
        background-color: #F2B643;
    }
    .setUp #click_btn.unused{
        background-color: #f8daa1;
    }
    .dreamItem.activedDream{
        border:1px solid #eda835;
        color:#eda835;
    }
</style>