import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import { Component } from 'react';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


const returnClarifaiJSONRequest = (imageURL) => {
  const PAT = '438c95a5e89e40f0810078c037653183';

  const USER_ID = 'ahat';       
  const APP_ID = 'ImageDetection';
  //const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageURL;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID,
       // "model_id":MODEL_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

   const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'home',
      isSignedIn: false,
      user: {
        id: '',
    //    name: '',
    //    email: '',
        entries: 0,
     //   joined: ''
      }
    }
  }

  calculateFaceLocation =(data) => {
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }

  }
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
   // console.log(event.target.value);
  }
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});

     const MODEL_ID = 'face-detection';
   // const MODEL_ID = 'general-image-detection';


      fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiJSONRequest(this.state.input))
       .then(response => response.json())
        .then(response => {
          console.log('hi', response)
          if(response) {
              fetch('http://localhost:3000/image', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                 id: this.state.user.id
                })
              })
              // .then(response => response.json())
              // .then(count => {
              //   this.setState(Object.assign(this.state.user, {entries: count}))
              // })
              }
         this.displayFaceBox(this.calculateFaceLocation(response))
       })

  }

  render(){
  return (
    <div className="App">
        <Navigation/>
        <Logo/>
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={ this.onButtonSubmit }/>
        <FaceRecognition box={this.state.box} imageURL={ this.state.imageURL }/>
    </div>
  );
  }
}





export default App;
