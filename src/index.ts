(function (self) {
  'use strict';

  if (typeof self['queueMicrotask'] == "function") {
    return;
  }
  self['queueMicrotask'] = self.setTimeout;
})(typeof self !== 'undefined' ? self : global);


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
   * 等待空闲列表
   * @protected
   */
  protected waitIdleList: Array<() => void> = [];

  /**
   * 状态锁
   * @param maxCount 最大锁数量
   */
  constructor(public maxCount = 1) {
  }

  /**
   * 是否锁定
   */
  get isLock() {
    return this.lockCount >= this.maxCount;
  }

  /**
   * 等待空闲
   * @deprecated {@link waitIdle}
   */
  wait(): Promise<void> {
    return this.waitIdle();
  }

  /**
   * 等待空闲
   */
  waitIdle(): Promise<void> {
    if (this.lockCount == 0) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      this.waitIdleList.push(resolve);
    });
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
    while (this.lockCount < this.maxCount && this.waitLockCount > 0) {
      const task = this.waitList.shift();
      if (task) {
        this.lockCount++;
        queueMicrotask(() => task());
      }
    }
    while (this.lockCount == 0 && this.waitLockCount == 0 && this.waitIdleList.length > 0) {
      const idleTask = this.waitIdleList.shift();
      if (idleTask) {
        idleTask?.();
      }
    }
  }
}
