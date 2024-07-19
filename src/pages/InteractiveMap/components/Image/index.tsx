import { Image } from 'react-konva';

import { ImageConfig } from 'konva/lib/shapes/Image';
import useLocalImages from '@/utils/useLocalImages';

interface ImageProps {
  imageSrc: string;
}

type OmitImageConfig = Omit<ImageConfig, 'image'>;

const Index = (props: OmitImageConfig & ImageProps) => {
  const { imageSrc } = props;
  // console.log(imageSrc,'imageSrc')
  const [image, status] = useLocalImages(imageSrc);

  if (status === 'loaded') {
    return <Image image={image} {...props} />;
  } else {
    return null;
  }
};

export default Index;
