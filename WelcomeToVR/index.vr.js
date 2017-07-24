import "babel-polyfill";
import React                from 'react';
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
import PropTypes  from 'prop-types';
import NativeModules        from 'react-vr';
import RCTDeviceEventEmitter  from 'RCTDeviceEventEmitter';
let ControllerModule = NativeModules.NativeModules.ControllerModule;

export class Store extends React.Component {
  constructor(props) {
    super(props);
    this.isRotating = false;
    this.onGlobalInput = this.onGlobalInput.bind(this);
    this.onTouchInput = this.onTouchInput.bind(this);
    this.onMouseInput = this.onMouseInput.bind(this);
    this.rotateModel = this.rotateModel.bind(this);
    this.mouseDown = false;
    this.touchStart = false;
    this.state = {rotateX: 0, rotateY: 0, isStereo: true, image: 'https://cdn-static.vrgmetri.com/g3d_assets/production/32/vp/Living.20170516125135742.jpg', showModel: false};
    //https://cdn-static.vrgmetri.com/web_assets/static/blank.png replce with this once everything else is done.
  }

  componentDidMount() {
    ControllerModule.disablePanner();
    this.setState({showModel: true});
  }

  onModelAction(e) {
    let event = e.nativeEvent.inputEvent;
    if(event.type === 'MouseInputEvent' && event.eventType === 'mouseup') {
      !this.state.showModel? ControllerModule.disablePanner(): ControllerModule.enablePanner();
      this.setState({showModel: !this.state.showModel});
    }
  }

  onModelInput(e) {
    let event = e.nativeEvent.inputEvent;
    if(event.type === 'MouseInputEvent' && event.eventType === 'mousedown') {
      console.log('mouse drag about to start');
      this.mouseDown = true;
      this.beginRotation(event.viewportX, event.viewportY);
    }
    if(event.type === 'TouchInputEvent' && event.eventType === 'touchstart') {
      this.touchStart = true;
      this.beginRotation(event.touches[0].viewportX, event.touches[0].viewportY);
    }
  }

  onMouseInput(e) {
    switch(e.eventType) {
      case 'mousemove': {
        if(this.mouseDown) {
          //console.log('movin bruh', e);
          this.rotateModel(e.viewportX, e.viewportY);
        }
        break;
      }
      case 'mouseup': {
        this.mouseDown = false;
        break;
      }
      case 'mousedown': {
        //this.mouseDown = true;
        break;
      }
    }
  }

  onTouchInput(e) {
    switch(e.eventType) {
      case 'touchmove': {
        if(this.touchStart) {
          //console.log('movin bruh', e);
          this.rotateModel(e.touches[0].viewportX, e.touches[0].viewportY);
        }
        break;
      }
      case 'touchend':
      case 'touchcancel': {
        this.touchStart = false;
        break;
      }
      case 'touchstart': {
        //this.mouseDown = true;
        break;
      }
    }
  }

  onGlobalInput(e) {
    if(this.state.showModel) {
      switch(e.type) {
        case 'MouseInputEvent': {
          this.onMouseInput(e);
          break;
        }
        case 'TouchInputEvent': {
          this.onTouchInput(e);
          break;
        }
      }
    }
  }

  beginRotation(viewportX, viewportY) {
    this.isRotating = true;
    this.lastViewportX = viewportX;
    this.lastViewportY = viewportY;
    this.inputListener || (this.inputListener = RCTDeviceEventEmitter.addListener('onReceivedInputEvent', (e)=> (this.onGlobalInput(e))));
  }

  rotateModel(viewportX, viewportY) {
    let xdiff = this.lastViewportX - viewportX;
    let ydiff = this.lastViewportY - viewportY;
    this.lastViewportX = viewportX;
    this.lastViewportY = viewportY;
    if(this.isRotating) {
      //setup the new matrix transformations
      this.setState({rotateX: this.state.rotateX + (2 * ydiff) * 180 / Math.PI, rotateY: this.state.rotateY + (4 * -xdiff) * 180 / Math.PI});
    }
  }

  render() {
    //translate: [0,0,-10]
    //matrix: this.state.matrix
    return (
      <View>
        <Pano source={asset('pano.jpg')}/>
        {/*<Playground onClick={this.onModelAction.bind(this)}/>*/}
        <Model
          style={{position: 'absolute',
            transform: [{
              translate: [0,0,-5]
          }, {rotateX: this.state.rotateX}, {rotateY: this.state.rotateY},
            {scale: 1}],
            color: 'white',
            display: this.state.showModel? 'flex': 'none'
          }}
          source={{
            obj: asset('008.obj'),
            mtl: asset('008.mtl')
          }}
          onInput={this.onModelInput.bind(this)}
        />
      </View>
    );
  }
}

class Playground extends React.Component {
  static propTypes = {
    onClick: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0)
    };
  }
  render() {
    return (
      <Animated.Image                         // Base: Image, Text, View
        source={{uri: 'http://cdn-resizer.vrgmetri.com/es3/test%20DND/loc.png'}}
        style={{
          flex: 1,
          width: 1,
          height: 1,
          transform: [
            {translate: [-3, 0, -10]},// `transform` is an ordered array
            {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
          ]
        }}
        onInput={this.props.onClick}
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


//This is how you register the components to the react-vr framework.
AppRegistry.registerComponent('Store', () => Store);
