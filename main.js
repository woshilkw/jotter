(function(Vue){
    let app = new Vue({
        el: ".todoapp",
        data:{
            visibility:"all"
        }
    })
    window.app = app;
})(Vue)