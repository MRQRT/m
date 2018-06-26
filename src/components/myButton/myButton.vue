<template>
    <button class="myBtn">
        {{buttonText}}
        <a class="btnActive"></a>
    </button>
</template>

<script>
    export default {
    	data(){
            return{
            }
        },
        mounted(){
        },
        props: ['buttonText'],
        computed: {

        },
        methods: {
            
        },

    }

</script>

<style scoped>
    *{
        box-sizing: border-box;
        margin:0;
        padding:0;
    }
    .myBtn{
        display: block;
        margin:0 auto;
        text-align:center;
    }
    .myBtn .btnActive{
        position:absolute;
        width:100%;
        height:100%;
        background-color:transparent;
        left:0;
        top:0;
    }
    .myBtn .btnActive:active{
        background-color:rgba(0,0,0,.2);
    }
</style>
