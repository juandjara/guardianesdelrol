export default function dedupeAndCount(items = []) {
  if (!items.every(d => d.id)) {
    throw new Error('[dedupeAndCount.js] invalid structure. All items must have an id property')
  }

  const count = {}
  const deduped = []
  for (const item of items) {
    if (count[item.id]) {
      count[item.id]++
    } else {
      count[item.id] = 1
      deduped.push(item)
    }
  }

  return {
    count,
    items: deduped
  }
}
