/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      logs: 'ahihi',
      selectedPhotoIndex: 0,
      localPhotos: []
    };
    this.onDoUploadPress = this.onDoUploadPress.bind(this);
  }

  onPressAddPhotoBtn = () => {
    this.ActionSheetSelectPhoto.show();
  };
  showActionSheet = index => {
    this.setState({
      selectedPhotoIndex: index
    });
    this.ActionSheet.show();
  };

  onDoUploadPress() {
    const { localPhotos } = this.state;
    if (localPhotos && localPhotos.length > 0) {
      let formData = new FormData();
      localPhotos.forEach((image) => {
        const file = {
          uri: image.path,
          name: image.filename || Math.floor(Math.random() * Math.floor(999999999)) + '.jpg',
          type: image.mime || 'image/jpeg'
        };
        formData.append('files', file);
      });

      axios
        .post('https://api.tradingproedu.com/api/v1/fileupload', formData)
        .then(response => {
          this.setState({ logs: JSON.stringify(response.data) });
        })
        .catch(error => {
          alert(JSON.stringify(error));
        });
    } else {
      alert('No photo selected');
    }
  }

  onActionDeleteDone = index => {
    if (index === 0) {
      const array = [...this.state.localPhotos];
      array.splice(this.state.selectedPhotoIndex, 1);
      this.setState({ localPhotos: array });
    }
  };
  onActionSelectPhotoDone = index => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({}).then(image => {
          this.setState({
            localPhotos: [...this.state.localPhotos, image]
          });
        });
        break;
      case 1:
        ImagePicker.openPicker({
          multiple: true,
          maxFiles: 10,
          mediaType: 'photo'
        }).then(images => {
          images.forEach((image) => {
            this.setState({
              localPhotos: [...this.state.localPhotos, image]
            });
          });
        }).catch(error => {
          alert(JSON.stringify(error));
        });
        break;
      default:
        break;
    }
  };

  renderListPhotos = localPhotos => {
    const photos = localPhotos.map((photo, index) => (
      <TouchableOpacity key={index}
        onPress={() => {
          this.showActionSheet(index);
        }}
      >
        <Image style={styles.photo} source={{ uri: photo.path }} />
      </TouchableOpacity>
    ));

    return photos;
  };

  renderSelectPhotoControl = localPhotos => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Select photos</Text>
        <ScrollView style={styles.photoList} horizontal={true}>
          {this.renderListPhotos(localPhotos)}
          <TouchableOpacity onPress={this.onPressAddPhotoBtn.bind(this)}>
            <View style={[styles.addButton, styles.photo]}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            <Image style={{ width: 143, height: 30 }} source={{ uri: 'https://tuanitpro.com/wp-content/uploads/2015/04/logo.png' }} />
            <View style={styles.body}>
              {this.renderSelectPhotoControl(this.state.localPhotos)}
              <View style={styles.sectionContainer}>
                <TouchableOpacity onPress={this.onDoUploadPress}>
                  <Text style={styles.sectionTitle}>Upload now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Logs</Text>
                <TextInput multiline numberOfLines={10} style={{ height: 250, borderColor: 'gray', borderWidth: 1 }}
                  value={this.state.logs}
                />
              </View>
            </View>
          </ScrollView>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={'Confirm delete photo'}
            options={['Confirm', 'Cancel']}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={index => {
              this.onActionDeleteDone(index);
            }}
          />
          <ActionSheet
            ref={o => (this.ActionSheetSelectPhoto = o)}
            title={'Select photo'}
            options={['Take Photo...', 'Choose from Library...', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={index => {
              this.onActionSelectPhotoDone(index);
            }}
          />
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  section: {
    backgroundColor: Colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  addPhotoTitle: {

    fontSize: 15,

    fontWeight: 'bold'
  },
  photoList: {
    height: 70,
    marginTop: 15,
    marginBottom: 15,
    marginRight: 10
  },
  photo: {
    marginRight: 10,
    width: 70,
    height: 70,
    borderRadius: 10
  },

  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3399cc'
  },
  photoIcon: {
    width: 50,
    height: 50
  },
  addButtonContainer: {
    padding: 15,
    justifyContent: 'flex-end'
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 48
  }
});

export default App;
