import React from 'react'
import { observer } from 'mobx-react'
import { Typography } from '@mui/material'
import { LinearGenomeMultilevelViewModel } from '../../LinearGenomeMultilevelView/model'

type LGV = LinearGenomeMultilevelViewModel

export const RegionWidth = observer(({ model }: { model: LGV }) => {
  const { coarseTotalBp } = model
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: 10,
      }}
    >
      {Math.round(coarseTotalBp).toLocaleString('en-US')} bp
    </Typography>
  )
})
