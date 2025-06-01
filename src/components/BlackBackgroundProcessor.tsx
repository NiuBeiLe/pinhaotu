import ImageProcessor from './ImageProcessor';

const BlackBackgroundProcessor = () => {
  // 处理黑色像素（RGB值都小于30的像素）
  const processBlackPixel = (r: number, g: number, b: number) => {
    return r < 30 && g < 30 && b < 30;
  };

  return (
    <ImageProcessor
      title="黑色底图处理"
      backgroundColor="#000000"
      textColor="#ffffff"
      buttonColor="#ffffff"
      processPixel={processBlackPixel}
    />
  );
};

export default BlackBackgroundProcessor; 