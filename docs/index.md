---
hero:
  title: async-await-lock
  desc: 用于异步功能的互斥锁
features:
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png
    title: 开箱即用
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
    title: 轻量(<1kb)
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png
    title: 异步友好
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

## 安装

```shell script
npm i async-await-lock
```

## 使用

```typescript
import AsyncAwaitLock from 'async-await-lock';

const lock = new AsyncAwaitLock();

async function serialTask() {
  await lock.acquire();

  try {
    // Don't return a promise here as Promise may resolve after finally
    // has executed
  } finally {
    lock.unlock();
  }
}
```
