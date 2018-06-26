<template>
	<div class="newsList">
		<head-top :headTitle="headTitle" class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.go(-1)">
		</head-top>
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore" @top-status-change="handleTopChange">
      <div slot="top" class="mint-loadmore-top">
        <whale :top-status="topStatus">
        </whale>
      </div>

        <section class="lists">
          <div class="list" v-for="item in newsList" :id="item.id">
              <!--消息标题和时间-->
              <div class="firstLine">
                <!--标题-->
                <h4>{{item.title}}
                  <!-- <span class="unRead" v-show="!item.readed"></span> -->
                </h4>
                <!--时间-->
                <p>{{item.createTime | formatTime}}</p>
              </div>
              <!--营销活动图片展示-->
              <div class="marketActiv" v-show="marketShow">
                <img :src="item.picUrl" @click="goPage(item.hrefUrl)">
              </div>
              <!--摘要-->
              <div class="secondBrief">
                <p v-html="item.content">...</p>
              </div>
              <!--查看详情入口-->
              <div class="thirdEntry"  @click="goToNews(item.id)">
                <p><span>立即查看</span><span class="right"><img src="../../images/right_jian.png"></span></p>
              </div>
          </div>
        </section>
    </mt-loadmore>
  </div>
</template>

<script>
  import headTop from '../../components/header/head.vue';
  import whale from '../../components/whale/whale.vue';
  import { queryPageMsg } from '@/service/getData'
  import { formatDate } from '@/config/mUtils'
  export default {
    data(){
         return {
            searchCondition:{  //分页属性  
              pageNo:1,  
              pageSize:5 
            },//接口加载数据时需要
            marketShow:false, //营销活动图片是否展示
            headTitle:'', //本页面的标题
            type:null,//消息类型
            newsList:[], //请求到的消息数组
            false:false,//避免页面进来持续执行上拉操作
            allLoaded:false,//默认可以执行上拉操作
            pages:null, //一共多少页
            topStatus: null,
        }
    },
    mounted() {
         this.setTitle();
         this.queryPageMsg();
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
      handleTopChange(status) {
        this.topStatus = status;
      },
      goPage(href){ //点击营销图片进入介绍
        window.location.href='https://'+href
      },
      goToNews(id){  //点击消息进入相应详情页面
        if(this.type==3){  //如果是金豆收取方面的消息,则进入生金页面
            this.$router.push({
              path:'/benefit',
              query:{
                id:id
              }
          })
          return;
       }
        this.$router.push({
          path:'/newsDetail',
          query:{
                id:id
            }
       })
    },
      setTitle(){   //设置标题
        var id=this.$route.query.id;
        this.type=id;
        switch(id){
          case 0:
          case '0':
          this.headTitle='新闻资讯';
          break;
          case 1:
          case '1':
          this.headTitle='系统公告';
          break;
          case 2:
          case '2':
          this.marketShow=true;
          this.headTitle='营销活动';
          break;
          case 3:
          case '3':
          this.headTitle='金豆收取';
       }
    },
      async queryPageMsg(){  //页面初始化加载数据(下拉刷新)
        this.searchCondition.pageNo=1;
        var res=await queryPageMsg(this.type,this.searchCondition.pageNo,this.searchCondition.pageSize);
        if(res.code==100){
          var timestamp1 = new Date().getTime();
          this.newsList=res.content.list;
          this.pages=res.content.pages;
          if(this.searchCondition.pageNo>=this.pages){
               this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
          }
        }
        return timestamp1;
    },
      async loadMore(){  //页面上拉加载数据
        this.searchCondition.pageNo=this.searchCondition.pageNo+1;
        var res=await queryPageMsg(this.type,this.searchCondition.pageNo,this.searchCondition.pageSize);
        if(res.code==100){
              this.newsList=this.newsList.concat(res.content.list);
              if(this.searchCondition.pageNo>=this.pages){
               this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
             }
        }
    },
      loadTop(){  //下拉刷新
            var dv=document.querySelector('.hasBottom');
            if(dv){
                dv.parentNode.removeChild(dv)
            }
            this.allLoaded=false;

            const that=this;
            //下拉的当前时间
            const stamp1 = new Date().getTime();
            //数据返回后的当前时间
            const stamp2 = that.queryPageMsg();
            //new Promise 实例化，接受返回值 
            const promise = new Promise(function (resolve, reject) {
                return resolve(stamp2);
            })
            //实例.then拿到返回值，将两个时间作比较，小于1.5秒，延长到1.5秒，再暂停喷水动画，大于1.5秒，直接暂停动画
            promise.then(function(value){
                if(Number(value)-Number(stamp1)<1.5*1000){
                    setTimeout(function(){
                        that.$refs.loadmore.onTopLoaded();
                    },(1.2*1000-(Number(value)-Number(stamp1))))
                }else{
                    that.$refs.loadmore.onTopLoaded();
                }
              })
    },
      loadBottom(){  //上拉加载
        var that = this;
        setTimeout(function(){
            that.loadMore();
            that.$refs.loadmore.onBottomLoaded();
        },800)
    }
},
   updated(){
     if(this.allLoaded){
        //创建标签 提示内容已到底部 加载完毕
        var dv=document.querySelector('.hasBottom');
        if(dv){
          dv.parentNode.removeChild(dv)
        }
        var p=document.createElement('p');
        p.classList.add('hasBottom')
        p.innerHTML='已经到底了~';
        p.style.fontSize='0.24rem';
        p.style.color = '#999999';
        p.style.width='100%';
        p.style.height='0.8rem';
        p.style.lineHeight ='0.8rem';
        p.style.textAlign = 'center';
        document.querySelector('.newsList').appendChild(p)
     }
   },
   components:{
     headTop,
     whale
   }
}
</script>

<style scoped>
    .newsList{
      background-color: #F5F5F5;
      padding-top:.88rem;
      min-height:100vh;
    }
   .newsList .list{
      background-color: #fff;
      padding:.4rem .3rem 0;
      margin-top:.2rem;
   }
   .newsList .list .firstLine{
      display: flex;
      display: -webkit-flex;
      display: -moz-flex;
      display: -o-flex;
      height:.32rem;
      line-height:.32rem;
   }
   .list .firstLine h4{
      -webkit-flex:6;
      -moz-flex:6;
      -o-flex:6;
      flex:6;
      font-size:.3rem;
      color:#333333;
      position: relative;
   }
   /*.list .firstLine h4 .unRead{
      width:.1rem;
      height:.1rem;
      background-color: red;
      position: absolute;
      top:0.15rem;
      left:-.12rem;
      border-radius: 100%;
   }*/
   .list .firstLine p{
      -webkit-flex:1;
      -moz-flex:1;
      -o-flex:1;
      flex:1;
      font-size:.2rem;
      color:#999999;
      text-align: right;
   }
   .list .marketActiv{
      margin-top:.3rem;
   }
   .list .marketActiv img{
      width:100%;
      height:2.5rem;
      display: block;
   }
   .newsList .list .secondBrief{
      padding-top:.24rem;
      padding-bottom:.28rem;
      font-size:.22rem;
      color:#999999;
      border-bottom: .01rem solid #EEEEEE;
   }
   .newsList .list .secondBrief p{
      line-height:.52rem;
   }
   .newsList .list .thirdEntry{
      height:.92rem;
      line-height: .92rem;
      font-size:.26rem;
      color:#333333;
   }
   .newsList .list .thirdEntry img{
      width:.13rem;
      height:.24rem;
   }
   .newsList .list .thirdEntry .right{
     float: right;
   }
</style>