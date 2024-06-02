const scale =
  (ratio: number) =>
  (item: unknown): unknown => {
    if (typeof item === "number") {
      return item * ratio;
    }
    return item;
  };

/**
 * Extracted from https://github.com/component/autoscale-canvas
 * @param {Canvas} canvas
 * @return {Canvas}
 */
function autoScaleCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  if (ratio !== 1) {
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.width *= ratio;
    canvas.height *= ratio;
    ctx.scale(ratio, ratio);
    ctx.isPointInPath = (...args: unknown[]) =>
      CanvasRenderingContext2D.prototype.isPointInPath.apply(
        ctx,
        args.map(scale(ratio)),
      );
  }
  return canvas;
}

window.autoScaleCanvas = autoScaleCanvas;
