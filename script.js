document.getElementById("convertBtn").addEventListener("click", convertImage);

function convertImage() {
    const input = document.getElementById('imageInput');
    const algorithm = document.getElementById('algorithmSelect').value;

    if (!input.files.length) {
        alert('Please select an image first.');
        return;
    }

    const file = input.files[0];
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(event) {
        img.src = event.target.result;
        img.onload = function() {
            const imgW = img.width;
            const imgH = img.height;

            const canvas = document.createElement('canvas');
            canvas.width = imgW;
            canvas.height = imgH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, imgW, imgH);
            const pixels = imgData.data;

            if (algorithm === "noise") {
                convertToNoise(imgW, imgH, pixels);
            } else if (algorithm === "gray") {
                convertToGray(imgW, imgH, pixels);
            }else if (algorithm === "cursedGrayLight") {
                convertToCurLightGray(imgW, imgH, pixels);
            }else if (algorithm === "cursedGrayDark") {
                convertToCurDarkGray(imgW, imgH, pixels);
            }
        };
    };

    reader.readAsDataURL(file);
}

function convertToNoise(imgW, imgH, pixels) {
    const newCanvas = document.getElementById('outputCanvas');
    newCanvas.width = imgW * 8;
    newCanvas.height = imgH * 3;
    const newCtx = newCanvas.getContext('2d');
    const newImgData = newCtx.createImageData(newCanvas.width, newCanvas.height);
    const newPixels = newImgData.data;

    for (let y = 0; y < imgH; y++) {
        for (let x = 0; x < imgW; x++) {
            const i = (y * imgW + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            [r, g, b].forEach((color, channelIndex) => {
                const yMove = channelIndex;
                for (let j = 0; j < 8; j++) {
                    const bit = (color >> (7 - j)) & 1;
                    const pixelIndex = ((y * 3 + yMove) * newCanvas.width + (x * 8 + j)) * 4;
                    if (bit === 1) {
                        newPixels[pixelIndex] = 255;
                        newPixels[pixelIndex + 1] = 255;
                        newPixels[pixelIndex + 2] = 255;
                        newPixels[pixelIndex + 3] = 255;
                    } else {
                        newPixels[pixelIndex] = 0;
                        newPixels[pixelIndex + 1] = 0;
                        newPixels[pixelIndex + 2] = 0;
                        newPixels[pixelIndex + 3] = 255;
                    }
                }
            });
        }
    }

    newCtx.putImageData(newImgData, 0, 0);
    showDownloadButton(newCanvas);
}

function convertToGray(imgW, imgH, pixels) {
    const newCanvas = document.getElementById('outputCanvas');
    newCanvas.width = imgW;
    newCanvas.height = imgH;
    const newCtx = newCanvas.getContext('2d');
    const newImgData = newCtx.createImageData(imgW, imgH);
    const newPixels = newImgData.data;

    for (let y = 0; y < imgH; y++) {
        for (let x = 0; x < imgW; x++) {
            const i = (y * imgW + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            const gray = Math.floor((r + g + b) / 3);
            const newI = (y * imgW + x) * 4;
            newPixels[newI] = gray;
            newPixels[newI + 1] = gray;
            newPixels[newI + 2] = gray;
            newPixels[newI + 3] = 255;
        }
    }

    newCtx.putImageData(newImgData, 0, 0);
    showDownloadButton(newCanvas);
}

function convertToCurLightGray(imgW, imgH, pixels) {
    const newCanvas = document.getElementById('outputCanvas');
    newCanvas.width = imgW;
    newCanvas.height = imgH;
    const newCtx = newCanvas.getContext('2d');
    const newImgData = newCtx.createImageData(imgW, imgH);
    const newPixels = newImgData.data;

    for (let y = 0; y < imgH; y++) {
        for (let x = 0; x < imgW; x++) {
            const i = (y * imgW + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            var gray;

            if ((r + g + b) >= 255){
                gray = Math.floor((r + g + b - 255) / 3);
            } else {
                gray = Math.floor((r + g + b) / 3);
            }
            const newI = (y * imgW + x) * 4;
            newPixels[newI] = gray;
            newPixels[newI + 1] = gray;
            newPixels[newI + 2] = gray;
            newPixels[newI + 3] = 255;
        }
    }

    newCtx.putImageData(newImgData, 0, 0);
    showDownloadButton(newCanvas);
}

function convertToCurDarkGray(imgW, imgH, pixels) {
    const newCanvas = document.getElementById('outputCanvas');
    newCanvas.width = imgW;
    newCanvas.height = imgH;
    const newCtx = newCanvas.getContext('2d');
    const newImgData = newCtx.createImageData(imgW, imgH);
    const newPixels = newImgData.data;

    for (let y = 0; y < imgH; y++) {
        for (let x = 0; x < imgW; x++) {
            const i = (y * imgW + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            var gray;

            if ((r + g + b) >= 255){
                gray = Math.floor((r + g + b - 255) / 3);
            } else {
                gray = Math.floor((r + g + b) / 3);
            }
            const newI = (y * imgW + x) * 4;
            newPixels[newI] = gray;
            newPixels[newI + 1] = gray;
            newPixels[newI + 2] = gray;
            newPixels[newI + 3] = 255;
        }
    }

    newCtx.putImageData(newImgData, 0, 0);
    showDownloadButton(newCanvas);
}

function showDownloadButton(canvas) {
    const downloadBtn = document.getElementById("downloadBtn");
    const imageUrl = canvas.toDataURL("image/png");

    // Показываем canvas после конвертации
    canvas.style.display = 'block';
    
    downloadBtn.href = imageUrl;
    downloadBtn.style.display = 'inline-block';
    //alert('Conversion finished and image is displayed!');
}