const routes = [
  {
    path: "/login",
    meta: { title: "Login" },
    component: () => import("src/pages/Login.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "bookmarks/folder/:id",
        meta: {
          title: " ",
        },
        component: () => import("pages/Bookmarks.vue"),
      },
      {
        path: "bookmarks/:folder?",
        meta: {
          title: "All Bookmarks",
          icon: "mdi-bookmark-multiple",
          color: "orange",
        },
        component: () => import("pages/Bookmarks.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
