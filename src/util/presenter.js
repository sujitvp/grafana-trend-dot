import _ from 'lodash'

export class Presenter {
  constructor (options) {
    this.options = options
  }

  call (dots) {
    dots.forEach(dot => this._render(dot))
  }

  _render (dot) {
    if (this.options.tooltipValue === 'trend') {
      dot.displayValue = dot.latestValue
    } else if (this.options.tooltipValue === 'value') {
      dot.displayValue = dot.latestValue
    } else if (this.options.tooltipValue === 'text') {
      dot.displayValue = this._textFor(dot.latestValue)
    } else if (this.options.tooltipValue === 'none') {
      dot.displayValue = ''
    }
    dot.percentChange = this._percentChangeFor(dot)
    if (this.options.colorBy === 'curr') {
      dot.color = this._colorFor(dot.latestValue)
    } else if (this.options.colorBy === 'trnd') {
      dot.color = this._colorFor(dot.percentChange)
    }
  }

  _colorFor (percentChange) {
    var thresholds = this.options.thresholds.concat().sort((a, b) => b.value - a.value)
    var threshold = _.find(thresholds, (threshold) => percentChange >= threshold.value)
    return threshold ? threshold.color : this.options.defaultColor
  }

  _textFor (percentChange) {
    var thresholds = this.options.thresholds.concat().sort((a, b) => b.value - a.value)
    var threshold = _.find(thresholds, (threshold) => percentChange >= threshold.value)
    return threshold ? threshold.label : this.options.defaultText
  }

  _percentChangeFor (dot) {
    var change = dot.latestValue - dot.oldestValue
    return (change / dot.oldestValue) * 100
  }
}
