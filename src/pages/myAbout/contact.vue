<template>
	<div class="contact">
		<head-top headTitle='联系方式' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<section class="contact-core">
			<div class="contactBanner"></div>
            <div class="p-container">
                <p><span class="left">微信公众号</span><span class="right">higidyh</span></p>
                <p><span class="left">黄金管家官方群2018</span><span class="right">673646474</span></p>
                <p><span class="left">黄金管家分析群2018</span><span class="right">556533099</span></p>
                <p class="last"><span class="left">客服电话</span><span class="right" @click="touchPhone()">4008-196-199</span></p>
                <p style="font-size: .3rem;display:block;"><span style="color:#666666;float:left;padding-left: .2rem;">公司地址</span><span style="font-size: .3rem;float:right;color:#333333;">北京市海淀区中关村SOHO B区1209</span></p>
            </div>
		</section>
        <div class="mask" v-show="telShow"></div>
        <!--拨打客服电话的小盒子-->
        <div class="bankTele" v-show="telShow">
            <h4>400-819-6199</h4>
            <div>
                <span class="cancelLeft" @click="telShow=false">取消</span>
                <span @click="goToTel('4008196199')"><a>呼叫</a></span>
            </div>
        </div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
  import { checkAgent } from '@/config/mUtils'
	export default {
		data(){
			return {
				  telShow: false,
        equipment: null//手机系统
			}
		},
		mounted() {
			var hgt=window.innerHeight;
			document.querySelector('.contact').style.height=hgt+'px';
            let agent=checkAgent();
            this.equipment=agent
		},
		computed:{
			
		},
		methods:{
            touchPhone(){
                if(this.equipment=="IOS"){
                    phone("400-819-6199");
                }else{
                    this.telShow=true
                }
            },
            //呼叫打电话
            goToTel(number){
                if(window.getPhonePer){
                    window.getPhonePer(number);
                }
                this.telShow=false;
            }
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
   .contact{
   	  width:100%;
   	  background-color: #F5F5F5;
   	  overflow-y: scroll;
   }
   .contact .contact-core{
   	  margin-top:.88rem;
   	  background-color: #fff;
   }
   .contact-core .contactBanner{
      width:7.5rem;
      height:2.4rem;
      background:url(../../images/contactBg.png);
      background-size: 100%; 
   }
   .contact .contact-core .p-container{
      padding:0 .3rem;
   }
   .contact .contact-core p{
      height:1.1rem;
      line-height:1.1rem;
      border-bottom:1px solid #F5F5F5;
      display: flex;
      display: -webkit-flex;
      display: -moz-flex;
      display: -o-flex;
   }
   .contact-core p .left{
      flex:1;
      -webkit-flex:1;
      -moz-flex:1;
      -o-flex:1;
      color:#666666;
      padding-left:.2rem;
      font-size:.3rem;
   }
   .contact-core p .right{
      flex:1;
      -webkit-flex:1;
      -moz-flex:1;
      -o-flex:1;
      color:#333333;
      text-align: right;
      font-size:.3rem;
      user-select:none;
      -webkit-user-select:none;
      -o-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
   }
   .contact-core .last{
     border:none;
   }
   /*遮罩*/
    .contact .mask{
      width:100%;
      height:100%;
      position: absolute;
      top:0;
      left:0;
      z-index: 200;
      background-color: rgba(0,0,0,.5);
    }
    /*拨打电话*/
    .contact .bankTele{
      width:4.92rem;
      background-color: #fff;
      border-radius:10px;
      -webkit-border-radius:10px;
      -moz-border-radius:10px;
      -o-border-radius:10px;
      left:50%;
      margin-left:-2.46rem;
      top:4.3rem;
      position: absolute;
      z-index: 250;
      padding-top:.4rem;
    }
    .contact .bankTele h4{
      font-size:.34rem;
      text-align: center;
    }
    .contact .bankTele div{
      margin-top:.4rem;
      border-top:1px solid #F3F3F3;
    }
    .contact .bankTele div span{
      width:48%;
      display: inline-block;
      text-align: center;
      height:.9rem;
      line-height:.9rem; 
      font-size:.32rem;
      color:#EDA835;
    }
    .contact .bankTele .cancelLeft{
      border-right:1px solid #F3F3F3;
    }
    .contact .bankTele a{
      display: inline-block;
      font-size:.32rem;
      color:#EDA835;
      text-decoration: none;
      padding: 0rem .8rem;
    }
</style>