let CLICK_TIME = 0; // variable to prevent the alarm from playing more than one time
let INSTRUCTIONS_INDEX = 0;
let ROOM_COLOR = "#ffffff"; //global variable
const colors = {
  "#e89f02": "Orange",
  "#04ff00": "Green",
  "#d000ff": "Purple",
  "#006eff": "Blue",
  "#ff0015": "Red",
  "#eeff00": "Yellow",
};

const scenePos = {
  homeScene: "-0.435 0 3",
  dangerScene: "-10 0 0.5",
  calmScene: "21.49033 2 30.2487",
};

const alarm = new Howl({
  src: ["assets/audio/alarm-clock-sound.mp3"],
  autoplay: false,
  pos: [1.98666, 0.91235, 2.08887],
  loop: true,
});
// Changing global variable
AFRAME.registerComponent("set-color", {
  init: function () {
    const colortext = document.getElementById("colorText");
    this.el.addEventListener("click", (evt) => {
      if (this.el.getAttribute("class") == "colorBox") {
        localStorage.setItem(ROOM_COLOR, this.el.getAttribute("color"));
        console.log(colortext);
        colortext.setAttribute("text", {
          value: colors[localStorage.getItem(ROOM_COLOR)].toString(),
        });
        setColor();
      }
    });
  },
});

//function that set the color of all components with class name `changeLight' to global variable
const setColor = () => {
  const lightSources = Array.from(document.querySelectorAll(".changeLight"));
  const currScene = document.getElementById("homeScene");
  console.log("is it at home scene?", currScene.getAttribute("visible"));

  if (currScene.getAttribute("visible")) {
    lightSources.map((elem) => {
      if (elem.hasAttribute("light")) {
        elem.setAttribute("light", { color: localStorage.getItem(ROOM_COLOR) });
      }
    });
  }
};

AFRAME.registerComponent("change-instructions", {
  init: function () {
    if (this.el.getAttribute("id") == "prevButton") {
      this.el.setAttribute("scale", "0 0 0");
    }
    const instructions = Array.from(document.querySelectorAll(".instructions"));
    const buttons = Array.from(document.querySelectorAll(".button"));
    this.el.addEventListener("click", () => {
      document.getElementById("globeModel").components.sound.playSound();
      //changes instruction screen after clicking on a button
      setTimeout(() => {
        let currentInstruction = instructions[INSTRUCTIONS_INDEX];
        currentInstruction.setAttribute("visible", "false");
        if (this.el.getAttribute("id") == "nextButton") {
          INSTRUCTIONS_INDEX++;
        } else if (this.el.getAttribute("id") == "prevButton") {
          INSTRUCTIONS_INDEX--;
        }
        currentInstruction = instructions[INSTRUCTIONS_INDEX];
        currentInstruction.setAttribute("visible", "true");

        buttons.forEach((button) => {
          button.setAttribute("scale", "0.2 0 0.2");
          if (
            (INSTRUCTIONS_INDEX == 0 &&
              button.getAttribute("id") == "prevButton") ||
            (INSTRUCTIONS_INDEX == 2 &&
              button.getAttribute("id") == "nextButton")
          ) {
            button.setAttribute("scale", "0 0 0");
          }
        });
      }, 400);

      // let currentInstruction = instructions[INSTRUCTIONS_INDEX];
      // currentInstruction.setAttribute("visible", "false");
      // if (this.el.getAttribute("id") == "nextButton") {
      //   INSTRUCTIONS_INDEX++;
      // } else if (this.el.getAttribute("id") == "prevButton") {
      //   INSTRUCTIONS_INDEX--;
      // }
      // currentInstruction = instructions[INSTRUCTIONS_INDEX];
      // currentInstruction.setAttribute("visible", "true");

      // buttons.forEach((button) => {
      //   button.setAttribute("scale", "0.2 0 0.2");
      //   if (
      //     (INSTRUCTIONS_INDEX == 0 &&
      //       button.getAttribute("id") == "prevButton") ||
      //     (INSTRUCTIONS_INDEX == 2 && button.getAttribute("id") == "nextButton")
      //   ) {
      //     button.setAttribute("scale", "0 0 0");
      //   }
      // });

      //chooses which buttons are clickable
    });
  },
});

AFRAME.registerComponent("change-scene", {
  init: function () {
    this.el.addEventListener("click", () => {
      const scences = Array.from(document.querySelectorAll(".scene"));
      const user = document.querySelector("#user-camera");
      const calmMusic = document.getElementById("calmMusic");
      const clock = document.getElementById("clockModel");
      const homeMusic = document.getElementById("homeMusic");

      scences.map((scene) => {
        if (this.el.getAttribute("class") == scene.getAttribute("id")) {
          scene.setAttribute("visible", "true");
          scene.setAttribute("position", "0 0 0");
          user.setAttribute(
            "position",
            scenePos[scene.getAttribute("id")].toString()
          );
          if (scene.getAttribute("id") == "dangerScene") {
            clock.components.sound.playSound();
            homeMusic.components.sound.stopSound();
          } else if (scene.getAttribute("id") == "calmScene") {
            scene.setAttribute("position", "0 2 0");

            calmMusic.components.sound.playSound();
            homeMusic.components.sound.stopSound();
          } else {
            homeMusic.components.sound.playSound();
            calmMusic.components.sound.stopSound();
            clock.components.sound.stopSound();
          }
        } else {
          scene.setAttribute("visible", "false");
          scene.setAttribute("position", "10 10 10");
        }
      });
    });
  },
});

AFRAME.registerComponent("stop-animation", {
  init: function () {
    this.el.addEventListener("animationcomplete", () => {
      this.el.setAttribute("animation-mixer", { timeScale: 0 });
      setTimeout(
        () => this.el.setAttribute("animation-mixer", { timeScale: 1 }),
        4000
      );
    });
  },
});

//Function that handles the sounds
AFRAME.registerComponent("soundcontroller", {
  init: function () {
    let controlButton = this.el;
    controlButton.addEventListener("click", function (ev) {
      let currElem = ev.srcElement.id; //current element selected
      let speaker = document.getElementById("clockModel"); //reference to the ticking sound
      // let alarmAudio = document.querySelector('#alarm-sound') //reference to the alarm sound
      let spider = document.querySelector("#spiderModel"); //reference to the spider

      if (currElem == "clockModel" && CLICK_TIME == 0) {
        speaker.components.sound.stopSound();
        // stops ticking sound
        // function that makes the alarm sound automatically play
        setInterval(codingCourse, 3000);
        function codingCourse() {
          if (CLICK_TIME == 0) {
            console.log("alarm playing");
            alarm.play();
            speaker.components.sound.stopSound();
          }
          CLICK_TIME += 1;
        }
      }
      // stop alarm sound after first click
      if (currElem == "clockModel" && CLICK_TIME > 0) {
        alarm.stop();
        spider.setAttribute(
          "animation",
          "property: position; to: 10 0 0; dur: 7000;"
        );
      }
    });
  },
});

AFRAME.registerComponent("change-position", {
  init: function () {
    const user = document.querySelector("#user-camera");
    this.el.addEventListener("click", (evt) => {
      let clickedObj = evt.srcElement.id; // get object that was clicked
      let x = evt.detail.intersection.point.x; // get x position of the asset to move to
      let z = evt.detail.intersection.point.z; // get x position of the asset to move to
      let [userX, userY, userZ] = user.getAttribute("position"); // get user current position
      let userPos = userX + " " + userY + " " + userZ; //change position to string
      let newPos = x.toString() + " " + userY + " " + z.toString(); // new position to string

      if (clickedObj == "change-position") {
        user.setAttribute(
          "animation",
          "property: position; from: " +
            userPos +
            "; to: " +
            newPos +
            "; dur: 700;"
        );
        // console.log(user.getAttribute("position"));
      }
    });
  },
});

// Attribute that has that changes the cursor shape to be fill if an element is clickable
AFRAME.registerComponent("clickable", {
  init: function () {
    const cursor = document.querySelector("#userCursor");
    const el = this.el;

    el.addEventListener("mouseenter", function (evt) {
      cursor.setAttribute("geometry", {
        primitive: "ring",
        radiusInner: 0.002,
        radiusOuter: 0.03,
      });
    });

    el.addEventListener("mouseleave", function (evt) {
      cursor.setAttribute("geometry", {
        primitive: "ring",
        radiusInner: 0.02,
        radiusOuter: 0.03,
      });
    });
  },
});
