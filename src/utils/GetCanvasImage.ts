export default function GetCanvasImage(canvas: HTMLCanvasElement): ImageData {
    var ctx = canvas.getContext('2d');
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return imgData;
}
