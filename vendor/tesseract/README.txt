Tesseract (reconocimiento de texto) para leer fotos y PDF escaneados. Sin modificar.

  tesseract.min.js, worker.min.js          tesseract.js 7.0.0 (Apache 2.0, LICENSE-tesseract.js.md)
  tesseract-core-*lstm.wasm.js             tesseract.js-core 7.0.0 (Apache 2.0, LICENSE-tesseract.js-core.txt), en tres
                                           variantes (relaxedsimd, simd y sin SIMD): cada teléfono usa la que soporta
  spa.traineddata.gz                       modelo de español «4.0.0_best_int» de @tesseract.js-data/spa 1.0.0 (MIT),
                                           basado en tessdata_best de Tesseract OCR (Apache 2.0)

La app los carga sólo al leer una foto, desde este mismo sitio (no se pide nada a otros).
