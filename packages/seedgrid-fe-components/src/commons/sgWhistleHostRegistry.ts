// ---------------------------------------------------------------------------
// Shared host registry — used by both SgWhistleHost and SgWhistler.
//
// SgWhistleHost instances push/pop themselves onto this stack.
// SgWhistler subscribes: if the stack is non-empty it yields to the active host.
// (Espelha sgToastHostRegistry: SgWhistleHost:SgWhistler == SgToastHost:SgToaster.)
// ---------------------------------------------------------------------------

let _counter = 0;
const _stack: string[] = [];
const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach((fn) => fn());
}

export function registerWhistleHost(id: string) {
  if (!_stack.includes(id)) {
    _stack.push(id);
    _notify();
  }
}

export function unregisterWhistleHost(id: string) {
  const i = _stack.indexOf(id);
  if (i >= 0) {
    _stack.splice(i, 1);
    _notify();
  }
}

export function getActiveWhistleHostId(): string | null {
  return _stack[_stack.length - 1] ?? null;
}

export function hasAnyWhistleHost(): boolean {
  return _stack.length > 0;
}

export function subscribeWhistleHostRegistry(fn: () => void): () => void {
  _listeners.add(fn);
  return () => {
    _listeners.delete(fn);
  };
}

export function nextWhistleHostId(): string {
  _counter += 1;
  return `sg-whistle-host-${_counter}`;
}
