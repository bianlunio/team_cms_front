import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component: () => component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '辩题列表',
        icon: 'table',
        path: 'motion',
        component: dynamicWrapper(app, ['motion'], import('../routes/Motion/MotionList')),
      },
      // {
      //   name: '异常',
      //   path: 'exception',
      //   icon: 'warning',
      //   children: [
      //     {
      //       name: '403',
      //       path: '403',
      //       component: dynamicWrapper(app, [], import('../routes/Exception/403')),
      //     },
      //     {
      //       name: '404',
      //       path: '404',
      //       component: dynamicWrapper(app, [], import('../routes/Exception/404')),
      //     },
      //     {
      //       name: '500',
      //       path: '500',
      //       component: dynamicWrapper(app, [], import('../routes/Exception/500')),
      //     },
      //   ],
      // },
    ],
  },
  {
    component: dynamicWrapper(app, [], import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      // {
      //   name: '帐户',
      //   icon: 'user',
      //   path: 'user',
      //   children: [
      //     {
      //       name: '登录',
      //       path: 'login',
      //       component: dynamicWrapper(app, ['login'], import('../routes/User/Login')),
      //     },
      //     {
      //       name: '注册',
      //       path: 'register',
      //       component: dynamicWrapper(app, ['register'], import('../routes/User/Register')),
      //     },
      //     {
      //       name: '注册结果',
      //       path: 'register-result',
      //       component: dynamicWrapper(app, [], import('../routes/User/RegisterResult')),
      //     },
      //   ],
      // },
    ],
  },
];
