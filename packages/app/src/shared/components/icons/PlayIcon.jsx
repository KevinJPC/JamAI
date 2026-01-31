export const PlayIcon = ({ size = 24, ...props }) =>
  // <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='3.5 3.5 17 17' {...props}>
  //   <path fillRule='evenodd' d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' clipRule='evenodd' />
  // </svg>
  <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} fill='currentColor' viewBox='0 0 24 24' {...props}>
    <g transform='translate(0, -.5)'>
      <path fillRule='evenodd' d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z' clipRule='evenodd' />
    </g>
  </svg>
