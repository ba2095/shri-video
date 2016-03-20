(function() {
  "use strict";

  var video = document.querySelector(".camera__video");

  var canvas = document.querySelector(".camera__canvas");
  var context = canvas.getContext("2d");

  var filterElem = document.querySelector('.controls__filter');
  filterElem.value = "invert";

  var thresholdInterval;

  var p = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      frameRate: {
        ideal: 60
      }
    }
  });

  p.then(function(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.onloadedmetadata = function() {
      video.play();

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      applyFilter();
    };
  });

  p.catch(function(error) {
    console.log("The following error occured: " + error.name);
  });

  var captureFrame = function() {
    context.drawImage(video, 0, 0);

    var image = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = image.data;
    var result;

    for (var i = 0; i < data.length; i += 4) {
      result = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2] >= 128) ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = result;
    }

    context.putImageData(image, 0, 0);
  };

  var applyFilter = function() {
    var filterName = filterElem.value;

    switch (filterName) {
      case "invert":
      case "grayscale":
        if (filterName === "invert") {
          video.classList.toggle("camera__video___grayscale", false);
          video.classList.toggle("camera__video___invert", true);

        } else {
          video.classList.toggle("camera__video___invert", false);
          video.classList.toggle("camera__video___grayscale", true);

        }
        canvas.classList.add("camera__element___hidden");
        video.classList.remove("camera__element___hidden");

        if (thresholdInterval) {
          clearInterval(thresholdInterval);
          thresholdInterval = null;

        }
        break;

      case "threshold":
        if (thresholdInterval == null) {
          thresholdInterval = setInterval(captureFrame, 16);

        }
        video.classList.toggle("camera__video___grayscale", false);
        video.classList.toggle("camera__video___invert", false);

        video.classList.add("camera__element___hidden");
        canvas.classList.remove("camera__element___hidden");

        break;

      default:
        console.log("Unknown filter: " + filterName);
    }
  };

  filterElem.onchange = function() {
    applyFilter();
  };

})();
