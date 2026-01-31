// export function findClosestBinarySearch (arr, target) {
//   let left = 0; let right = arr.length - 1
//   while (left < right) {
//     if (Math.abs(arr[left] - target) <= Math.abs(arr[right] - target)) {
//       right--
//     } else {
//       left++
//     }
//   }
//   return left
// }

export function findClosestBinarySearch (arr, target) {
  let left = 0
  let right = arr.length - 1

  while (left < right) {
    const mid = Math.floor((left + right) / 2)

    if (arr[mid] === target) return mid

    if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid
    }
  }

  // After loop, left == right
  // Check which of left or left-1 is closer
  if (left > 0 && Math.abs(arr[left - 1] - target) <= Math.abs(arr[left] - target)) {
    return left - 1
  }
  return left
}
