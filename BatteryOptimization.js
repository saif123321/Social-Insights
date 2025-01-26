import { NativeModules } from 'react-native';

const { BatteryOptimizationModule } = NativeModules;

const isIgnoringBatteryOptimizations = async () => {
  try {
    const result = await BatteryOptimizationModule.isIgnoringBatteryOptimizations();
    console.log(result , "result");
    return result;
  } catch (error) {
    console.error('Error checking battery optimization status:', error);
    return false;
  }
};

export default isIgnoringBatteryOptimizations;
