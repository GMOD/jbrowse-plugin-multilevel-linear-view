import React from 'react'
import { observer } from 'mobx-react'
import { getEnv } from 'mobx-state-tree'
import { makeStyles } from 'tss-react/mui'

import { MultilevelLinearViewModel } from '../model'
import AreaOfInterest from './AreaOfInterest'
import Subheader from './Subheader'
import Header from './Header'
import { bpToPx } from '@jbrowse/core/util'
import ImportForm from './ImportForm'
import { ThemeProvider } from '@emotion/react'
import { createJBrowseTheme } from '@jbrowse/core/ui'

const theme = createJBrowseTheme()

const useStyles = makeStyles()(() => ({
  container: {
    display: 'grid',
  },
  overlay: {
    zIndex: 100,
    gridArea: '1/1',
  },
  content: {
    gridArea: '1/1',
    position: 'relative',
  },
  grid: {
    display: 'grid',
  },
  relative: {
    position: 'relative',
  },
}))

type MLLV = MultilevelLinearViewModel

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setPolygonPoints = (model: any, view: any) => {
  // @ts-ignore
  const anchorView = model.views.find((view) => view.isAnchor)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLeft = (view: any) => {
    const coordA = bpToPx(
      anchorView?.coarseDynamicBlocks[0]?.start,
      {
        start: view.coarseDynamicBlocks[0]?.start,
        end: view.coarseDynamicBlocks[0]?.end,
        reversed: view.coarseDynamicBlocks[0]?.reversed,
      },
      view.bpPerPx,
    )

    const left = !isNaN(coordA)
      ? view.offsetPx < 0
        ? coordA + view.offsetPx * -1
        : coordA
      : 0

    return left
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRight = (view: any) => {
    const coordB = bpToPx(
      anchorView?.coarseDynamicBlocks[0]?.end,
      {
        start: view.coarseDynamicBlocks[0]?.start,
        end: view.coarseDynamicBlocks[0]?.end,
        reversed: view.coarseDynamicBlocks[0]?.reversed,
      },
      view.bpPerPx,
    )
    const right = !isNaN(coordB)
      ? view.offsetPx < 0
        ? coordB + view.offsetPx * -1
        : coordB
      : 0

    return right
  }

  const left = getLeft(view)
  const right = getRight(view)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let index = model.views.findIndex((target: any) => target.id === view.id)
  if (index > 0) {
    index--
  }
  const targetView = model.views[index]

  const prevLeft = getLeft(targetView)
  const prevRight = getRight(targetView)

  const polygonPoints = {
    left,
    right,
    prevLeft,
    prevRight,
  }
  return polygonPoints
}

const MultilevelLinearView = observer(
  (props: { model: MLLV; ExtraButtons?: React.ReactNode }) => {
    const { classes } = useStyles()
    const { model, ExtraButtons } = props
    const { pluginManager } = getEnv(model)

    const { initialized } = model
    if (!initialized) {
      return <ImportForm model={model} />
    }

    return (
      <ThemeProvider theme={theme}>
        <div>
          <Header model={model} ExtraButtons={ExtraButtons} />
          <div className={classes.container}>
            <div className={classes.content}>
              <div className={classes.relative}>
                {model.views.map((view) => {
                  const { ReactComponent } = pluginManager.getViewType(
                    view.type,
                  )!

                  if (!model.initialized || !view.initialized) {
                    return null
                  }

                  const polygonPoints = setPolygonPoints(model, view)

                  return (
                    <div key={view.id}>
                      <>
                        {!view.hideHeader && view.id !== model.views[0].id ? (
                          <Subheader
                            // @ts-ignore
                            view={view}
                            model={model}
                            polygonPoints={polygonPoints}
                          />
                        ) : null}
                        {
                          // @ts-ignore
                          !view.isAnchor &&
                          // @ts-ignore
                          view.isVisible ? (
                            <AreaOfInterest
                              // @ts-ignore
                              view={view}
                              model={model}
                              polygonPoints={polygonPoints}
                            />
                          ) : null
                        }
                      </>
                      {
                        // @ts-ignore
                        view.isVisible ? (
                          <>
                            <ReactComponent key={view.id} model={view} />
                          </>
                        ) : null
                      }
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  },
)

export default MultilevelLinearView
