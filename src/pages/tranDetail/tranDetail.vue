<template>
	<div class="tranDetail">
		<head-top headTitle='交易明细'>
			<img slot='head_goback' src='../../images/back.png' class="head_goback" @click="$router.push('/myGold')">
		</head-top>
        <div class="tabbar">
            <span :class="{'selected':selected=='all'}" @click="tranOrder('all')">全部</span>
            <span :class="{'selected':selected=='buySell'}" @click="tranOrder('buySell')">黄金买卖</span>
            <span :class="{'selected':selected=='buyBack'}" @click="tranOrder('buyBack')">黄金回购</span>
            <span :class="{'selected':selected=='tijin'}" @click="tranOrder('tijin')">爱有金</span>
        </div>
        <mt-loadmore  :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" :bottomPullText="bottomPullText" ref="loadmore" @top-status-change="handleTopChange">
            <div slot="top" class="mint-loadmore-top">
                <whale :top-status="topStatus">
                </whale>
            </div>
            <!-- 所有业务交易明细列表 -->
            <div class="allBox" v-show="selected=='all'">
                <div class="list_item" v-for="(item,index) in dataList1" @click="toInfo(item.id,item.type)" :key="index">
                    <div class="item_top">
                        <!--买、卖、存、挂单、生息交易明细业务标题-->
                        <span class="item_top_left" v-if="item.type==1 || item.type==2 || item.type==4 || item.type==7 || item.type==9 || item.type==10">{{(item.type==1 || item.type==9) ? '黄金买入' : ((item.type==2 || item.type==10) ? '黄金卖出' : (item.type==4 ? '黄金回购' : '生息' ))}}</span>
                        <!--爱有金标题-->
                        <span class="item_top_left" v-if="item.type==5">爱有金-{{item.productName}}</span>
                        <!--定投标题-->
						<span class="item_top_left" v-if="item.type==3">定投买入-{{item.productName}}</span>
                        <!--定期标题-->
						<span class="item_top_left" v-if="item.type==6">定期买入-{{item.productName}}</span>
						<!--赠金标题-->
						<span class="item_top_left" v-if="item.type==8">赠金-{{item.productName}}</span>
                        <!--买金、卖金、生息的克重金额显示-->
						<span class="item_top_right" v-if="item.type===1 || item.type==2 || item.type==7" :class="{'failColor':item.status==2}">{{contains(Rcolor,item.type)?'-':'+'}}{{item.weight}}g</span>
                        <!--赠金的克重显示-->
                        <span class="item_top_right" v-if="item.type==8" :class="{'failColor':item.status==2?true:false}">{{contains(Rcolor,item.type)?'-':'+'}}{{item.weight ||item.realNetWeight || item.applyWeight}}g</span>
                        <!--挂单的克重金额显示-->
						<span class="item_top_right" v-if="item.type==9||item.type==10" :class="{'failColor':item.status==2||item.status==3||item.status==4}">{{contains(Rcolor,item.type)?'-':'+'}}{{item.weight}}g</span>
                        <!--爱有金的克重金额显示-->
						<span class="item_top_right" v-if="item.type==5" :class="{'failColor':item.status==2 || item.status==5}">-{{item.weight}}g</span>
                        <!--回购的克重显示-->
						<span class="item_top_right" v-if="item.type==4" :class="{'failColor':item.status==1||item.status==5||item.status==9||item.status==10||item.status==12}">+{{item.weight ||item.realNetWeight || item.applyWeight}}g</span>
                        <!--定投显示克重或金额-->
						<span class="item_top_right" v-if="item.type==3" :class="{'failColor':item.status==2}">+{{item.weight ||item.amount}}{{item.weight?'g':'元'}}</span>
                    </div>
                    <div class="item_bottom">
                        <!--交易时间-->
                        <span class="item_bottom_left">{{item.createTime}}</span>
                        <!--爱有金状态-->
						<span class="item_bottom_right" v-if="item.type==5">{{item.status==1 ? '待发货' : (item.status==2 ? '付款失败' : (item.status==3 ? '已发货' :(item.status==4 ? '已签收' :(item.status==5 ? '已取消' : '待支付'))))}}</span>
                        <!--定投状态-->
						<span class="item_bottom_right" v-if="item.type==3">{{item.status==0 ? '执行成功' :'执行失败'}}</span>
                        <!--卖金状态-->
						<span class="item_bottom_right" v-if="item.type==2">成功</span>
                        <!--买金状态-->
						<span class="item_bottom_right" v-if="item.type==1">{{item.status==0 ? '处理中':(item.status==1?'成功':'失败')}}</span>
                        <!--任务金或生息状态-->
						<span class="item_bottom_right" v-if="item.type==8 || item.type==7">{{item.status==0 ? '未收取' :'已收取'}}</span>
                        <!--挂单买入卖出状态-->
						<span class="item_bottom_right" v-if="item.type==9 || item.type==10">{{item.status==0 ?'等待执行':(item.status==1?'执行成功':(item.status==2?'已到期':(item.status==3?'已中止':'已失败')))}}</span>
                        <!--回购状态-->
                        <span class="item_bottom_right" v-if="item.type==4">{{item.status==0?'审核中':(item.status==1?'已取消':(item.status==2?'审核中':(item.status==3?'物流中':(item.status==4?'检验中':(item.status==5?'已取消':(item.status==6?'待确认':(item.status==8?'已完成':(item.status==9?'已取消':(item.status==10?'已取消':(item.status==11?'物流中':'已取消'))))))))))}}</span>
                    </div>
                </div>
                <div class="allEmpty" ref='allEmpty' v-show="allEmpty&&selected=='all'"></div>
            </div>
            <!-- 黄金买卖业务交易明细 -->
            <div class="buySellBox" v-show="selected=='buySell'">
                <div class="list_item" v-for="item in dataList2" @click="toDetailInfo(item.id,item.type)">
                    <div class="item_top">
                        <!--买、卖、挂单、生息交易明细业务标题-->
                        <span class="item_top_left" v-if="item.type==1 || item.type==2 || item.type==7 || item.type==9 || item.type==10">{{(item.type==1 || item.type==9) ? '黄金买入' : ((item.type==2 || item.type==10) ? '黄金卖出' : '生息')}}</span>           
                        <!--赠金标题-->
						<span class="item_top_left" v-if="item.type==8">赠金-{{item.productName}}</span>
                        <!--定投标题-->
						<span class="item_top_left" v-if="item.type==3">定投-{{item.productName}}</span>
                        <!--非定投非挂单的克重金额显示-->
						<span class="item_top_right" v-if="item.type!=3&&item.type!=9&&item.type!=10" :class="{'failColor':item.status==2?true:false}">{{contains(Rcolor,item.type)?'-':'+'}}{{item.weight ||item.realNetWeight || item.applyWeight}}g</span>
                        <!--挂单的克重金额显示-->
						<span class="item_top_right" v-if="item.type==9||item.type==10" :class="{'failColor':item.status==2||item.status==3||item.status==4?true:false}">{{contains(Rcolor,item.type)?'-':'+'}}{{item.weight ||item.realNetWeight || item.applyWeight}}g</span>
                        <!--定投显示克重或金额-->
						<span class="item_top_right" v-if="item.type==3"  :class="{'failColor':item.status==1?true:false}">{{item.weight?'+':'-'}}{{item.weight ||item.amount}}{{item.weight?'g':'元'}}</span>
                    </div>
                    <div class="item_bottom">
                        <!--交易时间-->
                        <span class="item_bottom_left">{{item.createTime}}</span>
                        <!--卖金状态-->
						<span class="item_bottom_right" v-if="item.type==2">成功</span>
                        <!--买金状态-->
						<span class="item_bottom_right" v-if="item.type==1">{{item.status==0 ? '处理中':(item.status==1?'成功':'失败')}}</span>
                        <!--任务金或生息状态-->
						<span class="item_bottom_right" v-if="item.type==8 || item.type==7">{{item.status==0 ? '未收取' :'已收取'}}</span>
                        <!--挂单买入卖出状态-->
						<span class="item_bottom_right" v-if="item.type==9 || item.type==10">{{item.status==0 ?'等待执行':(item.status==1?'执行成功':(item.status==2?'已到期':(item.status==3?'已中止':'已失败')))}}</span>
                        <!--定投状态-->
						<span class="item_bottom_right" v-if="item.type==3">{{item.status==0?'成功':'失败'}}</span>
                    </div>
                </div>
                <div class="extrEmpty" ref='extrEmpty' v-show="extrEmpty&&selected=='buySell'"></div>
            </div>
            <!-- 黄金回购交易明细 -->
            <div class="buyBackBox" v-show="selected=='buyBack'">
                <div class="list_item" v-for="(item,index) in dataList3" @click="toDetailInfo(item.id,4)" :key="index">
                    <div class="item_top">
                        <span class="item_top_left">黄金回购</span>
                        <span class="item_top_right" :class="{'failColor':item.status==1||item.status==5||item.status==9||item.status==10||item.status==11||item.status==12?true:false}">+{{item.applyWeight}}g</span>
                    </div>
                    <div class="item_bottom">
                        <span class="item_bottom_left">{{item.createTime}}</span>
                        <span class="item_bottom_right">{{item.status==0?'审核中':(item.status==1?'已取消':(item.status==2?'审核中':(item.status==3?'物流中':(item.status==4?'检验中':(item.status==5?'已取消':(item.status==6?'待确认':(item.status==8?'已完成':(item.status==9?'已取消':(item.status==10?'已取消':(item.status==11?'物流中':'已取消'))))))))))}}</span>
                    </div>
                </div>
                <div class="buyBackEmpty" ref='buyBackEmpty' v-show="buyBackEmpty&&selected=='buyBack'"></div>
            </div>
            <!-- 爱有金交易明细 -->
            <div class="tijinBox" v-show="selected=='tijin'">
                <div class="list_item"  v-for="(item,index) in dataList4" @click="toDetailInfo(item.id,5)" :key="index">
                    <div class="item_top">
                        <span class="item_top_left">爱有金-{{item.name}}</span>
                        <span class="item_top_right"  :class="{'failColor':item.status==2||item.status==5?true:false}">-{{item.weight*item.quantity}}g</span>
                    </div>
                    <div class="item_bottom">
                        <span class="item_bottom_left">{{item.createTime}}</span>
                        <span class="item_bottom_right">{{item.status==1 ? '待发货' : (item.status==2 ? '付款失败' : (item.status==3 ? '已发货' :(item.status==4 ? '已签收' :(item.status==5 ? '已取消' : '待支付'))))}}</span>
                    </div>
                </div>
                 <div class="tijinEmpty" ref='tijinEmpty' v-show="tijinEmpty==true&&selected=='tijin'"></div>
            </div>
        </mt-loadmore>
	</div>
</template>
<script type="text/javascript">
	import back from '@/images/back.png'
	import pullDown from '@/images/pullDown.png'
    import { queryCommonDemandOrder,queryPhysical,queryRecycleOrder,queryCommonOrder} from '@/service/getData'
    import {mapState} from 'vuex'
    import { getRem } from '@/config/mUtils.js'
    import whale from '../../components/whale/whale.vue'
    import headTop from '../../components/header/head.vue'
    import { Loadmore } from 'mint-ui'
    import trade from '../../json/tradeAll.json'
	export default{
		data () {
			return{
                rem: getRem(),
                clientHeight: document.documentElement.clientHeight,
                tijinEmpty: false,//false表示提金空
                buyBackEmpty: false,//false表示存金空
                extrEmpty: false,//false表示黄金交易空
                allEmpty: false,//false表示总的订单空
                selected: 'all',
                topStatus: null,
                allLoaded: false,
                bottomPullText: '上拉加载',
                Gcolor: [1,3,4,6,7,8,9],//所有明细之克重颜色显示(+)
                Rcolor: [2,5,10],  //(-)
                pages_1: null, //总定单总页数
                pages_2: null, //黄金交易总页数
                pages_3: null, //回购总页数
                pages_4: null, //爱有金总页数
                searchCondition_1:{//总订单页面配置项
                    pageNo: 1,
                    pageSize: 10,
                },
                searchCondition_2:{//黄金交易明细页面配置项
                    pageNo: 1,
                    pageSize: 10,
                },
                searchCondition_3:{//回购页面配置项
                    pageNo: 1,
                    pageSize: 10,
                },
                searchCondition_4:{//爱有金页面配置项
                    pageNo: 1,
                    pageSize: 10,
                },
                dataList1:[],//所有订单数据
                dataList2:[],//黄金买卖订单数据
                dataList3:[],//黄金回购定单数据
                dataList4:[],//爱有金订单数据
			}
		},
		mounted(){
            this.$refs.tijinEmpty.style.height=this.clientHeight-(this.rem*1.76)+'px';
            this.$refs.buyBackEmpty.style.height=this.clientHeight-(this.rem*1.76)+'px';
            this.$refs.extrEmpty.style.height=this.clientHeight-(this.rem*1.76)+'px';
            this.$refs.allEmpty.style.height=this.clientHeight-(this.rem*1.76)+'px';
		},
		computed:{
			...mapState([
				'token'
            ])
        },
        filters:{
        	
        },
		methods:{
            //判断一数组中是否包含某元素
			contains(arr, obj) {  
                if(!arr) return false;
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            },
            //订单切换
            tranOrder(val){
                if(val=='all'){
                    this.selected=val
                    this.$refs.loadmore.onTopLoaded();
                }else if(val=='buySell'){
                    this.selected=val                    
                    this.$refs.loadmore.onTopLoaded();
                }else if(val=="buyBack"){
                    this.selected=val
                    this.$refs.loadmore.onTopLoaded();
                }else if(val=="tijin"){
                    this.selected=val
                    this.$refs.loadmore.onTopLoaded();
                }
            },
            //从所有交易明细进入详情
			toInfo(id,type){
				if(type==7 || type==8) return;
				if(type==5){ //查询提金详情
					this.$router.push({
						path:'/extractOrderDetail',
						query:{
							id:id,
						}
					})
					return;
				}
				if(type==4){ //查询存金详情
					this.$router.push({
						path:'/storOrderDet',
						query:{
                            id:id,
                            from:'tranDetail'
						}
					})
					return;
                }
				this.$router.push({
					path:'/tranDetailInfo',
					query:{
						id:id,
						type:type
					}
				})
            },
            //点击具体类别进入详情
			toDetailInfo(id,ca){
                if(ca==5){ //查询提金详情
					this.$router.push({
						path:'/extractOrderDetail',
						query:{
							id:id,
						}
					})
					return;
				}
				if(ca==4){ //查询存金详情
					this.$router.push({
						path:'/storOrderDet',
						query:{
                            id:id,
                            from:'tranDetail'
						}
					})
					return;
				}
				if(ca==7 || ca==8){ //没有赠金详情
					return;
				}
				this.$router.push({
					path:'/tranDetailInfo',
					query:{
						id:id,
						type:ca
					}
				})
			},
            //所有业务明细订单查询(刷新)
			async queryCommonOrder(){
				this.searchCondition_1.pageNo=1;
				var res=await queryCommonOrder(this.searchCondition_1.pageNo,this.searchCondition_1.pageSize);
				if(res.code==100){
                    if(res.content.list){
                        this.dataList1=res.content.list;
                        this.pages_1=res.content.pages;
                        this.allEmpty=false;
                    }else{
                        this.dataList1=[];
                        this.allEmpty=true;
                    }
				}
            },
            //所有业务明细订单查询(加载更多)
			async loadMoreQueryCommonOrder(){
                if(this.allEmpty)return
                this.searchCondition_1.pageNo=this.searchCondition_1.pageNo+1;
				var res=await queryCommonOrder(this.searchCondition_1.pageNo,this.searchCondition_1.pageSize);
				if(res.code==100){
                    this.dataList1=this.dataList1.concat(res.content.list);
					if(this.searchCondition_1.pageNo>=this.pages_1){
						// this.allLoaded=true;
					}
				}
			},
            //黄金买卖交易明细--刷新
			async queryCommonDemandOrder(){
				this.searchCondition_2.pageNo=1;
				var res=await queryCommonDemandOrder(this.searchCondition_2.pageNo,this.searchCondition_2.pageSize);
				if(res.code==100){
                    if(res.content.list){
                        this.dataList2=res.content.list;
					    this.pages_2=res.content.pages;
                        this.extrEmpty=false;
                    }else{
                        this.dataList2=[];
                        this.extrEmpty=true;
                    }
                    
				}
            },
            //黄金买卖更多订单查询--加载更多
			async loadMoreQueryCommonDemandOrder(){
                if(this.extrEmpty)return
				this.searchCondition_2.pageNo=this.searchCondition_2.pageNo+1;
				var res=await queryCommonDemandOrder(this.searchCondition_2.pageNo,this.searchCondition_2.pageSize);
				if(res.code==100){
					this.dataList2=this.dataList2.concat(res.content.list);
					if(this.searchCondition_2.pageNo>=this.pages_2){
						// this.allLoaded=true;
					}
				}
			},
            //查询用户回购订单列表(回购)--刷新
			async queryRecycleOrder(){
				this.searchCondition_3.pageNo=1;
				var res=await queryRecycleOrder(this.searchCondition_3.pageNo,this.searchCondition_3.pageSize);
				if(res.code==100){
                    if(res.content.list){
                        this.dataList3=res.content.list;
                        this.pages_3=res.content.pages;
                        this.buyBackEmpty=false;
                    }else{
                        this.dataList3=[];
                        this.buyBackEmpty=true;
                    }
				}
            },
             //查询用户回购订单列表(回购)--加载更多
			async loadMoreQueryRecycleOrder(){
                if(this.buyBackEmpty)return
                this.searchCondition_3.pageNo=this.searchCondition_3.pageNo+1;
				var res=await queryRecycleOrder(this.searchCondition_3.pageNo,this.searchCondition_3.pageSize);
				if(res.code==100){
                    this.dataList3=this.dataList3.concat(res.content.list);
					this.pages=res.content.pages;
					if(this.searchCondition_3.pageNo>=this.pages_3){
						// this.allLoaded=true;
					}
				}
            },
             //获取提金订单列表(爱有金)--刷新
			async queryPhysical(){ 
				this.searchCondition_4.pageNo=1;
                var res=await queryPhysical(this.searchCondition_4.pageNo,this.searchCondition_4.pageSize);
				if(res.code==100){
                    if(res.content.list){
                        this.dataList4=res.content.list;
					    this.pages=res.content.pages_4;
                        this.tijinEmpty=false
                    }else{
                        this.dataList4=[];
                        this.tijinEmpty=true
                    }
				}
            },
            //获取提金订单列表(爱有金)--加载更多
			async loadMoreQueryPhysical(){
                if(this.tijinEmpty)return
                this.searchCondition_4.pageNo=this.searchCondition_4.pageNo+1;
				var res=await queryPhysical(this.searchCondition_4.pageNo,this.searchCondition_4.pageSize);
				if(res.code==100){
                    this.dataList4=this.dataList4.concat(res.content.list);
					this.pages=res.content.pages;
					if(this.searchCondition_4.pageNo>=this.pages_4){
						// this.allLoaded=true;
					}
				}
            },
            //下拉刷新
            loadTop(){
                const vm = this
                if(this.selected=='all'){
                    this.queryCommonOrder()
                }else if(this.selected=='buySell'){
                    this.queryCommonDemandOrder();
                }else if(this.selected=='buyBack'){
                    this.queryRecycleOrder();
                }else if(this.selected=='tijin'){
                    this.queryPhysical();
                }
                setTimeout(function(){
                    vm.$refs.loadmore.onTopLoaded();
                },1000)
            },
            //上拉加载
            loadBottom(){
                const vm = this
                if(this.selected=='all'){
                    this.loadMoreQueryCommonOrder()
                }else if(this.selected=='buySell'){
                    this.loadMoreQueryCommonDemandOrder();
                }else if(this.selected=='buyBack'){
                    this.loadMoreQueryRecycleOrder();
                }else if(this.selected=='tijin'){
                    this.loadMoreQueryPhysical();
                }
                setTimeout(function(){
					vm.$refs.loadmore.onBottomLoaded();
				},1000)
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
		},
		updated(){

		},
		watch:{
			
		},
		activated: function () {  //用户有更改，需要重新加载列表
			if(!this.token||localStorage.getItem('needRender')){
                this.tijinEmpty=false//false表示提金空
                this.buyBackEmpty=false//false表示存金空
                this.extrEmpty=false//false表示黄金交易空
                this.allEmpty=false//false表示总的订单空
                this.selected='all'
                this.topStatus=null
                this.allLoaded=false
                this.dataList1=[]//所有订单数据
                this.dataList2=[]//黄金买卖订单数据
                this.dataList3=[]//黄金回购定单数据
                this.dataList4=[]//爱有金订单数据
            }
            this.queryCommonOrder();//查询所有交易明细列表
            this.queryCommonDemandOrder()//黄金买卖
            this.queryRecycleOrder()//回购
            this.queryPhysical()//爱有金
		},
		components: {
            whale,
            headTop
		}
	}
</script>
<style scoped lang="less">
@import "../../style/common.less";
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.tranDetail{
	width: 100%;
	min-height:100vh;
	background-color: #f5f5f5;
	position: relative;
    box-sizing: border-box;
    padding-top: .88rem; 
}
.tabbar{
    width: 100%;
    height: .9rem;
    line-height: .9rem;
    position: fixed;
    top: .88rem;
    background-color: #fff;
    .flex-simple;
    text-align: center;
    font-size: .3rem;
    color: @base-font-color2;
    z-index: 2;
    span:nth-child(1){
        text-align: left;
        flex: 1.1;
        padding-left: .3rem;
    };
    span:nth-child(2){
        flex: 1;
        
        };
    span:nth-child(3){
        flex: 1;
        
        };
    span:nth-child(4){
        flex: 1;
        
    }
}
.selected{
    .font-style(.34rem,#F2B643);
    position: relative;
    &:after{ 
        content: '';
        width: 80%;
        height: 3px;
        display: inline-block;
        background-color: #F2B643;
        position: absolute;
        bottom: 0px;
        left: 10%;
    }
}
.allBox,.buySellBox,.buyBack,.tijinBox{
    width: 100%;
}
.list_item{
    width: 100%;
    height: 1.34rem;
    background: #ffffff;
    padding: .1rem .3rem 0 .3rem;
    .item_top{
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        .font-style(.3rem,#333333);
        .item_top_left{
            float: left;
            font-weight: 500;
            width:60%;
            height: .6rem;
            overflow: hidden;
        }
        .item_top_right{
            width:40%;
            float: right;
            font-weight: 500;
            height: .6rem;
            text-align:right;
        }
    } 
    .item_bottom{
        width: 100%;
        height: .6rem;
        line-height: .3rem;
        .font-style(.24rem,#999999);
        .item_bottom_left{
            float: left;
            height:.34rem;
        }
        .item_bottom_right{
            float: right;
            height:.34rem;
        }
    }
}
.mint-loadmore-top{
    height: .88rem;
    position:relative;
}
.failColor{
    color: #999999;
}
.tijinEmpty{
    width: 100%;
    background-color: #F5F5F5;
    background-image: url(../../images/noExtract.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50%;
}
.buyBackEmpty{
     width: 100%;
    background-color: #F5F5F5;
    background-image: url(../../images/noBean.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50%;
}
.extrEmpty{
    width: 100%;
    background-color: #F5F5F5;
    background-image: url(../../images/tradeEmpty.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50%;
}
.allEmpty{
    width: 100%;
    background-color: #F5F5F5;
    background-image: url(../../images/noExtract.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50%;
}
</style>