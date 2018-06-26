<template>
	<div class="messCenter">
		<head-top headTitle='消息中心' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
      <img slot="custom" src="../../images/blackSetting.png" class="custom" style="top:0.15rem;" @click="$router.push('/setNews')">
    </head-top>
    <section class="messCore">
      <!--每类消息里面有未读的消息，有小点提示，不显示数字，消息详情里未读显示小点，点击每条则小点消失-->

      <div @click="$router.push({path:'/newsList',query:{id:item.msgType}})" class="perMess" v-for="(item,index) in newsList" :key="item.msgType">
          <div class="perMess-left">
            <img :src="newsImages[index]">
            <!--消息个数小提示,需要显示条数与否-->
            <div class="countTip" v-if="item.unread"></div>
          </div>
          <div class="perMess-right">
            <p class="newType"><span class="newType-left">{{item.name}}</span><span class="newType-right">{{item.dateTime | formatTime}}</span></p>
            <p class="newsLink">{{item.title}}</p>
          </div>
      </div>

    </section>
  </div>
</template>
<script>
  import headTop from '../../components/header/head.vue';
  import { queryMessagMain } from '@/service/getData';
  import news1 from '@/images/news1.png';
  import news2 from '@/images/news2.png';
  import news3 from '@/images/news3.png';
  import news4 from '@/images/news4.png';
  import { formatDate } from '@/config/mUtils';
	export default {
		data(){
			return {
				 newsList:[], //消息
         newsImages:[news2,news1,news4,news3] //各类消息的标识图片
			}
		},
		mounted() {
        this.queryMessagMain();
		},
    filters:{
        formatTime(val){
            if(!val) return;
            var theTime=formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')
            if(val.split(' ')[0]==theTime.split(' ')[0]){
              //同一天内
              var arr=val.split(' ');
              var timeArr=arr[1].split(':');
              timeArr.pop();
              timeArr=timeArr.join(':');
              return timeArr;
           }else{  //不是同一天内
              var arr=val.split(' ');
              var timeArr=arr[0].split('-');
              timeArr.shift();
              timeArr=timeArr.join('-');
              return timeArr;
           }
        }
    },
		methods:{
        async queryMessagMain(){  //请求消息
            var res=await queryMessagMain();
            if(res.code==100){
              this.newsList=res.content;
            }
        },
        goBack(){
          window.toApp();
          this.$router.go(-1)
        }
	 },
		components:{
			headTop
		}
	}
</script>

<style scoped>
  .messCenter{
    width:100%;
    background-color: #F5F5F5;
    min-height:100vh;
    padding-top:.88rem;
  }
  .messCenter .custom{
    width:.6rem;
    height:.6rem;
  } 
  .messCenter .messCore{
    background-color: #fff;
    width: 100%;
  }
  .messCenter .messCore .perMess{
    width:100%;
    height:1.4rem;
    border-bottom:1px solid #EEEEEE;
    padding:.3rem;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
  }
  .messCore .perMess img{
    width:.8rem;
    height:.8rem;
  }
  .messCore .perMess .perMess-left{
    position: relative;
    width: 16%;
  }
  .perMess .perMess-left .countTip{
    position: absolute;
    width:11px;
    height:11px;
    background-color: #FF6D39;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -o-border-radius: 50%;
    top:-.11rem;
    right: .2rem;
  }
  .messCore .perMess .perMess-right{
    width: 84%;
  }
  .perMess .perMess-right .newType{
    height:.5rem;
    display: flex;
    display: -webkit-flex;
    display: -o-flex;
    display: -moz-flex;
  }
  .perMess .perMess-right .newType-left{
    width:66%;
    font-size:.3rem;
    color:#333333;
    font-weight: bold;
  }
  .perMess .perMess-right .newType-right{
    width:34%;
    font-size:.2rem;
    color:#999999;
    text-align: right;
    padding-top:.04rem;
  }
  .perMess .perMess-right .newsLink{
    width:5.84rem;
    font-size:.24rem;
    color:#999999;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>