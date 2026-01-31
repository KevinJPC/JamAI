import React from 'react'

import './DetailsList.css'

export const DetailsList = ({ children, className = '', tooltipTitle }) => {
  return (
    <ul className={`details-list ${className}`} title={tooltipTitle}>
      {children}
    </ul>
  )
}

DetailsList.Item = ({ children, className = '' }) => {
  return (
    <li className={`details-list__item ${className}`}>
      {children}
    </li>
  )
}
