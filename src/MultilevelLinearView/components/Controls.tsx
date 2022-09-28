import React from 'react'
import { observer } from 'mobx-react'
import { getEnv } from 'mobx-state-tree'
import { Button, FormGroup } from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getSession } from '@jbrowse/core/util'

import { LinearGenomeMultilevelViewModel } from '../../LinearGenomeMultilevelView/model'
import { MultilevelLinearViewModel } from '../model'
import MiniControls from './MiniControls'
import { RegionWidth } from './util'

type MLLV = MultilevelLinearViewModel
type LGMLV = LinearGenomeMultilevelViewModel

const WIDGET_HEIGHT = 32
const SPACING = 7
const HEADER_BAR_HEIGHT = 48

const useStyles = makeStyles()((theme) => ({
  headerBar: {
    gridArea: '1/1/auto/span 2',
    display: 'flex',
    alignItems: 'center',
    height: HEADER_BAR_HEIGHT,
  },
  spacer: {
    flexGrow: 1,
  },
  headerForm: {
    flexWrap: 'nowrap',
    marginRight: 7,
  },
  toggleButton: {
    height: 44,
    border: 'none',
    margin: theme.spacing(0.5),
  },
  searchContainer: {
    marginLeft: 5,
  },
  searchBox: {
    display: 'flex',
  },
  buttonSpacer: {
    marginRight: theme.spacing(2),
  },
  panButton: {
    background: alpha(theme.palette.background.paper, 0.8),
    height: WIDGET_HEIGHT,
    margin: SPACING,
  },
}))

const Polygon = observer(
  ({
    view,
    polygonPoints,
  }: {
    view: LGMLV
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    polygonPoints: any
  }) => {
    const { dynamicBlocks } = view
    const { contentBlocks } = dynamicBlocks
    const { left, right, prevLeft, prevRight } = polygonPoints

    const theme = useTheme()
    // @ts-ignore
    const { tertiary, primary } = theme.palette
    const polygonColor = tertiary ? tertiary.light : primary.light

    if (!contentBlocks.length) {
      return null
    }

    const points = [
      [left, HEADER_BAR_HEIGHT],
      [right, HEADER_BAR_HEIGHT],
      [prevRight, 0],
      [prevLeft, 0],
    ]
    return (
      <polygon
        points={points.toString()}
        fill={alpha(polygonColor, 0.2)}
        stroke={alpha(polygonColor, 0.8)}
        data-testid="polygon"
      />
    )
  },
)

export function PanControls({ model }: { model: LGMLV }) {
  const { classes } = useStyles()
  return (
    <>
      <Button
        variant="outlined"
        className={classes.panButton}
        onClick={() => model.slide(-0.9)}
        data-testid="panleft"
      >
        <ArrowBackIcon />
      </Button>
      <Button
        variant="outlined"
        className={classes.panButton}
        onClick={() => model.slide(0.9)}
        data-testid="panright"
      >
        <ArrowForwardIcon />
      </Button>
    </>
  )
}

const Controls = observer(
  ({
    view,
    model,
    polygonPoints,
    ExtraControls,
  }: {
    view: LGMLV
    model: MLLV
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    polygonPoints?: any
    ExtraControls?: React.ReactNode
  }) => {
    const { classes } = useStyles()

    const pluginManager = getEnv(getSession(model)).pluginManager

    const LGV = pluginManager.getPlugin(
      'LinearGenomeViewPlugin',
    ) as import('@jbrowse/plugin-linear-genome-view').default

    // @ts-ignore
    const { SearchBox } = LGV.exports
    return (
      <div className={classes.headerBar}>
        {model.views[0].id !== view.id ? (
          <svg
            height={HEADER_BAR_HEIGHT}
            style={{ width: '100%', position: 'absolute' }}
          >
            <Polygon view={view} polygonPoints={polygonPoints} />
          </svg>
        ) : null}
        <div className={classes.spacer} />
        {view.isVisible && !view.hideControls && !view.isAnchor ? (
          <>
            <FormGroup row className={classes.headerForm}>
              <PanControls model={view} />
              <SearchBox model={view} />
            </FormGroup>
            <RegionWidth model={view} />
            {ExtraControls}
          </>
        ) : null}
        <div className={classes.spacer} />
        {!view.isVisible ? <MiniControls model={view} /> : null}
      </div>
    )
  },
)

export default Controls
