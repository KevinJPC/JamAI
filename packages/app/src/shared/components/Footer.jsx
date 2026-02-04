import classNames from 'classnames'

import { Link } from './Link.jsx'

import './Footer.css'

export const Footer = ({ className }) => {
  return (
    <footer className={classNames('footer', className)}>
      <span>Developed by <Link external decorator to='https://www.linkedin.com/in/kevinpitti/'>@kevinpitti</Link></span>
      <Link external decorator to='https://github.com/KevinJPC/JamAI'>GitHub repository</Link>
    </footer>
  )
}
