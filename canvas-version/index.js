(function() {
  "use strict";

  var video = document.querySelector(".camera__video"),
    canvas = document.querySelector(".camera__canvas"),
    context = canvas.getContext("2d");

  var filterElem = document.querySelector('.controls__filter'),
    filterName = filterElem.value;

  filterElem.onchange = function() {
    filterName = filterElem.value;
  };

  var captureFrame = function() {
    context.drawImage(video, 0, 0);

    var image = context.getImageData(0, 0, canvas.width, canvas.height),
      data = image.data;

    var i, result;

    var filters = {
      invert: function() {
        for (i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
      },
      grayscale: function() {
        for (i = 0; i < data.length; i += 4) {
          result = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = result;
        }
      },
      threshold: function() {
        for (i = 0; i < data.length; i += 4) {
          result = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2] >= 128) ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = result;
        }
      }
    };

    filters[filterName]();

    context.putImageData(image, 0, 0);
  };

  var p = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user"
    }
  });

  p.then(function(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.onloadedmetadata = function() {
      video.play();

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      setInterval(captureFrame, 16);
    };
  });

  p.catch(function(error) {
    console.log("The following error occured: " + error.name);
  });

})();
