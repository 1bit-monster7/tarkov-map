import { useState, useEffect } from 'react';

type Status = 'loading' | 'loaded' | 'failed';

const useLocalImages = (url: string): [HTMLImageElement | undefined, Status] => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const img = new Image();
    const imagePath = `${url}`; // 确保路径正确指向 public 目录下的 maps 文件夹
    // console.log('Loading image from path:', imagePath);

    img.src = imagePath;

    const handleLoad = () => {
      // console.log('Image loaded successfully:', imagePath);
      setImage(img);
      setStatus('loaded');
    };

    const handleError = (error: Event) => {
      // console.log('Failed to load image:', imagePath, error);
      setStatus('failed');
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [url]);

  return [image, status];
};

export default useLocalImages;
