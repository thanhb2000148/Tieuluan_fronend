import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import getCookieValue from "../utils/getCookie";
import deleteCookie from "../utils/deleteCookie";
import isTokenValid from "../utils/isTokenValid";
const routes = [
  {
    path: "/contact",
    name: "Contact",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Contact.vue"),
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/shop",
    name: "ShopView",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ShopView.vue"),
  },
  {
    path: "/:patchMatch(.*)*",
    name: "404View",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/404View.vue"),
  },
  {
    path: "/cart",
    name: "CartView",
    meta: {
      requiredAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CartView.vue"),
  },
  {
    path: "/checkout",
    name: "CheckOutView",
    meta: {
      requiredAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CheckoutView.vue"),
  },

  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
  },

  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Register.vue"),
  },

  {
    path: "/otp",
    name: "OTP",
    component: () => import(/* webpackChunkName: "about" */ "../views/OTP.vue"),
  },

  {
    path: "/otp/reset",
    name: "resetOTP",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EmailOTP.vue"),
  },

  {
    path: "/userinformation",
    name: "UserInformation",
    meta: {
      requiredAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UserInformation.vue"),
  },
  {
    path: "/shop/detail/:id",
    name: "UserDetail",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DetailProductView.vue"),
  },
  {
    path: "/thanks",
    name: "ThankPayment",
    meta: {
      requiredAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CompletePayment.vue"),
  },
  {
    path: "/new",
    name: "NewList",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/new.vue"),
  },
  {
    path: "/favorite",
    name: "Favorite",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/favorite.vue"),
  },
  {
    path: "/newdetail/:id",
    name: "NewDetail",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/newdetail.vue"),
  },
  {
    path: "/checkout/paymentMethods",
    name: "paymentMethod",
    meta: {
      requiredAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/paymentMethod.vue"),
  },
  {
    path: "/admin",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashBoard.vue"),
  },
  {
    path: "/admin/products",
    name: "DashboardProduct",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashBoardProduct.vue"),
  },
  {
    path: "/admin/addProducts",
    name: "DashboardAddProduct",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/DashBoardAddProduct.vue"
      ),
  },

  {
    path: "/admin/user",
    name: "DashboardUsers",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashBoardUser.vue"),
  },

  {
    path: "/admin/category",
    name: "DashboardCategory",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashBoardCategory.vue"),
  },
  {
    path: "/admin/addprices",
    name: "DashBoardpries",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashBoardpries.vue"),
  },
  {
    path: "/admin/productDetails",
    name: "DashboardProductDetail",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashBoardProductDetail.vue"),
  },
   {
    path: "/admin/productOder",
    name: "DashboardProductOder",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashBoardProductOder.vue"),
  },
   {
    path: "/admin/news",
    name: "DashboardNews",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashBoardNews.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = getCookieValue("access_token");

  if (to.path === "/login" && token && isTokenValid(token)) {
    return next("/");
  } else if (to.meta.requiredAuth) {
    if (token) {
      if (isTokenValid(token)) {
        next();
      } else {
        deleteCookie("access_token");
        next("/login");
      }
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
