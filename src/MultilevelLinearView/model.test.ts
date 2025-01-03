//@ts-nocheck
import PluginManager from '@jbrowse/core/PluginManager'
import LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'
import LinearGenomeMultilevelView from '../LinearGenomeMultilevelView'
import stateModelFactory from './model'
import '@testing-library/jest-dom/extend-expect'

test('creation', () => {
  console.warn = jest.fn()
  const pluginManager = new PluginManager([new LinearGenomeViewPlugin()])
  pluginManager.addViewType(() =>
    pluginManager.jbrequire(LinearGenomeMultilevelView),
  )
  pluginManager.createPluggableElements()
  pluginManager.configure()
  const model = stateModelFactory(pluginManager)
  model.create({
    id: 'MiDMyyWpxp',
    // @ts-ignore
    type: 'MultilevelLinearView',
    displayName: 'MLLV Default',
    linkViews: true,
    views: [
      {
        id: 'MoMeeVade',
        // @ts-ignore
        type: 'LinearGenomeMultilevelView',
        displayName: 'Overview',
        bpPerPx: 100000,
        isOverview: true,
        displayedRegions: [
          {
            refName: '3',
            start: 0,
            end: 186700647,
            assemblyName: 'hg38',
          },
        ],
        tracks: [
          {
            id: 'foo',
            type: 'BasicTrack',
            height: 20,
            configuration: 'testConfig',
            displays: [
              {
                type: 'LinearBareDisplay',
                configuration: 'testConfig-LinearBareDisplay',
              },
            ],
          },
        ],
      },
      {
        id: 'MoMeeVasdfade',
        // @ts-ignore
        type: 'LinearGenomeMultilevelView',
        displayName: 'Region',
        bpPerPx: 100,
        displayedRegions: [
          {
            refName: '3',
            start: 0,
            end: 186700647,
            assemblyName: 'hg38',
          },
        ],
        tracks: [
          {
            id: 'foo',
            type: 'BasicTrack',
            height: 20,
            configuration: 'testConfig',
            displays: [
              {
                type: 'LinearBareDisplay',
                configuration: 'testConfig-LinearBareDisplay',
              },
            ],
          },
        ],
      },
      {
        id: 'MoasdfMeeVade',
        // @ts-ignore
        type: 'LinearGenomeMultilevelView',
        displayName: 'Details',
        bpPerPx: 1,
        isAnchor: true,
        displayedRegions: [
          {
            refName: '3',
            start: 85313457,
            end: 86313456,
            assemblyName: 'hg38',
          },
        ],
        tracks: [
          {
            id: 'foo',
            type: 'BasicTrack',
            height: 20,
            configuration: 'testConfig',
            displays: [
              {
                type: 'LinearBareDisplay',
                configuration: 'testConfig-LinearBareDisplay',
              },
            ],
          },
        ],
      },
    ],
  })
})
