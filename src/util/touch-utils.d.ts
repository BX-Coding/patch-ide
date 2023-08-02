declare module 'touch-utils' {
  interface TouchEvent {
    clientX: number;
    clientY: number;
    touches: TouchList;
    changedTouches: TouchList;
  }

  interface TouchList {
    [index: number]: Touch;
    length: number;
    item(index: number): Touch | null;
  }

  interface Touch {
    clientX: number;
    clientY: number;
  }

  function getEventXY(e: MouseEvent): { x: number; y: number };
  export { getEventXY };

}
