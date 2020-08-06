class VideoPlayer {
  constructor(media) {
    this.media = media;
  }
  play(url, at, callback) {
    this.media.src = url;
    this.media.currentTime = at/1000;
    this.media.play();
    this.media.onended = function(e) {
      callback();
    };
  }

  stop() {
    this.media.pause();
  }

  dispose() {
    this.stop();
    this.media.src = "";
    this.media.currentTime = 0;
  }
}

