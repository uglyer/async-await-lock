const queueMicrotask =
  typeof window['queueMicrotask'] == 'function'
    ? window['queueMicrotask']
    : window.setTimeout;

/**
 * 异步功能的互斥锁
 * @author uglyer
 * @date 2021/4/26 21:42
 */
export default class AsyncAwaitLock {
  /**
   * 锁数量
   */
  protected lockCount = 0;

  /**
   * 等待锁数量
   */
  get waitLockCount(): number {
    return this.waitList.length;
  }

  /**
   * 等待列表
   */
  protected waitList: Array<() => void> = [];

  /**
   * 状态锁
   * @param maxCount 最大锁数量
   */
  constructor(public maxCount = 1) {}

  /**
   * 是否锁定
   */
  get isLock() {
    return this.lockCount >= this.maxCount;
  }

  /**
   * 等待锁结束
   * @deprecated {@link acquire}
   */
  wait(): Promise<void> {
    return this.acquire();
  }

  /**
   * 上锁 锁定前必须等待上一个锁结束
   */
  acquire() {
    if (this.lockCount < this.maxCount) {
      this.lockCount++;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.waitList.push(resolve);
    });
  }

  /**
   * 解锁
   */
  unlock() {
    this.lockCount--;
    const task = this.waitList.shift();
    if (task) {
      this.lockCount++;
      queueMicrotask(() => task());
    }
    while (this.lockCount < this.maxCount) {
      this.lockCount++;
      const task = this.waitList.shift();
      if (task) {
        this.lockCount++;
        queueMicrotask(() => task());
      }
    }
  }
}
