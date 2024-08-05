import {NativeModules} from 'react-native';

const {ImagePickerModule} = NativeModules;

export const pickImageFromGallery = (): Promise<string> => {
  return ImagePickerModule.pickImage();
};
export default ImagePickerModule;
