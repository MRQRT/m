<template>
	<div class="newest">
		<head-top headTitle='我的动态' class="head-top">
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goBack">
		</head-top>
		<!--主要内容区域-->
		<div class="newest-content">
			<!--总共收取-->
		    <div class="total-gotted">
		  	   <h4 class="total-title">累计收取(克)</h4>
		  	   <p class="total-count">{{tradeTotalWeight}}</p>
		    </div>
		    <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore" class="loadmore">
		    	<!--收取黄金记录-->
		    	<div class="gotted-lists">
		    		<p v-for="item in comments" class="list" v-if="item.status==1">
		    			<strong>我收取{{item.weight}}g</strong>
		    			<span>{{item.harvestTime | formatTime}}</span>
		    		</p>
		    	</div>
           </mt-loadmore>
		</div>
	</div>
</template>

<script>
	import headTop from '../../components/header/head.vue';
	import { queryInterest,queryAllInterest } from '@/service/getData';
	export default {
		data(){
			return {
				searchCondition: {  //分页属性
                     pageNo: 1,  
                   pageSize: 11
                },
                allLoaded: false, //上拉加载是否加载完毕
                false: false,
				comments: [],//收取明细
				pages: null,  //总页数
				tradeTotalWeight:null //交易总克重
			}
		},
		mounted() {
			this.queryAllInterest();
			this.queryInterest();
		},
		filters:{
			formatTime(val){
				var arr = val.split(' ')[0].split('-');
				return arr[1]+'-'+arr[2];
			}
		},
		methods:{
			//返回按钮
			goBack(){
				window.toApp();
				this.$router.go(-1);
			},
			//请求收益明细列表
			async queryInterest(){
				this.searchCondition.pageNo=1;
				var res=await queryInterest(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.comments=res.content.list;
					this.pages=res.content.pages;
					if(this.searchCondition.pageNo>=this.pages){
						this.allLoaded=true;
					}
				}
			},
			loadBottom(){
				var that = this;
				setTimeout(function(){
					that.loadMore();
					that.$refs.loadmore.onBottomLoaded();
				},800)
			},
			async loadMore(){
				this.searchCondition.pageNo=this.searchCondition.pageNo+1;
				var res=await queryInterest(this.searchCondition.pageNo,this.searchCondition.pageSize);
				if(res.code==100){
					this.comments=this.comments.concat(res.content.list);
					if(this.searchCondition.pageNo>=this.pages){
                       this.allLoaded=true;  //数据加载完，bottomMethod则不再执行
                    }
				}
			},
			//查询收取总克重
			async queryAllInterest(){
				var res=await queryAllInterest();
				if(res.code==100){
					this.tradeTotalWeight=res.content.interest;
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
				document.querySelector('.newest-content').appendChild(p)
			}
		},
		components:{
			headTop
		}
	}
</script>

<style scoped>
	*{
	   	margin: 0;
	   	padding: 0;
		box-sizing: border-box;
		font-family:PingFang-SC-Regular;
	}
    .newest{
    	padding-top:.88rem;
    }
    .newest .newest-content{
		padding-top:.8rem;
    }
    .newest-content .total-gotted .total-title,.newest-content .total-gotted .total-count{
    	text-align: center;
    }
	.newest-content .total-gotted .total-title{
		font-size:.28rem;
		color:#333333;
		height:.6rem;
	}
	.newest-content .total-gotted .total-count{
		font-size:.68rem;
		color:#EDA835;
		font-weight: bold;
	}
	.newest .newest-content .gotted-lists{
		padding:.78rem .28rem 0 .28rem;
		position: relative;
	}
	.newest-content .gotted-lists .list{
		height:.86rem;
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		display: -o-flex;
		display: -ms-flex;
		position: relative;
	}
	.newest-content .gotted-lists .list:before{
		content:'';
		width:.36rem;
		height:.36rem;
		background:url(../../images/gotted.png);
		background-size:100%;
		position: absolute;
		z-index:2;
	}
	.newest-content .gotted-lists .list:after{
		content:'';
		width:1px;
		height:.86rem;
		background-color: #EEEEEE;
		position: absolute;
		top:0;
		left:0.18rem;
		z-index: 1;
	}
	.newest-content .gotted-lists .list strong{
		flex:2;
		-webkit-flex:2;
		-moz-flex:2;
		-ms-flex:2;
		-o-flex:2;
		font-size:.26rem;
		color:#333333;
		padding-left:.6rem;
		font-weight: normal;
	}
	.newest-content .gotted-lists .list span{
		flex:1;
		-webkit-flex:1;
		-moz-flex:1;
		-ms-flex:1;
		-o-flex:1;
		text-align: right;
		color:#999999;
		font-size:.24rem;
	}
</style>