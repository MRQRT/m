<template>
	<div class="load" ref="load">
      <!--跳转二级路由时控制一级路由视图显示与否-->
      <div class="info-list"  v-show="isShow">
        <head-top headTitle='资讯列表' class="header">
          <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
        </head-top>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false"  ref="loadmore" @top-status-change="handleTopChange" class="loadmore">
            <div slot="top" class="mint-loadmore-top">
                <whale :top-status="topStatus">
                </whale>
            </div>
            <section  v-for="item in list" class="list" :key="item.id">
                <router-link :to="{path:'infoList/infoDetail', query:{id:item.id,title:item.title}}" class="content" tag="div">
                  <section :style="{ backgroundImage: 'url(' + item.imageUrl + ')' }" class="listImg"></section>
                  <p class="title">{{item.title}}</p>
                  <p class="time">{{item.createTime | formatTime}}</p>
                </router-link>
            </section>
        </mt-loadmore>
      </div>
     <transition name="router-slid" mode="out-in">
       <router-view></router-view>
     </transition>
   </div>
</template>
<script>
import headTop from '../../components/header/head.vue';
import whale from '../../components/whale/whale.vue';
import { queryNewsPager } from '@/service/getData';
export default {
	  data() {
		  return {
            searchCondition: {  //分页属性
                     pageNo: 1,  
                   pageSize: 7
            },//接口加载数据时需要
			                 list: [],
                  allLoaded: false, //上拉加载是否加载完毕
                     isShow: true, //二级路由一级路由页面内容显示与否
                      false: false,
                      pages: null,  //总页数
                  topStatus: null,
        }
    },
    created() {
       this.refresh();
    },
    mounted() {   
      if(document.querySelector('.infodetail')){
         this.isShow=false;
        }//以此避免刷新时一级二级同时显示的问题
    },
    watch:{
        $route(to,from){
            this.watchRouter(to,from);
        }
    },
    filters:{
       formatTime(val){
            if(!val) return;
            if(new Date(val).toDateString()===new Date().toDateString()){
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
        },
        setShort(val){
          if(val.length>16){
            return val.substring(0,16)+'...'
          }else{
            return val;
          }
        }
    },
    methods: {
      //返回上一页
      goBack(){
        window.toApp();
        this.$router.go('-1');
      },
        handleTopChange(status) {
            this.topStatus = status;
        },
        loadTop(){ //下拉刷新
            var dv=document.querySelector('.hasBottom');
            if(dv){
              dv.parentNode.removeChild(dv)
            }

            this.allLoaded=false;

            const that=this;
            //下拉的当前时间
            const stamp1 = new Date().getTime();
            //数据返回后的当前时间
            const stamp2 = that.refresh();
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
        },
        async refresh(){ //下拉刷新
            this.searchCondition.pageNo=1;
            var res=await queryNewsPager(this.searchCondition.pageNo,this.searchCondition.pageSize);
            if(res.code==100){
                var timestamp1 = new Date().getTime();
                this.list=res.content.list;
                this.pages=res.content.pages;
                if(this.searchCondition.pageNo>=this.pages){
                   this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                }
            }
            return timestamp1;
        },
        async loadMore(){  
            //  上拉触发分页查询
            this.searchCondition.pageNo=this.searchCondition.pageNo+1;
            var res=await queryNewsPager(this.searchCondition.pageNo,this.searchCondition.pageSize)
            if(res.code==100){
              this.list=this.list.concat(res.content.list);
              if(this.searchCondition.pageNo>=this.pages){
                   this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
              }
            }
        },
        changeView() {
            this.isShow=false;
        },
        setData() {
            this.isShow=true;
        },
        watchRouter(to,from) {
            if(from.path=='/infoList/infoDetail'){
                this.setData();
            }else if(to.path=='/infoList/infoDetail'){
                this.changeView();
            }
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
        document.querySelector('.info-list').appendChild(p)
      }
    },
    components: {
       headTop,
       whale
    }
}
</script>
<style scoped>
  .load {
    width:100%;
    background-color: #fff;
    padding-top: .88rem;
  }
  ul{
    margin-top:0.88rem;
  }
  .listImg {
  	width:2.3rem;
  	height:1.3rem;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .title {
    width:5.6rem;
  	padding-left:.18rem;
  	font-size:0.32rem;
    margin-top:-.05rem;
    height:0.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .time {
  	position:absolute;
  	bottom:0.3rem;
  	left:2.14rem;
  	font-size:0.24rem;
  	color:#A2A2A2;
    padding-left: .65rem;
  }
   .time:before {
   	 content:'';
   	 width:0.24rem;
   	 height:0.24rem;
   	 background:url('../../images/timeIco.png');
   	 background-size:100% 100%; 
   	 position:absolute; 
   	 left:.3rem;
   	 top:0.02rem;
   }
  .list {
  	height:1.9rem;
    padding:.3rem .28rem 0 .26rem;
  	position:relative;
  }
  .list div{
    border-bottom:1px solid #EFEFEF;
    height:1.6rem;
  }
  .content {
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
    -webkit-transition: all .4s;
    -moz-transition: all .4s;
    -o-transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    -webkit-transform: translate3d(2rem, 0, 0);
    -moz-transform: translate3d(2rem, 0, 0);
    -o-transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>
<style type="text/css">
  .mint-loadmore-top{
    height: .88rem;
  }
  #jingyu{
    height: 0;
  }
</style>