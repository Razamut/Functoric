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
            url: videos[0],
            next: "Q0.0"
          },
          "Q0.0": {
            type: "Question",
            prompt: "How many conditions must the family of open subsets of a topological space satisfy?",
            answers: {
              "a": "2",
              "b": "3",
              "c": "5",
              "d": "4"
            },
            next: {
              "a": "Q0.1",
              "b": "V1",
              "c": "V1",
              "d": "V1"
            }
          },
          "Q0.1": {
            type: "Question",
            prompt: "The empty set, is by definition a member of the family of open subsets of a topological space.",
            answers: {
              "a": "True",
              "b": "False",
              "c": "Neither"
            },
            next: {
              "a": "V1",
              "b": "V1",
              "c": "Q0.2",
            }
          },
          "Q0.2": {
            type: "Question",
            prompt: "If for any two distinct points p1, p2, in a topological space M, we can always find open neighborhoods p1 ε Ω1, and p2 ε Ω2 such that Ω1 ∩ Ω2 = O, the topological space M is said to be:",
            answers: {
              "a": "Paracompact",
              "b": "Connected",
              "c": "Hausdorff",
              "d": "Differentiable"
            },
            next: {
              "a": "V1",
              "b": "V1",
              "c": "Q1.0",
              "d": "V1",
            }
          },
          "V1": {
            type: "Video",
            url: videos[1],
            next: "Q1.0"
          },
          "Q1.0": {
            type: "Question",
            prompt: "Do you know what an open covering is?",
            answers: {
              "a": "Yes",
              "b": "No",
            },
            next: {
              "a": "V2",
              "b": "Q1.1",
            }
          },
          "Q1.1": {
            type: "Question",
            prompt: "When is a covering locally finite?",
            answers: {
              "a": "When there are finite number of open sets in the covering",
              "b": "When every point has an open neighborhood in the covering",
              "c": "When every two distinct points have non intersecting neighborhoods belonging to the covering",
              "d": "When every point has a neighborhood that intersects only finitely many members of the covering"
            },
            next: {
              "a": "V2",
              "b": "V2",
              "c": "V2",
              "d": "Q2.0",
            }
          },
          "V2": {
            type: "Video",
            url: videos[2],
            next: "Q2.0"
          },
          "Q2.0": {
            type: "Question",
            prompt: "For a topological space M, if every open covering has a locally finite refinement, M is said to be:",
            answers: {
              "a": "Finite",
              "b": "Locally refined",
              "c": "Paracompact",
              "d": "Continuous"
            },
            next: {
              "a": "V3",
              "b": "V3",
              "c": "Q3.0",
              "d": "V3",
            }
          },
          "V3": {
            type: "Video",
            url: videos[3],
            next: "Q3.0"
          },
          "Q3.0": {
            type: "Question",
            prompt: "When is a map between two topological spaces f: M → N said to be continuous?",
            answers: {
              "a": "When is a map between two topological spaces f: M → N said to be continuous?",
              "b": "When the pre-image of every open set in N is also open in M.",
              "c": "When the map f has an inverse",
              "d": "When the map f can be differentiated at a point in M"
            },
            next: {
              "a": "V4",
              "b": "Q3.1",
              "c": "V4",
              "d": "V4",
            }
          },
          "Q3.1": {
            type: "Question",
            prompt: "Can you articulate what a homeomorphism is?",
            answers: {
              "a": "No",
              "b": "Yes",
            },
            next: {
              "a": "V4",
              "b": "V4",
            }
          },
          "V4": {
            type: "Video",
            url: videos[4],
            next: null
          },
        }
      }
    }
  }
}
