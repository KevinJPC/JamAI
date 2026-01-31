import classNames from 'classnames'

import './List.css'

export function List ({ results, className, renderItem, itemKeyFn }) {
  return (
    <ul className={classNames('list', className)}>
      {results.map((result, index) => (
        <li key={itemKeyFn(result, index)}>
          {renderItem(result, index)}
        </li>
      ))}
    </ul>
  )
}
