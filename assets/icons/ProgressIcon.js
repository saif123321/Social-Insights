import * as React from 'react';
import Svg, {Defs, Path, G, ClipPath} from 'react-native-svg';
import {Dimensions} from 'react-native';

export default ProgressIcon = ({width, height, fill}) => {
  return (
    <Svg
      data-name="Iconly/Light-Outline/Chart"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={'0 0 25 25'}>
      <Path
        data-name="Combined Shape"
        d="M7.051 25C2.834 25 0 22.039 0 17.634V7.366C0 2.961 2.834 0 7.051 0h10.9C22.166 0 25 2.961 25 7.366v10.268C25 22.039 22.166 25 17.949 25ZM1.745 7.366v10.268c0 3.415 2.083 5.622 5.307 5.622h10.9c3.224 0 5.307-2.207 5.307-5.622V7.366c0-3.415-2.083-5.622-5.307-5.622H7.051c-3.224.001-5.306 2.208-5.306 5.622Zm4.5 11.02V10.41a.872.872 0 0 1 1.745 0v7.976a.872.872 0 1 1-1.745 0Zm10.764 0v-3.76a.872.872 0 1 1 1.743 0v3.76a.872.872 0 1 1-1.743 0Zm-5.338 0V6.591a.872.872 0 0 1 1.745 0v11.794a.872.872 0 1 1-1.745 0Z"
        fill={fill}
      />
    </Svg>
  );
};
