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
  protected waitLockCount = 0;

  /**
   * 等待列表
   */
  protected waitList: Array<(target: AsyncAwaitLock) => void | Promise<void>> =
    [];

  /**
   * 是否锁定
   */
  get isLock() {
    return this.lockCount > 0 || this.waitLockCount > 0;
  }

  /**
   * 等待锁结束
   */
  wait(): Promise<AsyncAwaitLock> {
    return new Promise<AsyncAwaitLock>((resolve) => {
      if (!this.isLock) {
        resolve(this);
        return;
      }
      this.waitList.push(resolve);
    });
  }

  /**
   * 等待锁,内部调用,上锁前校验
   */
  protected waitLock(): Promise<AsyncAwaitLock> {
    return new Promise<AsyncAwaitLock>((resolve) => {
      if (this.lockCount == 0) {
        resolve(this);
        return;
      }
      this.waitList.push(resolve);
    });
  }

  /**
   * 上锁 锁定前必须等待上一个锁结束
   */
  acquire() {
    this.waitLockCount++;
    return this.waitLock().then(() => {
      this.waitLockCount--;
      this.lockCount++;
    });
  }

  /**
   * 解锁
   */
  unlock() {
    if (this.lockCount > 0) {
      this.lockCount--;
    }
    this.triggerWaitEvent();
  }

  /**
   * 触发等待事件
   */
  protected async triggerWaitEvent() {
    const event = this.waitList.shift();
    if (!event) {
      return;
    }
    await event(this);
    await this.triggerWaitEvent();
  }
}
