(function(Vue){
    let array = JSON.parse(localStorage.getItem("arr")) || [];
    let number = JSON.parse(localStorage.getItem("num"));
    Vue.component("app-todos",{ 
        data: function(){
           return {
            inputting: false, //控制下拉框显示的开关
            text: "", //输入框的值
            arr: array, //要添加的内容
            num: number, //未选中的状态数量
            text_index: -1, // -1 代表没有在编辑的项
            content_cache: "",  //编辑缓存的内容
        }
    },
    directives: {
        "focus": {
            inserted: function(el){
                el.focus();
            }
        }
    },
    computed: {
            visibility: function(){
                return this.$root.visibility
            },
            // 下拉框
            tips: function(){
                let tips = [];
                this.arr.forEach((e,i) =>{
                    if(e.text.indexOf(this.text) !== -1){
                        tips.push(e.text)
                    }
                })
                return tips;
            },
            // 只要有一个编辑项时false 全选的按钮就变灰
            allChecked: function () {
                let allChecked = true;// 默认全选
                this.arr.map(function (v, i) {
                    if (!v.checked) {
                        allChecked = false;
                    }
                })
                return allChecked;
            },
            // 过滤后的arr
            filterArr: function(){
                if(this.visibility === "all"){
                    return this.arr;
                }else if(this.visibility === "active"){
                    return this.arr.filter(function(e,i){
                        return !e.checked
                    })
                }else{
                    return this.arr.filter(function(e,i){
                        return e.checked
                    })
                }
            }
        },
        methods: {
            // 添加列表
            addArrTip: function(tip){
                this.arr.push({
                    text:tip,
                    checked: false
                })
                this.inputting = false;
                console.log("addArrTip执行了")
                localStorage.setItem("arr",JSON.stringify(this.arr))
            },
            // 监听input是否在输入
            showTips: function(){
                this.inputting = true;
                console.log("showTips执行了")
            },
            // 取消修改事件
            cancelContent: function(index){
                this.arr[index].text = this.content_cache;
            },
            // 保存编辑事件
            saveContent: function(index){
                if(!this.arr[index].text){
                    this.arr.splice(index, 1)
                }
                this.text_index = -1;
                localStorage.setItem("arr",JSON.stringify(this.arr))
            },
            // 双击进入编辑列表
            editTod: function(index){
                this.content_cache = this.arr[index].text;
                this.text_index = index;
            },
            // 添加列表
            addTodo: function(){
                if(!this.text.trim()){
                    this.inputting = false;
                    return
                }
                this.arr.push({
                    text: this.text,
                    checked: false,
                });
                this.text = "";
                let num = 0;
                this.arr.forEach((e,i) =>{
                    if(!e.checked){
                        num++;
                    }
                    this.num = num;
                })
                localStorage.setItem("num",JSON.stringify(this.num))
                localStorage.setItem("arr",JSON.stringify(this.arr))
            },
            // 删除选中列表
            remove: function(){
                let arr = [];
                this.arr.forEach((e,i) =>{
                    if(!e.checked){
                        arr.push(e);
                    }
                })
                this.arr = arr;
                localStorage.setItem("arr",JSON.stringify(this.arr))     
            },
            // 选中所有列表
            handleAll: function(){  
                let iNow = 0;  
                let num = 0;      
                this.arr.forEach(e => {
                    if(!e.checked){
                        e.checked = true
                        num = 0
                       
                    }else{
                        iNow++
                       
                    }
                    if(iNow === this.arr.length){
                        this.arr.forEach(e =>{
                            e.checked = false
                            console.log(e.checked)
                            num++;
                        })
                    }
                });
                this.num = num;
                localStorage.setItem("num",JSON.stringify(this.num))
                localStorage.setItem("arr",JSON.stringify(this.arr))                                                                                                                                                                                                                                                                                 
            },
            // 选中单个列表
            handleOne: function(index){
                this.arr[index].checked = !this.arr[index].checked
                let num = 0;
                this.arr.forEach(e =>{
                    if(!e.checked){
                        num++;
                    }
                })
                this.num = num;
                localStorage.setItem("num",JSON.stringify(this.num))
                localStorage.setItem("arr",JSON.stringify(this.arr))
            },
            // 删除单个列表
            removeItem: function(index){
               this.arr.splice(index,1)
               let num = 0;
                this.arr.forEach(e =>{
                    if(!e.checked){
                        num++;
                    }
                })
                this.num = num;
                localStorage.setItem("num",JSON.stringify(this.num))
                localStorage.setItem("arr",JSON.stringify(this.arr))
            }
        },
        template: `
        <section>
            <header class="header">
                <h1>代办事项</h1>
                <label for="toggle-all" :class="[{lab:!allChecked},{allcheck:allChecked}]" @click="handleAll">></label>
                <input v-focus type="text" placeholder="What needs to be done?"
                    @keyup.enter="addTodo" v-model="text" @input="showTips"
                />
                <ul :class="['hidden',{show:inputting}]">
                    <li v-for="tip,index in tips" @click.stop="addArrTip(tip)">{{tip}}</li>
                </ul>
            </header>
            <section class="main" >
                <ul class="todo-list">
                    <li v-for="item,index in filterArr" :key="index">
                        <input type="checkbox" class="toggle" :checked="item.checked" @click="handleOne(index)">
                        <section :class="['middle',{hidden:text_index === index}]" 
                        @dblclick.stop="editTod(index)"
                        >
                            <label :class="{completed:item.checked}">{{item.text}}</label>
                        </section>
                        <section :class="['middle','hidden',{show:text_index === index}]">
                            <input type="text"
                            @blur="saveContent(index)" 
                            v-model="item.text" 
                            @keyup.13="saveContent(index)"
                            @keyup.esc="cancelContent(index)"
                            >
                        </section>
                        <div class="destroy" @click="removeItem(index)">❌</div>
                    </li>
                </ul>
            </section>
            <footer class="footer" v-show="arr.length">
                <span>剩下{{num}}项</span>
                <ul class="filters">
                    <li>
                        <a href="#/all" :class="[{active:visibility==='all'}]">All</a>
                    </li>
                    <li>
                        <a href="#/active" :class="[{active:visibility==='active'}]">激活</a>
                    </li>
                    <li>
                        <a href="#/finish" :class="[{active:visibility==='finishh'}]">完成</a>
                    </li>
                </ul>
                <button class="div"  @click="remove">清除已完成</button>
            </footer>
        </section>
        `
    })
})(Vue)