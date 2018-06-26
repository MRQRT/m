<template>
	<div class="benifit-container">
	    <!--生金banner-->
	    <div class="benifitBanner" :style="{ backgroundImage: 'url('+ bg +')'}">
	        <!--黄金信息和收金豆信息-->
	        <div class="myGold-myReceive" v-show="login">
	        	<p class="myGold-myReceive-p1">我的黄金<span style="margin-left:.09rem;font-weight:bold;">:</span><span class="theWeight" style="font-size:.3rem;font-weight:bold;">{{goldWeight}}</span>g</p>
	        </div>
	        <!--消息提醒-->
	    	<div class="benifit-message" @click="goMessCenter">
	    		<span class="messCount" v-show="hasUnread"></span>
	    	</div>
	    	<!--生金攻略-->
	    	<div class="benifit-raiders" @click="help()"></div>
	        <!--注水区域生金时-->
	    	<div class="filling">
	    		<div id="mySpeedBall2">
	    			<!--可点击收取金豆时-->
	    			<img src="../../images/100.png" class="four" v-if='hasMature'>
	    			<img src='../../images/8.png' class="three"  v-if='hasMature'>
	    			<!--不可点击收取金豆时-->
	    			<img src="../../images/growing.png" style="width:1.5rem;height:1.5rem;" v-if="growing">
	    			<!--不可点击收取金豆时-->
	    			<img src="../../images/filingWater.png" style="width:1.51rem;height:1.5rem;" v-if="loginBuy">
	    		</div>
	    		<span class="rate" @click="rotate">{{text}}</span>
	    		<!--利息可收取的小手提示-->  
	    	    <span class="canGet" v-show="!growing && !loginBuy && text">可收取{{(canHarvest.weight*1000).toFixed(1) || '0.0'}}mg</span>
	    	    <!--预计可收取多少克-->
	    	    <span class="willing" v-show="hasWeight">预计收取{{(canHarvest.weight*1000).toFixed(1) || '0.0'}}mg</span>
	    	</div>
	    	<!--未持有黄金时图片展示-->
	    	<img :src="noMatureBg" style="width:6.05rem;height:4.68rem;position:relative;left:1.58rem;top:2.12rem;" v-show="hasnotGold">
	    	<!--没有买金提示小盒子-->
	    	<div class="noGoldTip" v-show="noBuyGold">
	    		<p>您还没有黄金种子,无法生出金豆哦~~</p>
	    	</div>
	    	
	    	<!--金豆未成熟提示小盒子-->
	    	<div class="noGoldTip" v-show="notHarvestTip">
	    		<p>{{tip2}}</p>
	    	</div>
	    	<!--主动生息额外奖励小盒子-->
	    	<mt-popup
	    	v-model="popupVisible"
	    	popup-transition="popup-fade" position="middle" style="width:4.9rem;">
	    	  <div class="awardBox">
	    		  <p>辛勤劳作,额外奖励您黄金{{(otherWeight*1000).toFixed(1)}}mg哦~
	    		  	<span class="closeBox" @click="closeTip"></span>
	    		  </p>
	    	  </div>
	        </mt-popup>
	    	<!-- 任务金区域 -->
	    	<section class="taskArea"  v-show="hasTasks">
	    		<!--收取任务奖励提示小盒子-->
	    		<div class="receiveTask" v-show="hasTasks">
	    			<p style="background-color:#fff;position: relative;z-index:4;height:.66rem;line-height:.66rem;">点击收取任务奖励</p>
	    		</div>
	    		<!--循环任务金的部分-->
	    		<div v-for="(item,index) in taskBeans"  class="tasks" @click="goToAnimate($event,index)">
	    			<!--存放具体任务金-->
	    	    	<input type="hidden" :value="it" v-for="it in item" class="location">
	    			<img :src="taskGold" class="taskImg">
	    			<span class="taskName">{{index}}</span>
	    			<img :src="beanShadow" class="TBS">
	    		</div>
	    	</section>
	    	<!-- 普通生金豆的区域 -->
	    	<div class="normalGold" v-if="wandou">
	    		<img :src="wandou" class="wandou">
	    		<img :src="bean" class="normalBean normalBean1" v-if='mature==1&&login==1'>
	    		<img :src="bean" class="normalBean normalBean2" v-if='mature==1&&login==1'> 
	    		<img :src="bean" class="normalBean normalBean3" v-if='mature==1&&login==1'>
	    		<img :src="bean" class="normalBean normalBean4" v-if='mature==1&&login==1'>
	    		<img :src="bean" class="normalBean normalBean5" v-if='mature==1&&login==1'>
	    		<img :src="bean" class="normalBean normalBean6" v-if='mature==1&&login==1'>
	    		<img :src="bean" class="normalBean normalBean7" v-if='mature==1&&login==1'>
	    		<img :src="bean" class="normalBean normalBean8" v-if='mature==1&&login==1'>
	    		<img :src="bean" class="normalBean normalBean9" v-if='mature==1&&login==1'>
	    		<img :src="bean" class="normalBean normalBean10" v-if='mature==1&&login==1'>
	    		<img :src="matureShell" class="matureShell" v-if='mature==1&&login==1'>
	    		<img :src="beanShadow" class="beanShadow1 beanShadow" v-if='mature==1&&login==1'>
	    		<img :src="beanShadow" class="beanShadow2 beanShadow" v-if='mature==1&&login==1'>
	    		<img :src="beanShadow" class="beanShadow3 beanShadow" v-if='mature==1&&login==1'>
	    		<img :src="beanShadow" class="beanShadow4 beanShadow" v-if='mature==1&&login==1'>
	    		<img :src="beanShadow" class="beanShadow5 beanShadow" v-if='mature==1&&login==1'>
	    	</div>
	    </div>
	    <!--最新动态登入后才可显示-->
	    <div class="newest" v-if="!loginBuy && interestList.length">
	    	<h4 @click="newest">最新动态<span class="moreTrend"><img src="../../images/right_jian.png"></span></h4>
	    	<div class="myTrends">
	    		<p class="trend" v-for="(item,index) in interestList"><span class="left-trend">我收取{{item.weight}}g</span><span class="right-trend">{{item.harvestTime | formatTime}}</span></p>
	    	</div>
	    </div>
	    <!-- 没有任务可做时展示的内容 -->
	    <div class="no-benifit-task" v-if="hasLoginNoActivity">
	    	<h4>我的任务</h4>
	    	<img src="../../images/noStor.png">
			<p>暂时没有任务可做哦！</p>	    		
	    </div>
	    <!--我的任务区域(已登入)-->
	    <div class="benifit-task" v-if="token && userTasks">
	    	<h4>我的任务</h4>
	    	<div class="myTask">
	    		<div class="task" v-if="YQHY">
	    			<div class="taskLeft">
	    				<p class="p1">邀请好友送金豆</p>
	    				<p class="p2">我和好友各送<span style="color:#FE8B65;">0.32g</span></p>
	    				<img src="../../images/inviteFriend.png">
	    			</div>
	    			<div class="taskRight">
	    				<img src="../../images/right_jian.png">
	    			</div>
	    		</div>
	    		<div class="task invest" @click="goToAuthen" v-if="SMRZ">
	    			<div class="taskLeft">
	    				<p class="p1">实名认证</p>
	    				<p class="p2">送<span style="color:#FE8B65;">{{realNameWeight}}g</span>黄金</p>
	    				<img src="../../images/realName.png">
	    			</div>

	    			<div class="taskRight" v-show="!hasRealName">
	    			    <span>未认证</span>
	    				<img src="../../images/right_jian.png">
	    			</div>

	    			<div class="taskRight" v-show="hasRealName">
	    			    <span>已完成</span>
	    			</div>
	    		</div>
	    		<div class="task invest"  @click="bindBank" v-if="BK">
	    			<div class="taskLeft">
	    				<p class="p1">绑定银行卡</p>
	    				<p class="p2">获得<span style="color:#FE8B65;">{{BKWeight}}g</span>黄金</p>
	    				<img src="../../images/bankIcon.png">
	    			</div>
	    			
	    			<div class="taskRight" v-show="!hasBindBank">
	    			    <span>未绑定</span>
	    				<img src="../../images/right_jian.png">
	    			</div>

	    			<div class="taskRight" v-show="hasBindBank">
	    			    <span>已完成</span>
	    			</div>
	    		</div>
	    	</div>
	    </div>
	    <!--我的任务区域(没有登入时)-->
	    <div class="benifit-task" v-if="!token && userTasks">
	    	<h4>我的任务</h4>
	    	<div class="myTask">
	    		<div class="task invest" @click="goToAuthen" v-if="SMRZ">
	    			<div class="taskLeft">
	    				<p class="p1">实名认证</p>
	    				<p class="p2">送<span style="color:#FE8B65;">{{realNameWeight}}g</span>黄金</p>
	    				<img src="../../images/realName.png">
	    			</div>
	    			<div class="taskRight">
	    				<img src="../../images/right_jian.png">
	    			</div>
	    		</div>
	    		<div class="task invest"  @click="bindBank" v-if="BK">
	    			<div class="taskLeft">
	    				<p class="p1">绑定银行卡</p>
	    				<p class="p2">获得<span style="color:#FE8B65;">{{BKWeight}}g</span>黄金</p>
	    				<img src="../../images/bankIcon.png">
	    			</div>
	    			<div class="taskRight">
	    				<img src="../../images/right_jian.png">
	    			</div>
	    		</div>
	    	</div>
	    </div>
	</div>
</template>
<script>
import noLoginBg from '@/images/noLoginBg.png'
import taskGold from '@/images/taskgold.png'
import loginBg from '@/images/loginBg.png'
import matureBg from '@/images/matureBg.png'//成熟豌豆的中间背景
import noMatureBg from '@/images/noMatureBg.png'//没有成熟或没有买金的豌豆中间背景
import matureShell from '@/images/matureShell.png'//成熟豌豆的外壳
import bean from '@/images/bean.png'//
import beanShadow from '@/images/beanShadow.png'
import '../../plugins/SpeedBall.js'
import {animate,getStyle,getRem,getCookie,getStore} from '../../config/mUtils.js'
import {mapState,mapMutations} from 'vuex'
import CountUp from 'countup.js'
import { Popup,Toast } from 'mint-ui'
import { queryInterest,queryMessagUnreadCount,interestByUser,addAccount,queryMyProfil,queryAwardOrder,updateAwardOrder,queryActivity,queryActivityTask } from '@/service/getData.js'
	export default {
		data(){
			return{
				    text: null,//注水球内的文本(登入、买金、生长中、可收取)
				taskGold: taskGold,
				 allGold: [],//所有的小球数组
			  goldWeight: null,//持仓黄金克重
			   noBuyGold: false,//没有买金提示窗
				   login: null,//登录标志
				      bg: null,
				  wandou: null,
		     matureShell: matureShell,
				    bean: bean,
		      beanShadow: beanShadow, 
		      hasnotGold: false,//未持有黄金
		          mature: false,//成熟的标志
		      noMatureBg: noMatureBg,//未持金图片
		         growing: false,//生长中小球展示
		       hasMature: false,//已成熟小球展示
		      canHarvest: {},//金豆生息状态
				hasTasks: false,//有没有任务金可领取
		   notHarvestTip: false,//金豆未成熟提示
				loginBuy: false,//未登录或未买金
				    tip2: '您的金豆尚未成熟，请耐心等待',
			   hasUnread: false,//有无消息未读
			interestList: [],//收取利息明细
			 hasRealName: false,//有没有实名认证
			   hasWeight: false,//预计收取文本展示
			 hasBindBank: false,//有没有绑卡
			   taskBeans: {},//赠金
			  taskWeight: {},//保存赠金克重
			popupVisible: false,//额外奖励弹窗
			   activitys: [],//用户参与的活动
			        SMRZ: false,
		  realNameWeight: '',
			          BK: false,
			    BKWeight: '',
			        YQHY: false,
			 otherWeight: null,//手动收取额外赠金
			   btnCanUse: true,//避免重复提交
			   userTasks: false,//我的任务是否可以显示
	  hasLoginNoActivity: false,//已登录用户查询活动返回空字段时展示的内容
				  taskBP:[
					{
						top: '0.5',
    				   left: '0.4'
					},
					{
						top: '2',
    					left: '1.05'
					},
					{
						top: '1.9',
    					left: '2.8'
					},
					{
						top: '2.8',
						left: '2'
					},
					{
						top: '2.6',
    					left: '4.48'
					}
				],
			}
		},
		created(){
			this.token?this.login=1:this.login=0; //登录状态
			this.token?this.queryInterest():'';//查询利息收取情况
			this.token?this.queryMessagUnreadCount():'';//查看消息中心消息
			this.token?this.queryAwardOrder():'';//查看用户赠金情况
			this.token?this.queryActivity():this.queryActivityTask();//查看用户参与的活动
		},
		mounted(){
			this.changeBg(this.login);
		},
		watch: {
			mature(val){
				!val?this.wandou='':this.wandou=matureBg
			},
			taskBeans(){
				var length=Object.keys(this.taskBeans).length;
			    if(!length){ //没有可收取的任务金
				    this.hasTasks=false;
				}else{
					this.hasTasks=true;
					this.noBuyGold=false;//任务金收取提示框和未买金提示框显示一个 优先显示任务金收取提示框
				}
			},
			noBuyGold(){
				if(this.hasTasks){
					this.noBuyGold=false; //任务金收取提示框和未买金提示框显示一个 优先显示任务金收取提示框
				}
			}
		},
		computed:{
			...mapState([
                'token',
			]),
		},
		filters:{
			formatTime(val){
				var arr = val.split(' ')[0].split('-');
				return arr[1]+'-'+arr[2];
			}
		},
		methods:{
			...mapMutations([
				'CLEAR_TOKEN','CLEAR_USERINFO'
			]),
			//最新动态
			newest(){
				const a = window.newStartActivity('benefitNewest');
				if(a!='in'){
					this.$router.push('/benefitNewest');
				}
			},
			//去消息中心
			goMessCenter(){
				const a = window.newStartActivity('messCenter');
				if(a!='in'&&!this.token){
					this.$router.push({path:'/loginIn'})
				}else if(a!='in'&&this.token){
					this.$router.push('/messCenter');
				}
			},
			//未登入查看用户我的任务
			async queryActivityTask(){
				var res=await queryActivityTask();
				if(res.code==100){
					this.activitys=res.content;
					if(this.activitys==''){
						this.hasLoginNoActivity=true
					}
					for(var i=0,len=this.activitys.length;i<len;i++){
						if(this.activitys[i].code=="BDYHK"){
							this.userTasks=true;
							this.BK=true;
							this.BKWeight=this.activitys[i].awardGoldWeight;
							continue;
						}
						if(this.activitys[i].code=="SMRZ"){
							this.userTasks=true;
							this.SMRZ=true;
							this.realNameWeight=this.activitys[i].awardGoldWeight;
						}
					}
				}
			},
			//登录状态下查询用户参与的活动
			async queryActivity(){
				var res=await queryActivity();
				if(res.code==100){
					this.activitys=res.content;
					if(this.activitys==''){
						this.hasLoginNoActivity=true
					}
					for(var i=0,len=this.activitys.length;i<len;i++){
						if(this.activitys[i].code=="BDYHK"){
							this.userTasks=true;
							this.BK=true;
							this.BKWeight=this.activitys[i].awardGoldWeight;
							if(this.activitys[i].type==0){
								this.hasBindBank=false;
							}else{
								this.hasBindBank=true;
							}
							continue;
						}
						if(this.activitys[i].code=="SMRZ"){
							this.userTasks=true;
							this.SMRZ=true;
							this.realNameWeight=this.activitys[i].awardGoldWeight;
							if(this.activitys[i].type==0){
								this.hasRealName=false;
							}else{
								this.hasRealName=true;
							}
						}
					}
				}
			},
			//收取金豆数字相加
			countup(dv,start,end,point,duration){//(参数1、操作元素 2、开始数字 3、结束数字 4、小数个数 5、持续时间)
				var options = {
					  useEasing: true, //数字变化速度(减速)
					  useGrouping: true, //数字可否使用组 例1,000
					  separator: '', //分组时用什么分割
					  decimal: '.', //小数点分割
					  suffix:'' //后缀
				};
				var numAnim = new CountUp(dv, start, end,point,duration,options);
				if (!numAnim.error) {
					numAnim.start();
				} else {
					// console.error(numAnim.error);
				}
			},
			//查询赠金状态
			async queryAwardOrder(){
				const result=await queryAwardOrder();
				if(result.code==100){
					var resArr=result.content;
					if(!resArr || !resArr.length){
						return;
					}
					//放以任务金名为键的对象
					var tempObj={};

					for(var i=0;i<resArr.length;i++){
						var keys=Object.keys(tempObj);//以对象的属性值来判断各种任务金出现的次数
						if(resArr[i].status==0){//首先需要是未收取的赠金
							if(!this.contains(keys,resArr[i].reason)){
						    	var tem1=resArr[i].reason;
						    	this.taskWeight[tem1]=resArr[i].weight*1;//保存克重，克重数字相加时需要
						    	tempObj[tem1]=[];
						    	tempObj[tem1].push(resArr[i].id); //保存id,收取赠金时需要
						    }else{
						    	var tem2=resArr[i].reason;
						    	tempObj[tem2].push(resArr[i].id);
						    	this.taskWeight[tem2] = this.taskWeight[tem2]*1+resArr[i].weight*1;
						    }
						}
						    
					}
					this.taskBeans=tempObj;
					//页面渲染完之后再设置位置
					var t=this;
					var keys=Object.keys(this.taskBeans);
					if(keys.length){
						this.$nextTick(function(){
							t.initPos();
						},1000)
					}
				}
			},
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
			//请求用户未读消息
			async queryMessagUnreadCount(){
				var res=await queryMessagUnreadCount();
				if(res.code==100){
					if(res.content.count){
						this.hasUnread=true;
					}else{
						this.hasUnread=false;
					}
				}
    	    },
    	    //收取所有任务金
    	    async updateAwardOrder(){
    	    	var ipts=document.querySelectorAll('.location');
    	    	for(var i=0;i<ipts.length;i++){
    	    		var res=await updateAwardOrder(ipts[i].value);
    	    	}
    	    },
    	    //渲染页面时判断状态
			//login改变，改变背景以及text
			changeBg: function(val){
				//未登录
				if(val==0){
					this.bg=noLoginBg;
					this.text="登录";
					this.loginBuy=true;
				}else{ //已登录获取持金状态
					this.bg=loginBg;
					this.getMygold();
				}
			},
			//给任务金豆随机定位
			initPos: function(){
				let that = this;
				
				let TBnum = Object.keys(this.taskBeans).length;
				
				var ran = this.randomN(TBnum);
				//获取所有的任务金
				let allTB = document.querySelectorAll('.tasks');
				for(let i=0;i<allTB.length;i++){
					allTB[i].style.top=that.taskBP[ran[i]].top-0.4+'rem';
					allTB[i].style.left=that.taskBP[ran[i]].left+'rem';
				}

				//从任务金里随机抽取一个作为参照放置任务金收取提示框
				var ranThat = allTB[Math.floor(Math.random()*allTB.length)];
				document.querySelector('.receiveTask').style.top=getStyle(ranThat,'top').split('p')[0]-0.8*getRem()+'px'
				document.querySelector('.receiveTask').style.left=getStyle(ranThat,'left').split('p')[0]-0.4*getRem()+'px'

			},
			//产生0-4之间的随机数,随机数的数量和金豆的数量一样，而且不能重复
			randomN: function(val){
				const a = [0,1,2,3,4];
				const n = [];
				for(var i=0;i<val;i++){
					var s = Math.random()*(a.length);
					var b = (a.splice(s,1)).join();
					n.push(b);
				}
				return n
			},
			//任务金点击添加动画
			async goToAnimate(e,index){
				if(!this.btnCanUse){
					Toast({
				  		message: '频繁操作',
				  		position: 'bottom',
				  		duration: 3000
				  	});
				  	return;
				}
				this.btnCanUse=false;
				//获得该类赠金可收取的克重
    	    	var theWeight=this.taskWeight[index]*1;
    	    	//调用数字滚动相加的dom对象
    	    	var ipt=document.querySelector('.theWeight');

				var ipts=document.querySelectorAll('.location');//所有保存id的隐藏input
				var arr=[];//保存点击对象可收取的任务金
				for(var i=0;i<ipts.length;i++){
					if(ipts[i].parentNode==e.currentTarget){
						arr.push(ipts[i]); //获得该类赠金所有可收取的id
					}
				}

    	    	for(var i=0;i<arr.length;i++){//循环id去调用收取赠金的接口
    	    		this.btnCanUse=false;
    	    		var res=await updateAwardOrder(arr[i].value);
    	    		if(res.code==100){
    	    			this.btnCanUse=true;
    	    		}else{
    	    			this.btnCanUse=true;
    	    		}
    	    	}
    	    	this.getMygold();//收取完一次就要更新数据
				var targ=e.target.parentNode//获取当前任务金的div节点
				targ.removeChild(targ.childNodes[6])//当前任务金的阴影消失
				targ.removeChild(targ.childNodes[4])//当前任务金的名字消失

				var thisNode=document.querySelector('.receiveTask');
                if(thisNode){
                    thisNode.parentNode.removeChild(thisNode)
                } //点击任务金 任务金收取提示框则消失

				var that=this;
				var obj={
					'top':(-6.5)*getRem(),
					'left':3.8*getRem(),
					'width':'1',
					'height':'0',
					'opacity':'0'
				}
				//任务金飞走
				//小球动画(参数一表示DOM元素，参数二表示小球的最终显示效果(是一个对象)，参数三表示金豆数字变化的函数，参数四表示vue实例)
				animate(targ,obj,function(){
					setTimeout(that.countup(ipt,that.goldWeight*1,that.goldWeight*1+theWeight,4,1),10)
				},function(){
					targ.parentNode.removeChild(targ);
					if(!document.querySelector('.tasks')){
						that.hasTasks=false;
					}
				})
			},
			//点击小球，小球实现转动，成熟的金豆实现点击收取的效果
			async rotate(){
				let that = this;
				if(this.login==false){//没有登录跳转到登录页面
					const a = window.newStartActivity('loginIn');
					if(a!='in'){
						this.$router.push({path:'/loginIn'})
					}
				}else if(this.goldWeight==0){//持仓黄金为零跳转到买金页面
					const a = window.newStartActivity('buyProductDetail');
					if(a!='in'){
						this.$router.push({path:'/buyProductDetail'});
					}
				}else if(this.growing){  //生长中的状态
					this.notHarvestTip=true;
					setTimeout(function(){
						that.notHarvestTip=false;
					},3000)
				}else if(this.mature){
					if(this.otherWeight){
						that.popupVisible=true;
					}else{
						this.goldAnimate();
					}
				}
			},
			closeTip(){ //关闭额外奖励金豆弹框
				this.popupVisible=false;
				this.goldAnimate();
			},
			async goldAnimate(){ //点击小球收取所有金豆
				  if(!this.btnCanUse) {
				  	Toast({
				  		message: '频繁操作',
				  		position: 'bottom',
				  		duration: 3000
				  	});
				  	return;
				  }
				   this.btnCanUse=false;
				    var that=this;
					var total=0;//所有赠金的克重

					//调用数字滚动相加的dom对象
					var ipt=document.querySelector('.theWeight');
					var taskValue=Object.values(that.taskWeight);
					if(that.hasTasks){ //首先判断是否有任务金
						//获得所有的任务金(并收取)
						var thisNode=document.querySelector('.receiveTask');
						if(thisNode){
							thisNode.parentNode.removeChild(thisNode)
                        } //点击任务金 任务金收取提示框则消失
						that.updateAwardOrder();

					}
					for(var i=0;i<taskValue.length;i++){
						total+=taskValue[i];
					}
					that.addAccount();//收取活期利息
                    total=total+that.canHarvest.weight+(that.otherWeight*1 || 0);
    	    	    that.countup(ipt,that.goldWeight*1,that.goldWeight*1+total,4,1)
    	    	    
					//小球实现转动
					document.querySelector('.three').classList.add('start');
					//点击小球获取所有的普通金豆
					let GOLDBEAN = document.querySelectorAll('.normalBean');
					//点击小球获取所有的普通金豆阴影
					let SHADOWS = document.querySelectorAll('.beanShadow');
					//点击获取所有的任务金豆
					let TASKGOLD = document.querySelectorAll('.tasks');
					//将普通金豆添加进总的金豆数组中
					for(var i=0;i<GOLDBEAN.length;i++){
						that.allGold.push(GOLDBEAN[i])
					}
					//将任务金添加进总的金豆数组中
					for(var j=0;j<TASKGOLD.length;j++){
						that.allGold.push(TASKGOLD[j])
					}
					//小球飞起动画延时
					function doScaledTimeout(i,bean,beanFinish) {
  						setTimeout(function() {
  							//判断当前小球是否是任务金，若是，则移除任务金的title和shadow
    						if(bean.getAttribute('class')=='tasks'){
    							//判断小球是否手动收取
    							if(bean.childNodes[6]&&bean.childNodes[4]){
    								bean.removeChild(bean.childNodes[6])
	    							bean.removeChild(bean.childNodes[4])
    							}
    						}
    						//小球动画(参数一表示DOM元素，参数二表示小球的最终显示效果(是一个对象)，参数三表示金豆数字变化的函数，参数四表示vue实例)
    						animate(bean,beanFinish)
    						if(i==9){
    							setTimeout(function(){
    								removeDom(that.allGold,that)
    							},1000)
								
							}
  						}, i * 150);
					}	

					//阴影最终显示效果
					var shadowFinish={
						'opacity':'0'
					}
                    //从页面中删除已收取的金豆
                    function removeDom(dom,that){ 
                    	for(var i=0;i<dom.length;i++){
                    		dom[i].parentNode.removeChild(dom[i]);
                    	}
                    	that.noBuyGold=false;
                        that.text='生长中...';
                        that.growing=true;
                        that.hasMature=false;
                        that.mature=false;
                        that.hasnotGold=true;//闭合的豌豆图片展示
                        that.hasWeight=false;//预计收取文本展示
                        that.wandou='';
                        that.taskWeight=null;
                        that.taskBeans={};
                    }

					//遍历小球
					for(var i=0;i<that.allGold.length;i++){
						let bean = that.allGold[i];
						//小球最终显示效果
						let beanFinish={
							'top':-4*getRem(),
							'left':4*getRem(),
							'height':'20',
						 	'width': '20',
							'opacity':'0'
						}
						
						//延时循环
						doScaledTimeout(i,bean,beanFinish);
						
					}
					//遍历阴影
					for(let i=0;i<SHADOWS.length;i++){
						let shadow = SHADOWS[i];
						
						//阴影动画
						animate(shadow,shadowFinish);
					}
			},
			async addAccount(){ //收取活期利息
				var res=await addAccount();
				if(res.code==100){
					 this.btnCanUse=true;
					 this.queryInterest()
				}else{
					this.btnCanUse=true;
				}
			},
			async interestByUser(){  //请求利息收取状态
				var result=await interestByUser();
					if(result.code==100){
						this.canHarvest=result.content;
						if(result.content.otherType==1){
							this.otherWeight=result.content.otherWeight;
						}
						if(result.content.type==0){ //type等于0，有两种情况
							if(result.content.date){ //返回剩余时间（生长中，有预计收取克重）
								this.noBuyGold=false;
								this.text='生长中...';
								this.growing=true;
								this.hasMature=false;
								this.mature=false;
								this.hasnotGold=true;//闭合的豌豆图片展示
								this.hasWeight=true;//预计收取文本展示

							}else{ //没有返回剩余时间(已成熟，未收取)
								this.noBuyGold=false;
								this.text="已成熟"
								this.mature=true;
								this.growing=false;
								this.hasWeight=false;
								this.hasMature=true;
								this.hasnotGold=false;//闭合的豌豆图片展示

							}
						}else{ //type为1  //已收取完
							this.noBuyGold=false;
							this.text='生长中...'
							this.mature=false;
							this.growing=true;
							this.hasWeight=false;
							this.hasMature=false;
							this.hasnotGold=true;//闭合的豌豆图片展示
						}
					}

			},
			//获取用户黄金账户
			async getMygold(){
				var res=await queryMyProfil();
				if(res.code==100){
					this.goldWeight=res.content.goldBalance || 0;
					this.hasRealName=res.content.realnamed;
					if(!this.goldWeight){ //未持仓状态
						this.text='买金';
						this.noBuyGold=true;//提示未持仓无法生出金豆
						this.hasnotGold=true;//闭合的豌豆图片展示
						this.loginBuy=true;
					}else{ //持仓状态
						this.interestByUser();
					}
				}
			},
			async queryInterest(){  //请求收益明细列表
				let res = await queryInterest(1,100);//只要前4条数据
				if(res.code==100){
					var arr=[],
				    resultArr=res.content.list;
				    if(resultArr && resultArr.length){
				    	for(var i=0;i<resultArr.length;i++){
				    		if(resultArr[i].status==1){
				    			arr.push(resultArr[i]);
				    			if(arr.length==4){
				    				break;
				    			}
				    		}
				    	}
				    	this.interestList=arr;
				    }
				    return;
				}
				if(res.code==401){
					this.CLEAR_TOKEN();
					this.CLEAR_USERINFO()
					this.login=0;
					this.changeBg(this.login);
				}
			},
			//点击跳转实名认证
			goToAuthen(){
				if(!this.token){
					let a = window.newStartActivity('loginIn');
					if(a!='in'){
						this.$router.push('/loginIn');
					}
					return;
				}
				if(this.token && this.hasRealName){
					return;
				}
				if(this.token && !this.hasRealName){
					let a = window.newStartActivity('authentication');
					if(a!='in'){
						this.$router.push('/personHomepage/authentication')
					}
					return;
				}
			},
			//点击我的任务之绑卡
			bindBank(){
				if(!this.token){
					let a = window.newStartActivity('loginIn');
					if(a!='in'){
						this.$router.push('/loginIn');
					}
					return;
				}
				if(this.token && !this.hasRealName){
					let a = window.newStartActivity('authentication');
					if(a!='in'){
						this.$router.push('/personHomepage/authentication');
					}
					return;
				}
				if(this.token && !this.hasBindBank){
					let a = window.newStartActivity('bindBank');
					if(a!='in'){
						this.$router.push('/personHomepage/bindBank');
					}
				}
			},
			//点击生金攻略
			help(){
				const a = window.newStartActivity('benefitHelp');
				if(a!='in'){
					this.$router.push({path:'/benefitHelp'})
				}
			},
		},
		components:{
		},
		activated: function () {
			if(!this.token || localStorage.getItem('needRender')){
				this.text=null;
				this.allGold=[];
				this.goldWeight=null;
				this.growing=false;
				this.loginBuy=false;
				this.bg=null;
				this.login=null;
				this.wandou=null;
				this.noBuyGold=false;
				this.hasnotGold=false;
				this.mature=false;
				this.hasMature=false;
				this.canHarvest={};
				this.hasTasks=false;
				this.notHarvestTip=false;
				this.hasUnread=false;
				this.interestList=[];
				this.hasWeight=false;
				this.taskBeans={};
				this.taskWeight={};
				this.popupVisible=false;
				this.activitys=[];
				this.SMRZ=false;
				this.realNameWeight='';
				this.BK=false;
				this.BKWeight='';
				this.YQHY=false;
				this.otherWeight=null;
				this.btnCanUse=true;
				this.userTasks=false;
				this.hasLoginNoActivity=false;
			}
			
			this.token?this.login=1:this.login=0; //登录状态
			this.token?this.queryInterest():'';//查询利息收取情况
			this.token?this.queryMessagUnreadCount():'';//查看消息中心消息
			this.token?this.queryAwardOrder():'';//查看用户赠金情况
			this.token?this.queryActivity():this.queryActivityTask();//查看用户参与的活动
			this.changeBg(this.login);
		},
		deactivated: function () {
			localStorage.removeItem('needRender');
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
    .benifit-container{
    	background-color: #f5f5f5;
    }
	.benifit-container .benifitBanner{
		height:8.4rem;
		position: relative;
		overflow: hidden;
		background-size: cover;
	}
	.benifit-container>.benifitBanner>.taskArea{
		width: 100%;
		height: 3.8rem;
		position: absolute;
		top: 4.5rem;
	}
	.benifit-container>.benifitBanner>.taskArea>.tasks{
		position: absolute;
		z-index: 4;
	}
	.benifit-container>.benifitBanner>.taskArea .taskImg{
		position: absolute;
		width:.75rem;
		height:.68rem;
		z-index: 3;
	}
	.benifit-container>.benifitBanner>.taskArea .taskName{
		top: .53rem;
		position: absolute;
		width:.8rem;
		height:.35rem;
		line-height: .35rem;
		font-size:.2rem;
		color:#fff;
		background-color:#ff6d39;
		left:0.05rem;
		text-align: center;
		border-radius: .05rem;
		-webkit-border-radius: .05rem;
		-moz-border-radius: .05rem;
		-o-border-radius: .05rem;
		z-index: 4;
	}
	.benifit-container>.benifitBanner>.taskArea .TBS{
		position: absolute;
	    width: 1.8rem;
	    left: -.4rem;
	    top: 0.35rem;
	    background: url(/static/img/beanShadow.0617b49.png);
	    background-size: 100%;
	    z-index: 1;
	}
	.benifit-container .benifitBanner .myGold-myReceive{
		margin-top:.76rem;
		text-align: center;
	} 
	.myGold-myReceive .myGold-myReceive-p1{
		font-size:.36rem;
		font-weight: bold;
		color: #663500;
		font-family:Sans-serif;
	}
	.myGold-myReceive .myGold-myReceive-p1 span{
		margin-left:.26rem;
	}
	.benifit-container .benifitBanner .noGoldTip{
		width:2.7rem;
		height:.9rem;
		border:1px solid #EDA835;
		color:#663500;
		font-size:.24rem;
		border-radius: 3px;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		-o-border-radius: 3px;
		position: absolute;
		top:2.3rem;
		left:0.5rem;
		background-color: #fff;
		padding:.12rem 0rem 0 .3rem;
	}
	.benifitBanner .noGoldTip p{
		position: relative;
		z-index: 3;
		line-height: .3rem;
		padding-right:.2rem;
	}
	.benifit-container .benifitBanner .noGoldTip:before{
		content:'';
		width:.4rem;
		height:.2rem;
		background-color: #fff;
		position: absolute;
		z-index:2;
		bottom:0rem;
		right:0.62rem;
	}
	.benifit-container .benifitBanner .noGoldTip:after{
		content:'';
		width:.2rem;
		height:.2rem;
		border:.02rem solid #EDA835;
		background-color: #fff;
		transform: rotate(45deg);
		position: absolute;
		z-index:1;
		bottom:-.08rem;
		right:0.68rem;
	}
	.benifit-container .benifitBanner .receiveTask{
		border:1px solid #EDA835;
		color:#663500;
		font-size:.24rem;
		border-radius: 3px;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		-o-border-radius: 3px;
		position: absolute;
		background-color: #fff;
		height:.7rem;
		z-index: 3;
		padding-left:.3rem;
		padding-right:.3rem;
	}
	.benifit-container .benifitBanner .receiveTask:after{
		content:'';
		width:.2rem;
		height:.2rem;
		border:.02rem solid #EDA835;
		background-color: #fff;
		-webkit-transform: rotate(45deg);
		-moz-transform: rotate(45deg);
		-o-transform: rotate(45deg);
		transform: rotate(45deg);
		position: absolute;
		z-index:2;
		bottom:-.1rem;
		left: 0.8rem;		
	}
	.benifitBanner .benifit-message{
		position: absolute;
		width:.6rem;
		height:.6rem;
		background:url(../../images/message.png);
		background-size: 100%;
		top:0.2rem;
		left:0.33rem;
	}
	.benifit-message .messCount{
		position: absolute;
		width:11px;
		height:11px;
		background-color:#ff6d39 ;
		color:#fff;
		font-size:.16rem;
		border-radius: 50%;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		-o-border-radius: 50%;
		text-align: center;
		line-height: .34rem;
		top:0;
		right:0;
	}
	.benifitBanner .benifit-raiders{
		width:.66rem;
		height:.92rem;
		background:url(../../images/gonglue.png);
		background-size: 100%;
		background-repeat: no-repeat;
		position: absolute;
		right:0.2rem;
		bottom:0.3rem;
		z-index:10;
	}
	.benifit-container .benifit-task{
		background-color: #fff;
		padding-bottom:.1rem;
	}
	.benifit-container .benifit-task h4,.benifit-container .newest h4{
		height:1.2rem;
		line-height:1.2rem;
		padding-left:.3rem;
		font-size:.34rem;
		border-bottom:1px solid #EEEEEE;
		color:#000000;
		font-weight: bold;
	}
	.benifit-container .newest{
		margin-bottom:.2rem;
		background-color: #fff;
	}
	.benifit-container .newest .left-trend{
		flex:2;
		-webkit-flex:2;
		-moz-flex:2;
		-o-flex:2;
		-ms-flex:2;
		font-size:.28rem;
		color:#333333;
		text-align: left;
	}
	.benifit-container .newest .right-trend{
		flex:1;
		-webkit-flex:1;
		-moz-flex:1;
		-o-flex:1;
		-ms-flex:1;
		font-size:.24rem;
		color:#999999;
		text-align: right;
		padding-top:.07rem;
	}
	.benifit-container .newest .trend{
		height:.72rem;
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		display: -o-flex;
		display: -ms-flex;
	}
	.benifit-container .newest h4{
		position: relative;
	}
	.benifit-container .newest .moreTrend{
		position: absolute;
		right:0.3rem;
	}
	.benifit-container .newest .myTrends{
		padding:.42rem .3rem 0;
	}
	.benifit-container .newest img{
		width:.13rem;
		height:.24rem;
	}
	.benifit-container .benifit-task .myTask{
		padding:.3rem;
		margin-bottom:1rem;
	}
	.benifit-task .myTask .task{
		background-color:#F8F8F8;
		padding:.3rem .2rem .3rem .22rem; 
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		display: -o-flex;
		display: -ms-flex;
		margin-bottom:.2rem;
	}
	.myTask .task .taskLeft{
		position: relative;
		padding-left:.82rem;
		flex:5;
		-webkit-flex:5;
		-moz-flex:5;
		-ms-flex:5;
		-o-flex:5;
	}
	.task .taskLeft img{
		width:.6rem;
		height:.6rem;
		position: absolute;
		top:0.08rem;
		left:0rem;
	}
	.task .taskLeft .p1{
		font-size:.3rem;
		color:#333333;
	}
	.task .taskLeft .p2{
		font-size:.26rem;
		color:#999999;
	}
	.task .taskRight{
		flex:1;
		-webkit-flex:1;
		-moz-flex:1;
		-ms-flex:1;
		-o-flex:1;
		text-align: right;
		line-height: .8rem;
	}
	.task .taskRight img{
		width:.13rem;
		height:.24rem;
	}
	.myTask .invest .taskLeft{
		flex:3;
		-webkit-flex:3;
		-moz-flex:3;
		-ms-flex:3;
		-o-flex:3;
	}
	.myTask .invest .taskRight{
		flex:1;
		-webkit-flex:1;
		-moz-flex:1;
		-ms-flex:1;
		-o-flex:1;
		position: relative;
	}
	.myTask .invest .taskRight span{
		font-size:.24rem;
		color:#999999;
		position: absolute;
		top:0;
		left:0.4rem;
	}
/*生息的小球*/
.filling{
	position: absolute;
    width: 1.6rem;
    height: 1.6rem;
    right: 0.74rem;
    top: 2rem;
    text-align: center;
}
.filling #mySpeedBall2 {
	position: absolute;
    right: 0;
    top: 0;
    height: 1.6rem;
    width: 1.6rem;
}	
.benifitBanner .filling>.canGet{
	font-size:.23rem;
	color:#6A3A05;
	position: absolute;
	top: 1.6rem;
	left: 0.3rem;
	width:1rem;
}
.benifitBanner .filling>.canGet:after{
	content:'';
	width:.26rem;
	height:.24rem;
	background:url(../../images/handIcon.png);
	background-size: 100%;
	position: absolute;
	bottom:0.3rem;
	right:-.2rem;
}
.willing{
	position: absolute;
	min-width:2rem;
	font-size:.22rem;
	height:.22rem;
	color:#663500;
	left:-.2rem;
	top:1.6rem;
}
.filling .three{
	position: absolute;
	top:0;
	left:2px;
	z-index:1;
	width:1.54rem;
	height:1.54rem;
}
.filling .four{
	z-index:1;
	width:1.54rem;
	height:1.54rem;
}
.filling .rate{
	position: absolute;
	left: 0;
	width: 1.6rem;
	line-height: 1.6rem;
	text-align: center;
	font-size:.28rem;
	font-weight: bold;
	z-index: 2;
	color: #663500;
}
/*点击小球旋转的效果*/
.start{
	animation:rotate2 .5s linear infinite;
}

@keyframes rotate2{
    0%{transform: rotate(0);}
    50%{transform: rotate(180deg);}
    100%{transform: rotate(360deg);}
}

/*普通金豆*/
.normalGold{
	position: absolute;
	bottom: 4.5rem;
}
.normalGold>.wandou{
	width: 6.5rem;
	position: absolute;
	left: 1rem;
	top: -.7rem;
}
.normalGold>.matureShell{
	width: 3.15rem;
	position: absolute;
	left: 2rem;
	top: .45rem;
}
.normalGold>.normalBean{
	position: absolute;
}
.normalGold>.normalBean1{
	width: .45rem;
	left: 2.15rem;
	top: .9rem;
}
.normalGold>.normalBean2{
	width: .46rem;
	left: 2.62rem;
	top: 1.21rem;
}
.normalGold>.normalBean3{
	width: .55rem;
	left: 3.13rem;
	top: 1.43rem;
}
.normalGold>.normalBean4{
	width: .65rem;
	left: 3.75rem;
	top: 1.59rem;
}
.normalGold>.normalBean5{
	width: .7rem;
	left: 4.56rem;
	top: 1.57rem;
}
.normalGold>.normalBean6{
	width: .55rem;
	left: 1.35rem;
	top: 1.56rem;
	z-index: 2;
}
.normalGold>.normalBean7{
	width: .35rem;
	left: .8rem;
	top: 2rem;
	z-index: 2;
}
.normalGold>.normalBean8{
	width: .58rem;
	left: 4.1rem;
	top: 2.4rem;
	z-index: 2;
}
.normalGold>.normalBean9{
	width: .4rem;
	left: 5.4rem;
	top: 2.9rem;
	z-index: 2;
}
.normalGold>.normalBean10{
	width: .75rem;
	left: 5.6rem;
	top: 1.8rem;
	z-index: 2;
}
.normalGold>.beanShadow1{
	position: absolute;
	width: .9rem;
	left: 1.3rem;
	top: 1.88rem;
}
.normalGold>.beanShadow2{
	position: absolute;
	width: .46rem;
	left: .81rem;
	top: 2.23rem;
}
.normalGold>.beanShadow3{
	position: absolute;
	width: 1rem;
	left: 4.05rem;
	top: 2.75rem;
}
.normalGold>.beanShadow4{
	position: absolute;
	width: 1.35rem;
	left: 5.41rem;
	top: 2.24rem;
}
.normalGold>.beanShadow5{
	position: absolute;
	width: .65rem;
	left: 5.37rem;
	top: 3.15rem;
}
/*额外赠送黄金的弹窗*/
.awardBox{
	width:4.9rem;
	height:1.05rem;
	background-color: #fff;
	font-size:.22rem;
	color:#333333;
	line-height:1.05rem;
	text-align:center;
	border-radius: 8px;
	-webkit-border-radius: 8px;
	-moz-border-radius: 8px;
	-o-border-radius: 8px;
}
.awardBox .closeBox{
	width:.44rem;
	height:.84rem;
	background-image: url(../../images/lineClose.png);
	background-size: 100%;
	position: absolute;
	top:-.84rem;
	right:0.22rem;
}
.no-benifit-task{
	width: 100%;	
	text-align: center;
	padding-bottom: 1.5rem;
	background-color: #fff;
}
.no-benifit-task img{
	margin-top: .5rem;
	width: 3rem;
	height: 2.5rem;
}
.no-benifit-task p{
	font-size: .28rem;
}
.no-benifit-task h4{
	background-color: #fff;
	text-align: left;
	height:1.2rem;
	line-height:1.2rem;
	padding-left:.3rem;
	font-size:.34rem;
	border-bottom:1px solid #EEEEEE;
	color:#000000;
	font-weight: bold;
}
</style> 