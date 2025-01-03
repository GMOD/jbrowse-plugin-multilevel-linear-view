import React from 'react'
import { observer } from 'mobx-react'

import type LGVPlugin from '@jbrowse/plugin-linear-genome-view'
import { LinearGenomeMultilevelViewModel } from '../model'
import { getEnv } from '@jbrowse/core/util'

type LGMV = LinearGenomeMultilevelViewModel

const LinearGenomeMultilevelView = observer(({ model }: { model: LGMV }) => {
  const { pluginManager } = getEnv(model)
  const LGVPlugin = pluginManager.getPlugin(
    'LinearGenomeViewPlugin',
  ) as LGVPlugin
  const { LinearGenomeView } = LGVPlugin.exports
  return <LinearGenomeView model={model} />
})

export default LinearGenomeMultilevelView
