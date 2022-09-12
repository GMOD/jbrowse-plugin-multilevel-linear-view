import React from 'react'
import { observer } from 'mobx-react'
import { getEnv } from 'mobx-state-tree'
import { getSession } from '@jbrowse/core/util'

// @ts-ignore
// import { LinearGenomeView } from '@jbrowse/plugin-linear-genome-view'
// import LinearGenomeView from '@jbrowse/plugin-linear-genome-view/src/LinearGenomeView/components/LinearGenomeView'

import { LinearGenomeMultilevelViewModel } from '../model'

type LGMV = LinearGenomeMultilevelViewModel

const LinearGenomeMultilevelView = observer(({ model }: { model: LGMV }) => {
  const pluginManager = getEnv(getSession(model)).pluginManager

  const LGV = pluginManager.getPlugin(
    'LinearGenomeView',
  ) as import('@jbrowse/plugin-linear-genome-view').default

  // @ts-ignore
  const { LinearGenomeView } = LGV.exports

  return <LinearGenomeView model={model} />
})

export default LinearGenomeMultilevelView
