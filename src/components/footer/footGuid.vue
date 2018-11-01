<template>
    <div class="footTab" ref="footTab">
        <router-link v-bind:to="'/buyGold'" class="buy">
        <span class="buyGold">买金</span>
        </router-link>
        <router-link v-bind:to="'/storeGold'" class="store">
        <span class="storeGold">存金通</span>
        </router-link>
        <router-link v-bind:to="'/benefit'" class="grow">
        <span class="growGold">积分商城</span>
        <span class="redCircle" v-show="show"></span>
        </router-link>
        <router-link v-bind:to="'/mine'" class="mine">
        <span class="my">我的</span>
        </router-link>
<!--         <section v-on:click.stop="$router.push('/buyGold')" class="buy">
            <span class="buyGold">买金</span>
        </section>
        <section v-on:click.stop="$router.push('/storeGold')" class="store">
            <span class="storeGold">回购</span>
        </section>
        <section v-on:click.stop="$router.push('/benefit')" class="grow">
            <span class="growGold">生金</span>
            <span class="redCircle" v-show="show"></span>
        </section>
        <section v-on:click.stop="$router.push('/mine')" class="mine">
            <span class="my">我的</span>
        </section> -->
    </div>
</template>

<script>
    export default {
        data(){
            return {
                iphoneX:null,
            }
        },
        props:['show'],
        mounted(){
            this.isIphoneX()
        },
        methods:{
            isIphoneX(){
                if(/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375) && /micromessenger/gi.test(navigator.userAgent)){
                    this.iphoneX = true
                    this.$refs.footTab.style.paddingBottom = 18+'px';
                }else{
                    this.iPhoneX = false
                }
            }
        }
    }

</script>

<style lang="css" scoped>
.footTab{
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
    display: -ms-flex;
    border-top:1px solid #ededed;
    width:100%;
    background-color:#fff;
    position:fixed;
    bottom: 0;
    z-index: 100;
}
a{
    flex:1;
    -webkit-flex:1;
    -moz-flex:1;
    -o-flex:1;
    -ms-flex:1;
    height:1rem;
    text-align:center;
    color:#fff;
    font-size: .22rem;
}
span{
    display: block;
    color: #333333;
    margin-top: .64rem;
    background-color: #fff;
}
.buy{
    height:1rem;
    background:url('../../images/buyG.png') no-repeat;
    background-position: center 0.15rem;
    background-size: .44rem;
}
.store{
    height:1rem;
    background:url('../../images/storeG.png') no-repeat;
    background-position: center 0.15rem;
    background-size: .44rem;
}
.grow{
    height:1rem;
    background:url('../../images/growG.png') no-repeat;
    background-position: center 0.13rem;
    background-size: .44rem;
    position: relative;
}
.grow .redCircle{
    position: absolute;
    width:11px;
    height:11px;
    background-color:#FF6D39;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -o-border-radius: 50%;
    top:-.5rem;
    right:.5rem;
}
.mine{
    height:1rem;
    background:url('../../images/my.png') no-repeat;
    background-position: center 0.12rem;
    background-size: .44rem;
}
.buy.active{
    background:url('../../images/buyGoChec.png') no-repeat;
    background-position: center 0.15rem;
    background-size: .44rem;
}
.store.active{
    background:url('../../images/strGoChec.png') no-repeat;
    background-position: center 0.15rem;
    background-size: .44rem;
}
.grow.active{
    background:url('../../images/growGoChec.png') no-repeat;
    background-position: center 0.13rem;
    background-size: .44rem;
}
.mine.active{
    background:url('../../images/myChecked.png') no-repeat;
    background-position: center 0.12rem;
    background-size: .44rem;
}
.active span{
    color: #e9ba47;
}
</style>
