import './module.css!'
import _ from 'lodash'
import kbn from 'app/core/utils/kbn'
import {MetricsPanelCtrl} from 'app/plugins/sdk'
import {Builder} from './util/builder'
import {Presenter} from './util/presenter'

const panelDefaults = {
  radius: '20px',
  defaultColor: 'rgb(117, 117, 117)',
  thresholds: [],
  format: 'none',
  decimals: 2,
  display: 'value',
  defaultText: ''
}

export class TrendDotCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $log, $filter, annotationsSrv) {
    super($scope, $injector)

    this.filter = $filter

    _.defaults(this.panel, panelDefaults)

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this))
    this.events.on('data-received', this.onDataReceived.bind(this))
    this.events.on('render', this.onRender.bind(this))

    this.builder = new Builder(this.panel)
    this.presenter = new Presenter(this.panel)
  }

  onInitEditMode () {
    this.addEditorTab('Options', 'public/plugins/btplc-trend-dot-panel/editor.html')
    this.unitFormats = kbn.getUnitFormats()
  }

  onDataReceived (seriesList) {
    this.seriesList = seriesList
    this.render()
  }

  onRender () {
    this.dots = this.builder.call(this.seriesList)
    this.presenter.call(this.dots)
  }

  onEditorSetFormat (subitem) {
    this.panel.format = subitem.value
    this.render()
  }

  onEditorAddThreshold () {
    this.panel.thresholds.push({ value: 0, color: this.panel.defaultColor })
    this.render()
  }

  onEditorRemoveThreshold (index) {
    this.panel.thresholds.splice(index, 1)
    this.render()
  }

  styleFor (dot) {
    return { 'background': dot.color, 'width': this.panel.radius, 'height': this.panel.radius }
  }

  linkFor (dot) {
    return this.filter('interpolateTemplateVars')(this.panel.linkURL, this.$scope).replace('$$__dotname', dot.name)
  }

  linkTest () {
    return this.panel.linkURL === ''
  }

  format (dot, format = this.panel.format) {
    var formatFunc = kbn.valueFormats[format]
    var retval
    if (this.panel.tooltipValue === 'value') {
      retval = formatFunc(dot.displayValue, this.panel.decimals, null)
    } else {
      retval = dot.displayValue
    }
    if (this.panel.colorBy === 'trnd') {
      retval = retval + ' (' + formatFunc(dot.percentChange, this.panel.decimals, null) + ')'
    }
    return retval
  }
}

TrendDotCtrl.templateUrl = 'module.html'
export { TrendDotCtrl as PanelCtrl }
