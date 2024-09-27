document.getElementById("convertBtn").addEventListener("click", convertImageToNoise);

function convertImageToNoise() {
    const input = document.getElementById('imageInput');
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

            // Создание нового canvas для вывода результата
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
                            if (bit === 1) {
                                const pixelIndex = ((y * 3 + yMove) * newCanvas.width + (x * 8 + j)) * 4;
                                newPixels[pixelIndex] = 255;         // Red
                                newPixels[pixelIndex + 1] = 255;     // Green
                                newPixels[pixelIndex + 2] = 255;     // Blue
                                newPixels[pixelIndex + 3] = 255;     // Alpha (прозрачность)
                            } else {
                                const pixelIndex = ((y * 3 + yMove) * newCanvas.width + (x * 8 + j)) * 4;
                                newPixels[pixelIndex] = 0;           // Red
                                newPixels[pixelIndex + 1] = 0;       // Green
                                newPixels[pixelIndex + 2] = 0;       // Blue
                                newPixels[pixelIndex + 3] = 255;     // Alpha
                            }
                        }
                    });
                }
            }

            // Отображение обработанных данных на канвасе
            newCtx.putImageData(newImgData, 0, 0);

            // Показать кнопку скачивания
            const downloadBtn = document.getElementById("downloadBtn");
            const imageUrl = newCanvas.toDataURL("image/png");
            downloadBtn.href = imageUrl;
            downloadBtn.style.display = 'inline-block';  // Показать кнопку скачивания
            alert('Conversion finished and image is displayed!');
        };
    };

    reader.readAsDataURL(file);
}
