// ---------------------------------------------------------------------------
// Shared host registry — used by both SgToastHost and SgToaster.
//
// SgToastHost instances push/pop themselves onto this stack.
// SgToaster subscribes: if the stack is non-empty it yields to the active host.
// ---------------------------------------------------------------------------

let _counter = 0;
const _stack: string[] = [];
const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach((fn) => fn());
}

export function registerHost(id: string) {
  if (!_stack.includes(id)) {
    _stack.push(id);
    _notify();
  }
}

export function unregisterHost(id: string) {
  const i = _stack.indexOf(id);
  if (i >= 0) {
    _stack.splice(i, 1);
    _notify();
  }
}

export function getActiveHostId(): string | null {
  return _stack[_stack.length - 1] ?? null;
}

export function hasAnyHost(): boolean {
  return _stack.length > 0;
}

export function subscribeHostRegistry(fn: () => void): () => void {
  _listeners.add(fn);
  return () => {
    _listeners.delete(fn);
  };
}

export function nextHostId(): string {
  _counter += 1;
  return `sg-toast-host-${_counter}`;
}
