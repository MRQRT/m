<template>
    <header id='head_top'>
        <!--左边实现后退或关闭按钮-->
        <slot name="head_goback" class="head_goback">
            <slot name="message"></slot>
            <slot name="mes_num"></slot>
        </slot>
        <!--放存金结果页的关闭图片-->
        <slot name="close_page"></slot>
        <!--预留位置放右边自定义部分-->
        <slot name='custom' class="custom"></slot>
        <!--中间标题-->
        <section class="title_head title_text" v-if="headTitle">
            {{headTitle}}
        </section>
        <!--预留位置放首页导航logo图片-->
        <slot name='logo' class="myLogo"></slot>
    </header>
</template>

<script>
    export default {
        mounted(){
        },
        props: ['headTitle'],
    }
</script>
<style scoped>
    *{
        box-sizing: border-box;
        margin:0;
        padding:0;
    }
    #head_top{
        width:100%;
        height:0.88rem;
        padding-top:.25rem;
        z-index:10;
        background-color: #fff;
        position:fixed;
        top:0;
        left:0;
    }
    .head_goback{
        width:.19rem;
        height:.36rem;
        position:absolute;
        left:0.28rem;
    }
    .custom{
        position:absolute;
        right:0.28rem;
        font-size:.26rem;
        color:#333333;
    }
    .title_head{
        width:100%;
        text-align: center;
        font-weight: normal;
    }
    .title_text{
       font-size:.34rem;
    }
    #head_top>section{
        color: #000;
        height: .44rem;
        line-height: .44rem;
    }
</style>
