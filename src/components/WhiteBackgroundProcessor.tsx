import ImageProcessor from './ImageProcessor';

const WhiteBackgroundProcessor = () => {
  // 处理白色像素（RGB值都大于225的像素）
  const processWhitePixel = (r: number, g: number, b: number) => {
    return r > 225 && g > 225 && b > 225;
  };

  return (
    <ImageProcessor
      title="白色底图处理"
      backgroundColor="#ffffff"
      textColor="#000000"
      buttonColor="#000000"
      processPixel={processWhitePixel}
    />
  );
};

export default WhiteBackgroundProcessor; 