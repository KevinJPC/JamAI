import classNames from 'classnames'

import { Link } from './Link.jsx'

import './Footer.css'

export const Footer = ({ className }) => {
  return (
    <footer className={classNames('footer', className)}>
      <span>Developed by <Link external decorator to='#'>@kevinjpc</Link></span>
      <Link external decorator to='#'>GitHub repository</Link>
    </footer>
  )
}
