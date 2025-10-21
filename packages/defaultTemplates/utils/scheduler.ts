export class Scheduler {
  private taskQueue: any[] | undefined
  private index = 0
  private running = 0
  private resultQueue: any[] = []

  constructor(private max: number = 6) {}

  addTask(task: any | any[], immediate: boolean = false) {
    this.taskQueue ??= []

    if (Array.isArray(task)) {
      this.taskQueue.push(...task)
    }
    else {
      this.taskQueue.push(task)
    }

    if (immediate) {
      this.runTask()
    }
  }

  runTask() {
    if (
      this.running >= this.max
      || !this.taskQueue
      || this.taskQueue.length === 0
      || this.index >= this.taskQueue.length
    ) {
      return
    }

    this.running++
    const resultIndex = this.index
    const task = this.taskQueue?.[this.index++]

    if (typeof task === 'function') {
      const maybePromiseOrResult = task()

      if (maybePromiseOrResult instanceof Promise) {
        maybePromiseOrResult
          .then((result) => {
            this.resultQueue[resultIndex] = result
          })
          .catch((error) => {
            this.resultQueue[resultIndex] = error
          })
          .finally(() => {
            this.running--
            this.runTask()
          })
      }
      else {
        try {
          this.resultQueue[resultIndex] = maybePromiseOrResult
        }
        catch (error) {
          this.resultQueue[resultIndex] = error
        }
        finally {
          this.running--
          this.runTask()
        }
      }
    }
    else if (typeof task === 'object' && task instanceof Promise) {
      task
        .then((result) => {
          this.resultQueue[resultIndex] = result
        })
        .catch((error) => {
          this.resultQueue[resultIndex] = error
        })
        .finally(() => {
          this.running--
          this.runTask()
        })
    }
    else {
      this.resultQueue[resultIndex] = task

      this.running--
      this.runTask()
    }
  }
}
