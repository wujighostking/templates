export class Scheduler {
  private taskQueue: any[] | undefined
  private index = 0
  private running = 0
  private resultQueue: any[] = []
  private resolve: ((...args: any[]) => any) | undefined
  private resultPromise: Promise<any>

  constructor(private max: number = 6) {
    this.resultPromise = new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  addTask(task: any | any[]) {
    this.taskQueue ??= []

    if (Array.isArray(task)) {
      this.taskQueue.push(...task)
    }
    else {
      this.taskQueue.push(task)
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

            if (this.resultQueue.length === this.taskQueue?.length) {
              this.resolve?.(this.resultQueue)
            }

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

          if (this.resultQueue.length === this.taskQueue?.length) {
            this.resolve?.(this.resultQueue)
          }

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

          if (this.resultQueue.length === this.taskQueue?.length) {
            this.resolve?.(this.resultQueue)
          }

          this.runTask()
        })
    }
    else {
      this.resultQueue[resultIndex] = task

      this.running--

      if (this.resultQueue.length === this.taskQueue?.length) {
        this.resolve?.(this.resultQueue)
      }

      this.runTask()
    }
  }

  getResults() {
    return this.resultPromise
  }
}
