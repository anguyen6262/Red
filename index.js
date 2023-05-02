let CLICK_TIME = 0; // variable to prevent the alarm from playing more than one time
let INSTRUCTIONS_INDEX = 0;
let ROOM_COLOR = "NONE"; //global variable to set up different lights color
let SELECTED_COLOR_BOO = false;
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

// Attribute that changes ROOM_COLOR global variable after clicking/fusing
AFRAME.registerComponent("set-color", {
  init: function () {
    const colortext = document.getElementById("colorText");
    this.el.addEventListener("click", (evt) => {
      if (this.el.getAttribute("class") == "colorBox") {
        localStorage.setItem(ROOM_COLOR, this.el.getAttribute("color"));
        // console.log(colortext);
        colortext.setAttribute("text", {
          value: colors[localStorage.getItem(ROOM_COLOR)].toString(),
        });
        setColor();
        activatePortals();
        SELECTED_COLOR_BOO = true;
      }
    });
  },
});

// Function that set the color of all components with class name `changeLight' to global variable
const setColor = () => {
  const lightSources = Array.from(document.querySelectorAll(".changeLight"));
  const currScene = document.getElementById("homeScene");
  // console.log("is it at home scene?", currScene.getAttribute("visible"));
  if (currScene.getAttribute("visible")) {
    lightSources.map((elem) => {
      if (elem.hasAttribute("light")) {
        elem.setAttribute("light", { color: localStorage.getItem(ROOM_COLOR) });
      }
      
    });
  }
};

// Attribute that changes instructions in the home scene after clicking/fusing next or back button
AFRAME.registerComponent("change-instructions", {
  init: function () {
    //The user does not have access to the prevButton on the first page
    if (this.el.getAttribute("id") == "prevButton") {
      this.el.setAttribute("scale", "0 0 0");
    }
    const instructions = Array.from(document.querySelectorAll(".instructions"));
    const buttons = Array.from(document.querySelectorAll(".button"));
    this.el.addEventListener("click", () => {
      document.getElementById("globeModel").components.sound.playSound();
      //delays changing the page which makes it more in sync with the audio.
      setTimeout(() => {
        //changes instruction screen after clicking on a button
        let currentInstruction = instructions[INSTRUCTIONS_INDEX];
        currentInstruction.setAttribute("visible", "false");
        if (this.el.getAttribute("id") == "nextButton") {
          INSTRUCTIONS_INDEX++;
        } else if (this.el.getAttribute("id") == "prevButton") {
          INSTRUCTIONS_INDEX--;
        }
        currentInstruction = instructions[INSTRUCTIONS_INDEX];
        currentInstruction.setAttribute("visible", "true");

        //chooses which buttons are clickable
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
      }, 200);
    });
  },
});

// Attribute that changes scene after clicking/fusing assigned asset to do so
AFRAME.registerComponent("change-scene", {
  init: function () {
    this.el.addEventListener("click", () => {
      const scences = Array.from(document.querySelectorAll(".scene"));
      const user = document.querySelector("#user-camera");
      const calmMusic = document.getElementById("calmMusic");
      const clock = document.getElementById("clockModel");
      const homeMusic = document.getElementById("homeMusic");
      
      if (SELECTED_COLOR_BOO) {
        scences.map((scene) => {
        // changes scene based on clicked asset
        if (this.el.getAttribute("class") == scene.getAttribute("id")) {
          scene.setAttribute("visible", "true");
          scene.setAttribute("position", "0 0 0");
          user.setAttribute(
            "position",
            scenePos[scene.getAttribute("id")].toString()
          );
          // activates compnents/elements from selected scene
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
        } else { //scene that is not selected, hided and changed position
          scene.setAttribute("visible", "false");
          scene.setAttribute("position", "10 10 10");
        }
      });
      }
      
    });
  },
});

// Attribute that stops animation from spyder
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

// Attribute that handels different sounds for the scenes
AFRAME.registerComponent("soundcontroller", {
  init: function () {
    let controlButton = this.el;
    controlButton.addEventListener("click", function (ev) {
      let currElem = ev.srcElement.id; //current element selected
      let speaker = document.getElementById("clockModel"); //reference to the ticking sound
      let spider = document.querySelector("#spiderModel"); //reference to the spider

      if (currElem == "clockModel" && CLICK_TIME == 0) {
        speaker.components.sound.stopSound();
        setInterval(codingCourse, 3000);
        function codingCourse() {
          if (CLICK_TIME == 0) {
            console.log("alarm playing");
            alarm.play();
            speaker.components.sound.stopSound();
          }
          CLICK_TIME += 1; // global variable that prevents the user from clicking alarm sound again
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

// Attribute that changes user position to an assets after clicking/fusing it
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


// function that makes portals assets visible
const activatePortals = () => {
    const cubes1 = document.getElementById("homeCubeModel1");
    const cubes2 = document.getElementById("homeCubeModel2");
    const portal1 = document.getElementById("portal1");
    const portal2 = document.getElementById("portal2");
    console.log(portal1);
    console.log(portal2);

    cubes1.setAttribute("visible", "true");
    cubes2.setAttribute("visible", "true");

    portal1.setAttribute("clickable", "")
    portal2.setAttribute("clickable", "") 
  };
