export default function appendParentWithChild(parentEl: HTMLElement, tag: string, childId?: string) {
  const child = document.createElement(tag);
  if (childId) {
    child.id = childId;
  }
  parentEl.append(child);
  return child;
}
