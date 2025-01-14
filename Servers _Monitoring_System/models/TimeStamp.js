class TimeStamp {
  constructor() {
    const date = new Date()
    this.year = date.getFullYear()
    this.month = date.getMonth()+1
    this.day = date.getDate()
    this.hour = date.getHours()
    this.minute = date.getMinutes()
    this.second = date.getSeconds()
  }

  logTime() {
    console.log(`\x1b[38;5;14m ${this.day}/${this.month}/${this.year} |  ${this.hour} : ${this.minute} : ${this.second} ↓\x1b[0m  `);
  }
}

module.exports = TimeStamp
