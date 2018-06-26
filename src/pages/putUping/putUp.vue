<template>
	<div class="jifen_container">
        <head-top headTitle='我的挂单'>
            <img slot='head_goback' src='../../images/back.png' class="head_goback" @click="goback()">
        </head-top>
	    <div class="delete-content">
            <mt-loadmore :bottom-method="loadBottom" :auto-fill="false" :bottomPullText="bottomPullText" ref="loadmore" @top-status-change="handleTopChange">
                <div v-for="(item,index) in list">
                    <div class="slide-warp" ref="slideWarp" :status="item.status">
                        <div class="slide-item" :data-index="index">
                            <div class="item_top">
                                <span class="item_top_left">{{item.remark}}</span>
                                <span class="item_top_right">{{(item.remark=='挂单买入')?'+':'-'}}{{item.weight}}g</span>
                            </div>
                            <div class="item_bottom">
                                <span class="item_bottom_left">{{item.createTime}}</span>
                                <span class="item_bottom_right">{{item.status | tran_status}}</span>
                            </div>
                        </div>
                        <div class="slide-del" @click="onDeleteItem(index,item.id)">取消订单</div>
                    </div>
                </div>
            </mt-loadmore>
        </div>
        <div class="putUpEmpty" v-show="putUpEmpty" ref='putUpEmpty'></div>
	</div>
</template>
<script>
import headTop from '../../components/header/head.vue';
import { Button,Popup,Toast,MessageBox } from 'mint-ui';
import { queryPagePendingPlan,updatePendingPlan } from '@/service/getData'
import { getRem } from '@/config/mUtils.js'
export default {
    data() {
        return {
            startX: 0, // 按下的位置
            moveX: 0, // 鼠标移动时水平方向的位置
            disX: 0, // 移动之间的距离
            topStatus: null,
            bottomPullText: '上拉加载',
            searchCondition:{
                pageNo: 1,
                pageSize: 1000,
            },
            list:[],
            putUpEmpty: false,//true表示订单为空
            rem: getRem(),
            clientHeight: document.documentElement.clientHeight,
        };
    },
    mounted() {
        this._initSlideDelete();
        this.queryPagePendingPlan();
        this.$refs.putUpEmpty.style.height=this.clientHeight-(this.rem*0.88)+'px';
    },
    filters:{
        tran_status(val){
            return val==0?'挂单中':(val==1?'已成交':(val==2?'已到期':(val==3?'已终止':'已失败')))
            //状态为1、2、3、4的挂单订单不能取消
        }
    },
    methods: {
        _initSlideDelete() {
            let initX; // 触摸位置
            let moveX; // 滑动时的位置
            let X = 0; // 移动距离
            let objX = 0; // 目标对象位置
            window.addEventListener('touchstart', function(event) {
                let obj = event.target.parentNode.parentNode;
                let attr = obj.getAttribute('status')
                if (obj.className === 'slide-warp' && attr==0) {
                    initX = event.targetTouches[0].pageX;
                    objX =
                    obj.style.WebkitTransform
                    .replace(/translateX\(/g, '')
                    .replace(/px\)/g, '') * 1;
                }
                if (objX === 0) {
                    window.addEventListener('touchmove', function(event) {
                        let obj = event.target.parentNode.parentNode;
                        let attr = obj.getAttribute('status');
                        if (obj.className === 'slide-warp' && attr==0) {
                            moveX = event.targetTouches[0].pageX;
                            X = moveX - initX;
                            if (X >= 0) {
                                obj.style.WebkitTransform = 'translateX(' + 0 + 'px)';
                            } else if (X < 0) {
                                let l = Math.abs(X);
                                obj.style.WebkitTransform = 'translateX(' + -l + 'px)';
                                if (l > 80) {
                                    l = 80;
                                    obj.style.WebkitTransform = 'translateX(' + -l + 'px)';
                                }
                            }
                        }
                    });
                } else if (objX < 0) {
                    window.addEventListener('touchmove', function(event) {
                        let obj = event.target.parentNode.parentNode;
                        let attr = obj.getAttribute('status');
                        if (obj.className === 'slide-warp' && attr==0) {
                            moveX = event.targetTouches[0].pageX;
                            X = moveX - initX;
                            if (X >= 0) {
                                let r = -80 + Math.abs(X);
                                obj.style.WebkitTransform = 'translateX(' + r + 'px)';
                                if (r > 0) {
                                    r = 0;
                                    obj.style.WebkitTransform = 'translateX(' + r + 'px)';
                                }
                            } else {
                                // 向左滑动
                                obj.style.WebkitTransform = 'translateX(' + -80 + 'px)';
                            }
                        }
                    });
                }
            });
            window.addEventListener('touchend', function(event) {
                let obj = event.target.parentNode.parentNode;
                let attr = obj.getAttribute('status');
                if (obj.className === 'slide-warp' && attr==0) {
                    objX =
                    obj.style.WebkitTransform
                    .replace(/translateX\(/g, '')
                    .replace(/px\)/g, '') * 1;
                    if (objX > -40) {
                        obj.style.WebkitTransform = 'translateX(' + 0 + 'px)';
                        objX = 0;
                    } else {
                        obj.style.WebkitTransform = 'translateX(' + -80 + 'px)';
                        objX = -80;
                    }
                }
            });
        },
        //点击取消按钮
        onDeleteItem(index,id) {
            MessageBox.confirm( '确定取消挂单吗?').then(action=>{
                if (this.$refs.slideWarp[index]) {
                    this.updatePendingPlan(index,id)//取消挂单
                    this.$refs.slideWarp[index].style.WebkitTransform = 'translateX(' + 0 + 'px)';
                }
            });
            this.$emit('on-change', this.list);
        },
        //请求挂单列表
        async queryPagePendingPlan(){
            const res = await queryPagePendingPlan(this.searchCondition.pageNo,this.searchCondition.pageSize);
            if(res.code==100){
                if(res.content.list){
                    this.list=res.content.list;
                }else{
                    this.putUpEmpty=true
                }
            }
        },
        //上拉加载
        loadBottom(){
            console.log('上拉加载')
            let vm = this;
            this.queryPagePendingPlan();
            setTimeout(function(){
                vm.$refs.loadmore.onBottomLoaded();
            },1000)
        },
        //取消挂单
        async updatePendingPlan(index,id){
            const res = await updatePendingPlan(id);
            if(res.code==100){
                Toast('取消挂单成功');
                this.list.splice(index, 1);
                this.queryPagePendingPlan();
            }else{
                Toast('取消挂单失败');
            }
        },
        //返回按钮
        goback(){
            this.$router.push('/myGold')
        },
        handleTopChange(status) {
            this.topStatus = status;
        },

    },
    components: {
        headTop,
    },
};
</script>
<style scoped lang='less'>
@import "../../style/common.less";
.jifen_container{
    padding-top: .88rem;
}
.view {
    position: absolute;
    transition: all .3s ease-in-out;
}
.delete-content {
    overflow: hidden;
}
.slide-warp{
    width: 100%;
    position: relative;
    height: 1.4rem;
    transition: all .2s ease;
}
.slide-item{
    width: 100%;
    height: 100%;
    background: #fff;
    padding-left: .3rem;
    padding-right: .3rem;
    box-sizing: border-box;
    padding-top: .1rem;
}
.slide-del{
    width: 80px;
    height: 100%;
    background: #E1E1E1;
    color: #fff;
    text-align: center;
    font-size: .25rem;
    padding-top: .85rem;
    background-image: url(../../images/delImg.png);
    background-repeat: no-repeat;
    background-position: center .25rem;
    background-size: .45rem;
    position: absolute;
    right: -80px;
    top: 0;
    z-index: 1;
}
.item_top{
    width: 100%;
    height: .7rem;
    line-height: .7rem;
    .font-style(.3rem,#666666);
    .item_top_left{
        float: left;
        font-weight: 500;
    }
    .item_top_right{
        float: right;
        font-weight: 500;
    }
}
.item_bottom{
    width: 100%;
    height: .7rem;
    line-height: .3rem;
    .font-style(.22rem,#999999);
    .item_bottom_left{
        float: left;
    }
    .item_bottom_right{
        float: right;
    }
}
.putUpEmpty{
    width: 100%;
    background-color: #F5F5F5;
    background-image: url(../../images/noExtract.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50%;
}
</style>