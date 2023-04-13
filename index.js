let clickTime = 0; // variable to prevent the alarm from playing more than one time

let ROOM_COLOR = "#ffffff" //global variable


// Changing global variable 
AFRAME.registerComponent('set-color', {
  init: function () {
    this.el.addEventListener("click", (evt)=> {
      if (this.el.getAttribute("class") == "colorBox"){
        ROOM_COLOR = evt.target.getAttribute("color");
      }
     console.log(ROOM_COLOR);
     setColor(); // setting everything with the class name `changeLight` to the new color
    })  
    console.log("setting color");
    
  }  
  })

  //function that set the color of all components with class name `changeLight' to global variable 
  const setColor = () => {
    const lightSources = Array.from(document.querySelectorAll('.changeLight'));
        lightSources.map(elem => {
          if (elem.hasAttribute("light")){
            elem.setAttribute("light", {color: ROOM_COLOR})
            // console.log("si paso");
          }
        })
        console.log("setting color", ROOM_COLOR);
  }


const clock = new Howl({
  src:['assets/audio/clock-ticking.mp3'],
  autoplay: true, 
  pos:[-1.98666, 0.91235, 2.08887],
  loop:true
})

const alarm = new Howl({
  src:['assets/audio/alarm-clock-sound.mp3'],
  autoplay:false, 
  pos:[1.98666, 0.91235, 2.08887],
  loop:true
})

function startAudio () {
  clock.play();
}

AFRAME.registerComponent('stop-animation', {
  init: function () {
    this.el.addEventListener("animationcomplete", ()=> {
        this.el.setAttribute('animation-mixer',{timeScale:0})
        setTimeout(()=>this.el.setAttribute('animation-mixer',{timeScale:1}),4000)
      })
    }  
  })
  

//Function that handles the sounds
AFRAME.registerComponent('soundcontroller', {
  init: function () {
    let controlButton = this.el;
    controlButton.addEventListener("click", function (ev) {
      let method = ev.srcElement.id; //current element selected
      let speaker = document.querySelector('#clockModel') //reference to the ticking sound
      // let alarmAudio = document.querySelector('#alarm-sound') //reference to the alarm sound
      let spider = document.querySelector('#spiderModel') //reference to the spider
      if(method == "clockModel" && clickTime == 0){
        clock.stop()
      // stops ticking sound
        // function that makes the alarm sound automatically play
        setInterval(codingCourse, 3000);
        function codingCourse() {
          if (clickTime == 0) {
            console.log("alarm playing");
            alarm.play()
          }
          clickTime +=1
        }
      }
      // stop alarm sound after first click
      if(method == "clockModel" && clickTime > 0){
        alarm.stop()
        spider.setAttribute("animation", "property: position; to: 10 0 0; dur: 7000;")
      }
    })
  }
})

AFRAME.registerComponent('change-position', {
  init: function () {
    const user = document.querySelector('#user-camera')
    this.el.addEventListener("click", (evt)=> {
        let clickedObj = evt.srcElement.id; // get object that was clicked
        let x = evt.detail.intersection.point.x; // get x position of the asset to move to
        let [userX, userY, userZ] = user.getAttribute("position") // get user current position
        let userPos = userX + " " + userY + " " + userZ //change position to string
        let newPos = x.toString() + " " + userY + " " + userZ ; // new position to string

        if (clickedObj == "change-position") {
          user.setAttribute("animation", "property: position; from: " + userPos +"; to: " + newPos + "; dur: 700;")
        }
        console.log(allElements());
      })
    }  
  })
