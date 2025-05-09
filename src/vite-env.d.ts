/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@coderline/alphatab' {
  export interface Score {
    title: string;
    // 其他Score属性...
  }
}
