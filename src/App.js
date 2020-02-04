import React from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/navigation/Navigation.js';
import Logo from './components/logo/Logo.js';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
import FaceRecogntion from './components/facerecognition/FaceRecognition.js';
import SignIn from './components/signin/SignIn.js';
import Register from './components/register/Register.js';


const app = new Clarifai.App({
 apiKey: '62274395b2de452b9b5589f161b5cb56'
});


const particlesParam = {
	particles: {
    number: {
      value: 75,
      density: {
        enable: true,
        value_area: 800
      }
    }
	}
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super()
    this.state = initialState
  }


  // loadUser = (data) => {
  //   this.setState({user:{
  //     id: data.id,
  //     name: data.name,
  //     email: data.email,
  //     password: data.password,
  //     entries: data.entries,
  //     joined: data.joined
  //   }})
  // }

  // componentDidMount() {
  //   fetch('http://localhost:3001')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // }

//next steps: enable multiple face detection!
//import entire regions array into clarifaiFace (boundingbox is nested array>object>object)
//create empty array and loop through clarifaiFace to import object of coordinates
//return array of coordinate objects
//displayFaceBox will set box state to array of coordinate objects
//faceBox argument in FaceRecognition component will become an array
//in click function, you need to (.then?) execute 1)creation of div element with classname
// of bounding-box and styles of coordinate objects FOR every item in this.state.box

  calculateFaceLocation = (data) => {
    // let clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    // grabbing box coordinates of all detected faces
    let clarifaiFaceArray = data.outputs[0].data.regions;
    let image = document.querySelector("#inputimg");
    let width = Number(image.width);
    let height = Number(image.height);
    // console.log(width,height);
    // console.log(clarifaiFaceArray);
    let coordinatesArray = clarifaiFaceArray.map( item => {
      return {
        topRow: item.region_info.bounding_box.top_row * height,
        rightCol: (width - item.region_info.bounding_box.right_col * width),
        botRow: height - (item.region_info.bounding_box.bottom_row * height),
        leftCol: item.region_info.bounding_box.left_col * width
      }
    });
    // console.log(coordinatesArray);
    return coordinatesArray;
    // return {
    //   topRow: clarifaiFace.top_row * height,
    //   rightCol: (width - clarifaiFace.right_col * width),
    //   botRow: height - (clarifaiFace.bottom_row * height),
    //   leftCol: clarifaiFace.left_col * width
    // }
  }

  displayFaceBox = (coordinates) => {
    this.setState({box: coordinates});
    let imageTarget = document.querySelector('#imgwrapper');
    // removes images from previous search
    for (let i=1; i<imageTarget.childNodes.length; i++) {
      imageTarget.removeChild(imageTarget.childNodes[i]);
      }
    for (let i = 0; i<this.state.box.length; i++) {
      let item = coordinates[i];
      let box = document.createElement("div");
      box.setAttribute("class", "bounding-box");
      box.setAttribute("style", `top: ${item.topRow}px; bottom: ${item.botRow}px; left: ${item.leftCol}px; right: ${item.rightCol}px`);
      imageTarget.insertAdjacentElement("beforeend", box);
    }
  }

// Event on inputbar to continuosly shoot data up to app state upon any input change.
  onInputChange = (e) => {
    this.setState({input:e.target.value});
    console.log(e.target.value);
  }




// cannot use this.state.imageUrl due to asynchronous nature of setstate, predict will not be able to grab the updated imageURL in time...
// sends put request to server with id of current user in request, server side uses knex(js-sql) to increase entries in database by 1 and return entries to server which returns entries to front-end as response
  onClick = (e) => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      if (response) {
        fetch('https://damp-shore-72133.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': "application/json"},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(data => this.setState(Object.assign(this.state.user, {entries: data})))
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }



// OLD CODE -> using event on BUTTON to select another element(input bar) to shoot data up to parent (app) state. Whereas new code is continuosly shooting data
//   onClick = (e) => {
//     let userInput = document.querySelector('#userinput');
//     // if (userInput.value.length > 0) {
//     //   this.setState({input: userInput.value});
//     // }
//     this.setState({input:userInput.value});
//     app.models.predict(Clarifai.FACE_DETECT_MODEL, userInput.value).then(
//     function(response) {
//       console.log(response);
//       },
//     function(err) {
//       console.log(err);
//     }
//   );
// }
//
//
//   onEnter = (e) => {
//     if (e.target.value.length > 0 && e.which === 13) {
//       this.setState({input: e.target.value});
//     }
//     app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
//     function(response) {
//       console.log(response);
//       },
//     function(err) {
//       console.log(err);
//       }
//     );
//   }

  // OLD INEFFICIENT CODEEE

  // onEnter = (e) => {
  //   let imgWrapper = document.querySelector('.img-wrapper');
  //   if (imgWrapper.childNodes.length > 0) {
  //     imgWrapper.lastChild.remove();
  //   }
  //   if (e.target.value.length > 0 && e.which === 13) {
  //     this.setState({input: e.target.value});
  //     let img = document.createElement("img");
  //     img.setAttribute("src", e.target.value);
  //     img.setAttribute("class", "center pa2");
  //     imgWrapper.appendChild(img);
  //   }
  // }



  onRouteChange = (route) => {
    this.setState({route:route});

    this.setState((state) => {
      if (state.route === 'home') {
        return {isSignedIn: true}
      } else if (state.route === 'signout'){
        return initialState
      } else {
        return {isSignedIn: false}
      }
    })
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesParam}/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'signin' || this.state.route === 'signout'
        ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        : (
          this.state.route === 'register'
          ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          :<div>
              <Logo />
              <Rank user={this.state.user}/>
              <ImageLinkForm onClick={this.onClick} onInputChange={this.onInputChange}/>
              <FaceRecogntion faceBox={this.state.box} imageLink={this.state.imageUrl}/>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
