import {
  addDisposer,
  cast,
  getPath,
  onAction,
  types,
  Instance,
  SnapshotIn,
  getEnv,
} from 'mobx-state-tree'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import MenuIcon from '@mui/icons-material/Menu'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseViewModel from '@jbrowse/core/pluggableElementTypes/models/BaseViewModel'
import { MenuItem } from '@jbrowse/core/ui'
import { getSession } from '@jbrowse/core/util'
import BaseResult from '@jbrowse/core/TextSearch/BaseResults'
import {
  LinearGenomeViewModel,
  LinearGenomeViewStateModel,
} from '@jbrowse/plugin-linear-genome-view'
import PluginManager from '@jbrowse/core/PluginManager'
// @ts-ignore
import { ReturnToImportFormDialog } from '@jbrowse/core/ui'

import { ElementId } from '@jbrowse/core/util/types/mst'

export default function stateModelFactory(pluginManager: PluginManager) {
  const defaultHeight = 400
  return types
    .compose(
      'MultilevelLinearView',
      BaseViewModel,
      types.model({
        id: ElementId,
        type: types.literal('MultilevelLinearView'),
        height: defaultHeight,
        trackSelectorType: 'hierarchical',
        linkViews: false,
        interactToggled: false,
        isDescending: true,
        tracks: types.array(
          pluginManager.pluggableMstType('track', 'stateModel'),
        ),
        views: types.array(
          pluginManager.getViewType('LinearGenomeMultilevelView')!
            .stateModel as LinearGenomeViewStateModel,
        ),
      }),
    )
    .volatile(() => ({
      headerHeight: 0,
      width: 800,
    }))
    .views((self) => ({
      get initialized() {
        return self.views.length > 0
      },

      get refNames() {
        return self.views.map((v) => [
          ...new Set(v.staticBlocks.map((m: any) => m.refName)),
        ])
      },

      get assemblyNames() {
        return [...new Set(self.views.map((v) => v.assemblyNames).flat())]
      },

      get numViews() {
        return self.views.length
      },
    }))
    .actions((self) => ({
      setLimitBpPerPx() {
        let prev = -1
        let next = 1
        self.views.forEach((view) => {
          if (prev === -1) {
            // @ts-ignore
            view.setLimitBpPerPx(true, view.bpPerPx, view.bpPerPx)
          }
          if (next === self.views.length) {
            // @ts-ignore
            view.setLimitBpPerPx(false, view.bpPerPx, view.bpPerPx)
          }
          if (prev !== -1 && next !== self.views.length) {
            let upperLimit
            let lowerLimit
            if (self.isDescending) {
              upperLimit = self.views[prev].bpPerPx
              lowerLimit = self.views[next].bpPerPx
            } else {
              upperLimit = self.views[next].bpPerPx
              lowerLimit = self.views[prev].bpPerPx
            }
            // @ts-ignore
            view.setLimitBpPerPx(true, upperLimit, lowerLimit)
          }

          prev++
          next++
        })
      },
      setViews(views: SnapshotIn<LinearGenomeViewModel>[]) {
        self.views = cast(views)
      },
    }))
    .actions((self) => ({
      afterAttach() {
        addDisposer(
          self,
          onAction(self, (param) => {
            if (self.linkViews) {
              const { name, path, args } = param
              const actions = [
                'horizontalScroll',
                'zoomTo',
                'navToLocString',
                'setScaleFactor',
                'showTrack',
                'hideTrack',
                'toggleTrack',
                'moveIfAnchor',
              ]
              if (actions.includes(name) && path) {
                this.onSubviewAction(name, path, args)
              }
            }
          }),
        )
      },

      // automatically removes session assemblies associated with this view
      // e.g. read vs ref
      beforeDestroy() {
        const session = getSession(self)
        self.assemblyNames.forEach((name) => {
          if (name.endsWith('-temp')) {
            session.removeAssembly?.(name)
          }
        })
      },

      onSubviewAction(actionName: string, path: string, args: any[] = []) {
        // @ts-ignore
        const anchorViewIndex = self.views.findIndex((view) => view.isAnchor)
        // @ts-ignore
        const overviewIndex = self.views.findIndex((view) => view.isOverview)
        if (actionName === 'horizontalScroll') {
          self.views.forEach((view) => {
            if (view.initialized) {
              // scroll is proportionate to the view's relation to the anchor view
              const movement =
                view.bpPerPx !== 0
                  ? args[0] *
                    (self.views[anchorViewIndex].bpPerPx / view.bpPerPx)
                  : 0
              // @ts-ignore
              view[actionName](movement)

              const ret = getPath(view)
              // reverse action for the view you're scrolling on
              if (ret.lastIndexOf(path) === ret.length - path.length) {
                // @ts-ignore
                view[actionName](args[0] * -1)
              }
            }
          })
        }

        if (actionName === 'zoomTo') {
          self.views.forEach((view) => {
            if (path.endsWith(anchorViewIndex.toString())) {
              // @ts-ignore
              if (!view.isAnchor && !view.isOverview) {
                if (view.initialized) {
                  // @ts-ignore
                  view.setLimitBpPerPx(false)
                  const rev = view.bpPerPx
                  const factor =
                    view.bpPerPx !== 0
                      ? args[0] /
                        (self.views[anchorViewIndex].bpPerPx / view.bpPerPx)
                      : 0
                  // @ts-ignore
                  view[actionName](factor)
                  const ret = getPath(view)
                  // reverse action for the view you're zooming on
                  if (ret.lastIndexOf(path) === ret.length - path.length) {
                    // @ts-ignore
                    view[actionName](rev)
                  }

                  const center = self.views[anchorViewIndex].pxToBp(
                    view.width / 2,
                  )
                  view.centerAt(center.coord, center.refName, center.index)
                }
              }
            }
          })
          self.setLimitBpPerPx()
        }

        if (actionName === 'navToLocString') {
          self.views[anchorViewIndex][actionName](args[0])
          self.views.forEach((view) => {
            if (view.initialized) {
              // @ts-ignore
              view.setLimitBpPerPx(false)
            }
          })
          self.views.forEach((view) => {
            if (view.initialized) {
              // @ts-ignore
              if (!view.isAnchor) {
                const center = self.views[anchorViewIndex].pxToBp(
                  view.width / 2,
                )
                const targetBp =
                  view.bpPerPx !== 0
                    ? self.views[anchorViewIndex].bpPerPx /
                      // @ts-ignore
                      (self.views[anchorViewIndex].limitBpPerPx.upperLimit /
                        view.bpPerPx)
                    : 0
                view.navToLocString(center.refName)
                view.zoomTo(targetBp)
                view.centerAt(center.coord, center.refName, center.index)
              }
            }
          })
          self.setLimitBpPerPx()
        }

        if (actionName === 'moveIfAnchor') {
          self.views.forEach((view) => {
            if (view.initialized) {
              // @ts-ignore
              view.moveIfAnchor(args[0], args[1])
              // @ts-ignore
              view.setLimitBpPerPx(false)
            }
          })
          self.views.forEach((view) => {
            if (view.initialized) {
              // @ts-ignore
              if (!view.isAnchor && !view.isOverview) {
                const center = self.views[anchorViewIndex].pxToBp(
                  view.width / 2,
                )
                const targetBp =
                  view.bpPerPx !== 0
                    ? self.views[anchorViewIndex].bpPerPx /
                      // @ts-ignore
                      (self.views[anchorViewIndex].limitBpPerPx.upperLimit /
                        view.bpPerPx)
                    : 0
                view.navToLocString(center.refName)
                view.zoomTo(targetBp)
                view.centerAt(center.coord, center.refName, center.index)
              }
            }
          })
          self.setLimitBpPerPx()

          // center the overview
          const center = self.views[anchorViewIndex].pxToBp(
            self.views[overviewIndex].width / 2,
          )
          self.views[overviewIndex].navToLocString(center.refName)
          self.views[overviewIndex].centerAt(
            center.coord,
            center.refName,
            center.index,
          )
        }
      },

      setWidth(newWidth: number) {
        self.width = newWidth
        self.views.forEach((v) => v.setWidth(newWidth))
      },

      setHeight(newHeight: number) {
        self.height = newHeight
      },

      insertView(location: number, view: any) {
        self.views.spliceWithArray(location, 0, [view])
      },

      setHeaderHeight(height: number) {
        self.headerHeight = height
      },

      setIsDescending(toggle: boolean) {
        self.isDescending = toggle
      },

      toggleLinkViews() {
        self.linkViews = !self.linkViews
      },

      alignViews() {
        // @ts-ignore
        const anchorViewIndex = self.views.findIndex((view) => view.isAnchor)
        self.views.forEach((view) => {
          const center = self.views[anchorViewIndex].pxToBp(view.width / 2)
          const targetBp = view.bpPerPx
          view.navToLocString(center.refName)
          view.zoomTo(targetBp)
          view.centerAt(center.coord, center.refName, center.index)
        })
      },

      clearView() {
        self.views = cast([])
        self.linkViews = false
      },

      removeView(target: any) {
        const session = getSession(self)
        const pluginManager = getEnv(session)
        // cannot remove the anchor or the overview -- needs to have minimum these two views
        if (target.isAnchor === false && target.isOverview === false) {
          self.views.remove(target)
          session.notify(`A view has been closed`, 'info', {
            name: 'undo' as any,
            onClick: () => {
              pluginManager.rootModel.history.undo()
            },
          })
        }
      },
    }))
    .actions((self) => ({
      reverseViewsDirection() {
        self.setIsDescending(!self.isDescending)
        self.views.reverse()
      },

      async addView(isAbove: boolean, neighbour: any) {
        const { assemblyManager } = getSession(self)
        const assembly = await assemblyManager.waitForAssembly(
          self.assemblyNames[0],
        )
        if (assembly) {
          let bp = isAbove
            ? neighbour.limitBpPerPx.upperLimit
            : neighbour.limitBpPerPx.lowerLimit

          // @ts-ignore
          const anchor = self.views.find((view) => view.isAnchor)
          // @ts-ignore
          if (bp < anchor?.bpPerPx) {
            // @ts-ignore
            bp = anchor.bpPerPx
          }

          let newView = {
            type: 'LinearGenomeMultilevelView' as const,
            bpPerPx: bp,
            offsetPx: 0,
            displayedRegions: assembly.regions,
          }

          if (neighbour.isOverview) {
            // @ts-ignore
            neighbour.toggleIsOverview()

            const offset = anchor?.offsetPx

            newView = {
              ...newView,
              // @ts-ignore
              isOverview: true,
              offsetPx: offset ? offset : 0,
            }
          }
          if (neighbour.isAnchor && !isAbove) {
            // @ts-ignore
            neighbour.toggleIsAnchor()
            // @ts-ignore
            neighbour.setLimitBpPerPx(true)

            const offset = neighbour?.offsetPx

            newView = {
              ...newView,
              // @ts-ignore
              isAnchor: true,
              offsetPx: offset,
              limitBpPerPx: { limited: false, upperLimit: 1, lowerLimit: 0 },
            }
          }
          const loc = isAbove
            ? self.views.findIndex((view) => view.id === neighbour.id)
            : self.views.findIndex((view) => view.id === neighbour.id) + 1
          self.insertView(loc, newView)
          self.setWidth(self.width)
          self.alignViews()
          self.setLimitBpPerPx()
        }
      },
    }))
    .views((self) => ({
      menuItems() {
        const menuItems: MenuItem[] = []
        menuItems.push(
          {
            label: 'Return to import form',
            onClick: () => {
              getSession(self).queueDialog((handleClose) => [
                ReturnToImportFormDialog,
                { model: self, handleClose },
              ])
            },
            icon: FolderOpenIcon,
          },
          {
            label: 'Reverse views direction',
            icon: SwapVertIcon,
            onClick: self.reverseViewsDirection,
          },
          {
            label: 'Align views',
            onClick: self.alignViews,
            icon: FormatAlignCenterIcon,
          },
          {
            label: self.linkViews ? 'Unlink views' : 'Link views',
            onClick: self.toggleLinkViews,
            icon: self.linkViews ? LinkOffIcon : LinkIcon,
          },
        )
        const subMenuItems: MenuItem[] = []
        self.views.forEach((view, idx) => {
          if (view.menuItems?.()) {
            const label = view.displayName
              ? `${view.displayName} Menu`
              : `View ${idx + 1} Menu`
            subMenuItems.push({
              label: label,
              subMenu: view.menuItems(),
            })
          }
        })
        if (subMenuItems.length > 0) {
          menuItems.push({
            label: 'View Menus',
            subMenu: subMenuItems,
            icon: MenuIcon,
          })
        }
        return menuItems
      },
    }))
    .views((self) => {
      return {
        searchScope(assemblyName: string) {
          return {
            assemblyName,
            includeAggregateIndexes: true,
            tracks: self.tracks,
          }
        },
        rankSearchResults(results: BaseResult[]) {
          // order of rank
          const openTrackIds = self.tracks.map(
            (track) => track.configuration.trackId,
          )
          results.forEach((result) => {
            if (openTrackIds.length !== 0) {
              if (openTrackIds.includes(result.trackId)) {
                result.updateScore(result.getScore() + 1)
              }
            }
          })
          return results
        },
      }
    })
}

export type MultilevelLinearViewStateModel = ReturnType<
  typeof stateModelFactory
>
export type MultilevelLinearViewModel = Instance<MultilevelLinearViewStateModel>
