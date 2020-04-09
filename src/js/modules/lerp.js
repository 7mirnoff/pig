const lerp = (start, finish, progress) => {
  return start + progress * (finish - start)
}

export { lerp }
