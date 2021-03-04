export function imageReducer(state, { type, payload }) {
  switch (type) {
    case 'SET_IMAGE':
      return {
        url: payload.url,
        filename: payload.filename,
        dirty: true,
        position: 50
      }
    case 'UPDATE_IMAGE_POSITION':
      return { ...state, position: payload }
    case 'REMOVE_IMAGE':
      return {
        url: null,
        filename: null,
        position: 50,
        dirty: false
      }
    case 'RESET':
      return {
        url: payload.url,
        filename: payload.filename,
        position: payload.position,
        dirty: false
      }
    default:
      return state
  }
}

export function defaultImageState(item) {
  return {
    url: item?.image && `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${item?.image}`,
    filename: item?.image,
    position: item?.image_position ?? 50,
    dirty: false
  }
}
