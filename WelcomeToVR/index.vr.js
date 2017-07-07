import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  VrButton,
  Image,
  Animated,
  Model,
  Video,
  VideoPano,
  MediaPlayerState,
  VideoControl
} from 'react-vr';

export class WelcomeToVR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {image: 'https://cdn-static.vrgmetri.com/g3d_assets/production/32/vp/Living.20170516125135742.jpg', scale: new Animated.Value(0)};
  }
  onButtonClick() {
    this.setState({image: 'https://cdn-static.vrgmetri.com/g3d_assets/production/32/vp/BedRoom 2.20170516131011270.jpg'});
  }
  onEnter() {
    //this.setState({ scale: 1.5});
  }
  onExit() {
    //this.setState({scale: 1});
  }
  componentDidMount() {
    this.setState({scale: 1.5});
    // Animated.spring(
    //   this.state.scale,
    //   {
    //     toValue: 0.5,
    //     friction: 1
    //   }
    // ).start((log)=> {
    //   console.log(log);
    // });
  }
  render() {
    return (
      <View>
        <Pano source={{uri: this.state.image, stereo: 'TOP_BOTTOM_3D'}}/>
        {/*<VrButton
          style={{width: 0.7}}
          onClick={this.onButtonClick.bind(this)}>
          <Animated.Image style={{flex: 1, width:1, height:1, transform: [{translate: [-2, 0, -10]}, {scale: this.state.scale}]}}
                 source={asset('loc.png')}>
          </Animated.Image>
        </VrButton>*/}
        <Playground />
        <Model
          lit={false}
          style={{transform: [{translate: [5, 0, -10]}, {scale: 0.4}], color: 'white'}}
          source={{
            obj: asset('teddy.obj')
          }}
          onEnter={()=> (console.log('yolo enterred'))}
          onExit={()=> (console.log('yolo exited'))}
          onMove={()=> (console.log('yolo moving bruh!!!'))}
          onInput={(e)=> (console.log(e.type))}
        />
      </View>
    );
  }
}

class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0)
    };
  }
  render() {
    return (
      <Animated.Image                         // Base: Image, Text, View
        source={asset('loc.png')}
        style={{
          flex: 1,
          width: 1,
          height: 1,
          transform: [
            {translate: [-3, 0, -10]},// `transform` is an ordered array
            {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
          ]
        }}
      />
    );
  }

  updateAnimation() {
    // console.log('animation updated', this.state.bounceValue);
    if(this.state.bounceValue._value < 0.35) {
      this.state.bounceValue.setValue(0.3);
      Animated.timing(
        this.state.bounceValue,
        {
          toValue: 0.35,
          duration: 700
        }
      ).start(()=> (this.updateAnimation()));
    } else {
      this.state.bounceValue.setValue(0.35);
      Animated.timing(
        this.state.bounceValue,
        {
          toValue: 0.3,
          duration: 700
        }
      ).start(()=> (this.updateAnimation()));
    }
  }

  componentDidMount() {
    this.state.bounceValue.setValue(0.35);
    Animated.timing(
      this.state.bounceValue,
      {
        toValue: 0.3,
        duration: 700
      }
    ).start(()=> {
      this.updateAnimation();
    });
  }
}

export default class VideoSphere extends React.Component {
  constructor(props) {
    super(props);
    this.state = {playerState: new MediaPlayerState({autoplay: false})};
  }
  render() {
    return (
      <View>
        {/*<Video autoplay loop style={{width: 3.0, height:2.0, transform: [
          {translate: [0, 0, -10]},// `transform` is an ordered array
        ]}} source={{uri: 'https://ucarecdn.com/fadab25d-0b3a-45f7-8ef5-85318e92a261/'}}/>*/}
        <VideoPano
          loop
          source={{uri: 'https://ucarecdn.com/fadab25d-0b3a-45f7-8ef5-85318e92a261/'}}
          playerState={this.state.playerState}/>
        <VideoControl
          playerState={this.state.playerState}
          style={{height: 0.5, width: 10, transform: [{
            translate: [0,0,-10]
          }]}}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('WelcomeToVR', () => WelcomeToVR);
AppRegistry.registerComponent('VideoSphere', () => VideoSphere);

