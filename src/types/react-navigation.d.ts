declare module '@react-navigation/stack' {
  export * from '@react-navigation/stack';
  export function createStackNavigator<T = any>(): any;
  export type StackNavigationProp<ParamList, RouteName extends keyof ParamList = keyof ParamList> = any;
} 