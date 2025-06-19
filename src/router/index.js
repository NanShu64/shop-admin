import { createRouter, createWebHashHistory } from "vue-router"

import Index from '@/pages/index.vue'
import About from '@/pages/about.vue'
import NotFound from '@/pages/404.vue'
import Login from '@/pages/login.vue'
import Admin from '@/layout/admin.vue'
import GoodList from '@/pages/goods/list.vue'
import CategoryList from '@/pages/category/list.vue'
import UserList from '@/pages/user/list.vue'
import OrderList from '@/pages/order/list.vue'
import CommentList from '@/pages/comment/list.vue'
import ImageList from '@/pages/image/list.vue'
import NoticeList from '@/pages/notice/list.vue'
import SettingBase from '@/pages/setting/base.vue'
import CouponList from '@/pages/coupon/list.vue'
import ManagerList from '@/pages/manager/list.vue'
import AccessList from '@/pages/access/list.vue'
import RoleList from '@/pages/role/list.vue'
import SkusList from '@/pages/skus/list.vue'
//默认路由所有用户共享
const routes = [{
    path: "/", // http://localhost:5173
    name: "admin",
    component: Admin,
},
{
    path: "/about", // http://localhost:5173/#/about
    component: About,
    meta: {
        title: "关于"
    }
},
{
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
},
{
    path: "/login", // http://localhost:5173/#/login
    component: Login,
    meta: {
        title: "登录页"
    }
},
]

//动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [{
    path: "/",
    name: "/",
    component: Index,
    meta: {
        title: "后台首页"
    },
}, {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodList,
    meta: {
        title: "商品管理"
    },
}, {
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    meta: {
        title: "分类列表"
    },
}, {
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    meta: {
        title: "用户列表"
    }
}, {
    path: "/order/list",
    name: "/order/list",
    component: OrderList,
    meta: {
        title: "订单列表"
    }
}, {
    path: "/comment/list",
    name: "/comment/list",
    component: CommentList,
    meta: {
        title: "评价列表"
    }
}, {
    path: "/image/list",
    name: "/image/list",
    component: ImageList,
    meta: {
        title: "图库列表"
    }
}, {
    path: "/notice/list",
    name: "/notice/list",
    component: NoticeList,
    meta: {
        title: "公告列表"
    }
}, {
    path: "/setting/base",
    name: "/setting/base",
    component: SettingBase,
    meta: {
        title: "配置"
    }
}, {
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponList,
    meta: {
        title: "优惠券列表"
    }
}, {
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerList,
    meta: {
        title: "管理员管理"
    }
}
    , {
    path: "/access/list",
    name: "/access/list",
    component: AccessList,
    meta: {
        title: "权限管理"
    }
}
    , {
    path: "/role/list",
    name: "/role/list",
    component: RoleList,
    meta: {
        title: "角色管理"
    }
}
, {
    path: "/skus/list",
    name: "/skus/list",
    component: SkusList,
    meta: {
        title: "规格管理"
    }
}
]
export const router = createRouter({
    //使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
    history: createWebHashHistory(),
    routes
})

//动态添加路由的方法
export function addRoutes(menus){
    //是否有新的路由
    let hasNewRoutes = false
    const findAndAddRoutesByMenus = (arr) => {
        arr.forEach(e => {
            // e.frontpath拿到菜单路径
            //通过o拿到asyncRoutes单独的path
            let item = asyncRoutes.find(o => o.path == e.frontpath)
            //是否存在 router.hasRoute()：检查路由是否存在。
            if (item && !router.hasRoute(item.path)) {
                //添加这个路由
                //要将嵌套路由添加到现有的路由中，可以将路由的 name 作为第一个参数传递给 router.addRoute()，这将有效地添加路由，就像通过 children 添加的一样：
                router.addRoute('admin', item)
                hasNewRoutes = true
            }
            //child是否存在
            if (e.child && e.child.length > 0) {
                findAndAddRoutesByMenus(e.child)
            }

        })
    }
    findAndAddRoutesByMenus(menus)

    return hasNewRoutes
}
