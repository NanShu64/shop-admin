import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies'
import { router } from '@/router';

//onBeforeRouteUpdate添加一个导航守卫，不论当前位置何时被更新都会触发

export function useTabList() {
    const route = useRoute()
    const cookie = useCookies()

    const activeTab = ref(route.path)

    const tabList = ref([
        {
            title: '后台首页',
            path: "/"
        },
    ])


    //添加标签导航的方法
    function addTab(tab) {
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
        if (noTab) {
            tabList.value.push(tab)
        }
        cookie.set("tabList", tabList.value)
    }

    // 初始化标签导航列表
    function initTabList() {
        //从cookie当中拿tabList
        let tbs = cookie.get("tabList")
        //如果有的话，赋值给tbs
        if (tbs) {
            tabList.value = tbs
        }
    }
    //执行 
    initTabList()

    onBeforeRouteUpdate((to, from) => {
        //点击标签，标签处于激活状态
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })
    //切换标签
    const changeTab = (t) => {
        console.log(route.path);
        //改变当前激活标签为‘t’
        activeTab.value = t
        router.push(t)
    }
    //关闭标签,用t来接收
    const removeTab = (t) => {
        //点击关闭执行的方法，tabs接收当前标签导航数组
        let tabs = tabList.value
        //定义a来接收当前激活的值
        let a = activeTab.value
        //判断关闭的标签是否是激活的
        if (a == t) {
            //tab当前标签导航的对象
            tabs.forEach((tab, index) => {
                if (tab.path == t) {
                    //计算新激活的标签
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        // 如果有nextTab，就当前激活的值设为nextTab.path
                        a = nextTab.path
                    }
                }
            })
        }
        //得到下一个激活标签的路径，赋值给当前激活的activeTab,自动触发changeTab,自动跳转
        // changeTab函数是通过标签页的点击事件触发的,所以要手动改触发changeTag
        activeTab.value = a
        router.push(a)
        //只有不等于当前关闭的标签，才能留下
        tabList.value = tabList.value.filter(tab => tab.path != t)
        // 更新存储
        cookie.set("tabList", tabList.value)

    }

    //下拉菜单>关闭其他/关闭所有 标签
    const handleClose = (c) => {
        if (c == "clearAll") {
            //切换回首页,
            activeTab.value = "/"
            //关闭所有标签后虽然设置了 activeTab = "/"，但没有触发路由跳转
            //首页标签虽然存在，但没有激活其路由视图,如果使用Vue Router，需要实际跳转到首页路由
            router.push("/");
            //过滤只剩下首页
            tabList.value = [{
                title: '后台首页',
                path: "/"
            }]
        } else if (c == "clearOther") {
            // 过滤只剩下首页和当前激活
            tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)

        }
        cookie.set("tabList", tabList.value)
    }
    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}