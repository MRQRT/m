<template>
	<div class="messSet">
		<head-top headTitle='设置' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
		<section class="setCenter">
        <!-- <p>您可以在“设置”-“通知”功能中,开启或关闭新消息通知</p>  -->
        <ul class="newLists" v-show="hasDone">
            <!-- <li style="margin-bottom:.2rem;">
                <span class="left">新消息通知</span>
                <span class="right">未开启</span>
            </li> -->
            <li>
                <span class="left">黄金资讯</span>
                <span class="right right1"><mt-switch v-model="news" @change="putConfig"></mt-switch></span>
            </li>
            <li>
                <span class="left">系统公告</span>
                <span class="right right1"><mt-switch v-model="Bulletin" @change="putConfig"></mt-switch></span>
            </li>
            <li>
                <span class="left">营销活动</span>
                <span class="right right1"><mt-switch v-model="activity" @change="putConfig"></mt-switch></span>
            </li>
            <li>
                <span class="left">金豆收取</span>
                <span class="right right1"><mt-switch v-model="gather" @change="putConfig"></mt-switch></span>
            </li>
       </ul> 
    </section>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
  import { queryMessageConfig, putMessageConfig} from '@/service/getData.js'

	export default {
		data(){
			return {
				    news: null,
            Bulletin: null,
            activity: null,
            gather: null,
            id: null,
            hasDone:false //数据请求完之后再渲染页面
			}
		},
		mounted() {
			var hgt=window.innerHeight;
			document.querySelector('.messSet').style.minHeight=hgt+'px';
      this.messageConfig();
		},
		methods:{
            async messageConfig(){
                const res = await queryMessageConfig();
                if(res.code==100){ //0是开 1是关
                    res.content.noticeGoldNews == 0 ? this.news = true : this.news = false;
                    res.content.noticeActivity == 0 ? this.activity = true : this.activity = false;
                    res.content.noticeGoldBeanMature == 0 ? this.gather = true : this.gather =false;
                    res.content.noticeSystem == 0 ? this.Bulletin = true:this.Bulletin = false
                    this.id=res.content.id;
                    this.hasDone=true;
                }
            },
            async putConfig(){
                const res = await putMessageConfig(this.id, this.news?0:1, this.Bulletin?0:1, this.activity?0:1, this.gather?0:1);
                if(res.code==100){
                    this.messageConfig()
                }
            },
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
    .messSet{
      padding-top:.88rem;
      background-color: #F5F5F5;
    }
   .messSet .setCenter p{
     height:.64rem;
     line-height:.64rem;
     font-size:.24rem;
     color:#EDA835;
     background-color:#FEF8EC;
     padding-left: .66rem;
     position: relative;
   }
   .messSet .setCenter p:before{
      content:'';
      width:.24rem;
      height:.24rem;
      background:url(../../images/mark.png);
      background-size: 100%;
      position: absolute;
      left:0.3rem;
      top:50%;
      margin-top:-.12rem;
   }
   .newLists li{
        height:1.12rem;
        background-color: #fff;
        border-bottom:1px solid #EFEFEF;
        list-style: none;
        line-height: 1.12rem;
        padding-left:.3rem;
        padding-right:.3rem;
        font-size:.28rem;
    }
    .newLists li .left{
        float:left;
    }
    .newLists li .right{
        float:right;
    }
    .newLists li .right1{
        margin-top:.2rem;
    }
    
</style>
<style>
   .mint-switch-input:checked + .mint-switch-core{
        border-color: #f2b643;
        background-color: #f2b643;
    }
</style>