import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { name as appName } from '../app.json';

import './rn-addons';

// import stories
configure(() => {
    require('./components/welcome/Welcome.stories');
    require('./components/services/Services.stories');
    require('../src/components/Typography.stories');
    require('../src/components/GradientBackground.stories');
    require('../src/components/WalkthroughBackground/WalkthroughBackground.stories');
    require('../src/components/RoundedButton.stories');
    require('../src/components/Tag.stories');
    require('../src/components/RoundedTextInput.stories');
    require('../src/components/RoundedTextArea.stories');
    require('../src/components/DateTimePicker.stories');
    require('../src/components/PhotoPicker.stories');
    require('../src/components/TextButton.stories');
    require('../src/components/RadioButtons.stories');
    require('../src/components/ShareButton.stories');
    require('../src/components/FancyButton.stories');
    require('../src/components/RateAChild.stories');
    require('../src/components/ProfileIcon.stories');
    require('../src/components/SearchInput.stories');
    // require('../src/components/growth/GrowthChart.stories');
    require('../src/components/development/MilestoneCard.stories');
    require('../src/components/development/MilestoneForm.stories');
    require('../src/components/development/DevelopmentInfo.stories');
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
    asyncStorage: AsyncStorage as any,
});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent(appName, () => StorybookUIRoot);

export default StorybookUIRoot;
