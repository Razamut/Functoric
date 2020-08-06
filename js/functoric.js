function getFunctoric(videos, videoPlayer) {
  return {
    player: null,
    lectureState: {
      lecture: null,
      position: null,
      generation: -1,
    },
    start: function (lecture) {
      this.reset();
      this.lectureState.lecture = lecture;
      this.showLectureTitle(lecture.title);
      this.player = this.createPlayer();
      this.advance(lecture.entryPoint);
    },
    advance: function (nodeId) {
      console.log("#advance", nodeId, this.lectureState);
      var lecture = this.lectureState.lecture;
      if (lecture == null) throw new Error("There is no current lecture");
      var node = lecture.nodes[nodeId];
      if (!node) throw new Error("No such node: " + nodeId);
      this.lectureState.generation++;
      this.lectureState.lecture = lecture;
      this.lectureState.node = node;
      switch (node.type) {
        case "Video": {
          this.player.play(node.url, 136000, this.onVideoFinished.bind(this, this.snapshot()))
          break;
        }
        case "Question": {
          this.showQuestion(node);
          break;
        }
      }
    },
    reset: function () {
      if (this.player != null) {
        this.player.dispose();
        this.player = null;
      }
      this.showLectureTitle("");
      this.lectureState = {
        lecture: null,
        node: null,
        generation: this.lectureState.generation + 1
      };
    },
    snapshot: function () {
      return Object.assign({}, this.lectureState);
    },
    showLectureTitle: function (title) {
      document.getElementById("lecture-title").innerHTML = title;
    },
    showQuestion: function (questionNode) {
      document.getElementById("question-prompt").innerHTML = questionNode.prompt;
      let answersElement = document.getElementById("question-answers");
      answersElement.innerHTML = "";
      for (let answer in questionNode.answers) {
        let answerElement = document.createElement("input");
        answerElement.setAttribute("type", "radio");
        answerElement.setAttribute("name", "question");
        answerElement.setAttribute("value", answer);
        answersElement.appendChild(answerElement);
        let labelElement = document.createElement("label");
        labelElement.setAttribute("for", answer);
        labelElement.innerHTML = answer + ") " + questionNode.answers[answer];
        answersElement.appendChild(labelElement);
        answersElement.appendChild(document.createElement("br"))
      }
    },
    onVideoFinished: function (snapshot) {
      if (this.lectureState.generation !== snapshot.generation) {
        console.log("#onVideoFinished called with wrong generation. Ignoring callback.", this.lectureState, snapshot)
        return;
      }
      let nextNodeId = this.lectureState.node.next;
      this.advance(nextNodeId);
    },
    onQuestionAnswered: function () {
      // TODO: do some sort of consistency check here
      let answersElement = document.getElementById("question-answers");
      let answer = answersElement.elements["question"].value;
      if (!answer) {
        alert("You must answer the question to proceed!")
        return;
      }
      let nextNodeId = this.lectureState.node.next[answer];
      this.advance(nextNodeId);
    },
    createPlayer: function () {
      // TODO: call sebastian's code
      return videoPlayer;
    },
    lectures: {
      "lecture0": {
        title: "Riemannian Geometry",
        entryPoint: "V0",
        nodes: {
          "V0": {
            type: "Video",
            url: videos[0], // TODO: add video url here
            next: "Q0"
          },
          "Q0": {
            type: "Question",
            prompt: "How many conditions must the family of open subsets of a topological space satisfy?",
            answers: {
              "a": "2",
              "b": "3",
              "c": "5",
              "d": "4"
            },
            next: {
              "a": "Q1", // <-- This is the right answer! So we go to the Q1 so the student can answer more
              "b": "V1", // <-- This is the wrong answer! So we go to the V1 so the student can learn more
              "c": "V1", // <-- This is the wrong answer! So we go to the V1 so the student can learn more
              "d": "V1"  // <-- This is the wrong answer! So we go to the V1 so the student can learn more
            }
          },
          "Q1": {
            type: "Question",
            prompt: "The empty set, is by definition a member of the family of open subsets of a topological space.",
            answers: {
              "a": "True",
              "b": "False",
              "c": "Neither"
            },
            next: {
              "a": "V1", // <-- This is the right answer! So we go to the Q1 so the student can answer more
              "b": "V1", // <-- This is the wrong answer! So we go to the V1 so the student can learn more
              "c": "Q2", // <-- This is the wrong answer! So we go to the V1 so the student can learn more
            }
          },
          // TODO: Enter the remainder of the V1 questions here: Q1, Q2
          "V1": {
            type: "Video",
            url: videos[5], // TODO: add video url here
            next: "Q3"
          }
          // TODO: Enter the remainder of the nodes here...
        }
      }
    }
  }
}
