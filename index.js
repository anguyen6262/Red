let CLICK_TIME = 0; // variable to prevent the alarm from playing more than one time
let ROOM_COLOR = "#ffffff"; //global variable

// Changing global variable
AFRAME.registerComponent("set-color", {
  init: function () {
    this.el.addEventListener("click", (evt) => {
      if (this.el.getAttribute("class") == "colorBox") {
        localStorage.setItem(ROOM_COLOR, this.el.getAttribute("color"));
        setColor()
      }
    });
  },
});

//function that set the color of all components with class name `changeLight' to global variable
const setColor = () => {
  const lightSources = Array.from(document.querySelectorAll(".changeLight"));
  const currScene = document.getElementById("homeScene");
  console.log("is it at home scene?", currScene.getAttribute("visible"));

  if (currScene.getAttribute("visible")){
    lightSources.map((elem) => {
      if (elem.hasAttribute("light")) {
        elem.setAttribute("light", { color: localStorage.getItem(ROOM_COLOR) });
      }
    });
  }
};

AFRAME.registerComponent("change-scene", {
  init: function () {
    this.el.addEventListener("click", () => {
      const scences = Array.from(document.querySelectorAll(".scene"));
      const user = document.querySelector("#user-camera")
      console.log(user);
      // setColor();
      scences.map((scene) => {
        if (this.el.getAttribute("class") == scene.getAttribute("id")) {
          scene.setAttribute("visible", "true");  
          scene.setAttribute("position", "0 0 0");
          if (scene.getAttribute("id") == "dangerScene") {
            clock.play();
          }

        } else {
           scene.setAttribute("visible", "false");
           scene.setAttribute("position", "10 10 10");
           clock.stop();           
        }

        user.setAttribute("position",  "0 0 0.6");

      });   
    });
  },
});

const clock = new Howl({
  src: ["assets/audio/clock-ticking.mp3"],
  autoplay: false,
  pos: [-1.98666, 0.91235, 2.08887],
  loop: true,
});

const alarm = new Howl({
  src: ["assets/audio/alarm-clock-sound.mp3"],
  autoplay: false,
  pos: [1.98666, 0.91235, 2.08887],
  loop: true,
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
      let speaker = document.querySelector("#clockModel"); //reference to the ticking sound
      // let alarmAudio = document.querySelector('#alarm-sound') //reference to the alarm sound
      let spider = document.querySelector("#spiderModel"); //reference to the spider

      if (currElem == "clockModel" && CLICK_TIME == 0) {
        clock.stop();
        // stops ticking sound
        // function that makes the alarm sound automatically play
        setInterval(codingCourse, 3000);
        function codingCourse() {
          if (CLICK_TIME == 0) {
            console.log("alarm playing");
            alarm.play();
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
        console.log(user.getAttribute("position"));
      }
    });
  },
});

// Attribute that has that changes the cursor shape to be fill if an element is clickable
AFRAME.registerComponent("clickable", {
  init: function () {
    const cursor = document.querySelector("#userCursor")
    const el = this.el;

    el.addEventListener("mouseenter", function (evt) {
      cursor.setAttribute("geometry", {primitive: "ring", radiusInner: 0.002, radiusOuter: 0.03})
    });

    el.addEventListener("mouseleave", function (evt) {
      cursor.setAttribute("geometry", {primitive: "ring", radiusInner: 0.02, radiusOuter: 0.03})
    });
  },
});
