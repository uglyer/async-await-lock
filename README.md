# async-await-lock

## 什么是 async-await-lock

用于异步功能的互斥锁

## 基础用法

### 安装

```shell script
npm i async-await-lock
```

### 使用

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

## Getting Started

Install dependencies,

```bash
$ npm i
```

Start the dev server,

```bash
$ npm start
```

Build documentation,

```bash
$ npm run docs:build
```
