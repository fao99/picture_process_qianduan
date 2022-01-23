import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from "@/layout/Layout";
import List from "@/views/List";
import Process from "@/views/Process";

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'List',
        component: List
      },
      {
        path: 'process/:id',
        name: 'Process',
        component: Process
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
