import React, {useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {pickImageFromGallery} from '../nativeModules/ImagePickerModule';
import {commonStyles} from '../styles';
import LogComponent from '../components/LogComponent';

const ImagePickerDemoScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string>('');

  const handleMethodPickImage = () => {
    pickImageFromGallery().then(result => {
      setImageUri(result);
    });
  };

  return (
    <View style={commonStyles.container}>
      <Image
        source={{uri: imageUri}}
        height={200}
        width={200}
        style={styles.image}
      />
      <Button
        mode="contained"
        onPress={handleMethodPickImage}
        style={styles.button}>
        Pick Image From Gallery
      </Button>
      <LogComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    marginTop: 20,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default ImagePickerDemoScreen;
