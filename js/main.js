class VideoPlayer {
  constructor(media) {
    this.media = media;
  }
  play(url, at, callback) {
    this.media.src = url;
    this.media.onloadedmetadata = function() {
      console.log("duration: ", this.duration)
      console.log("currentTime: ", this.currentTime)
      //this.media.currentTime = at/1000;
      this.play();
      // Alwasy go to the end for now

      this.currentTime = this.duration - 2
      this.onended = function(e) {
        callback();
      };
    }
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

