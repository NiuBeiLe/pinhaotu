import { useState, useRef } from 'react';
import styled from '@emotion/styled';

const Container = styled.div<{ backgroundColor: string; textColor: string }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

const Canvas = styled.canvas`
  margin: 1.5rem 0;
  border: 2px solid ${props => props.color || 'var(--white)'};
  border-radius: var(--border-radius);
  background-color: var(--black);
  max-width: 100%;
  height: auto;
  box-shadow: var(--shadow-lg);

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const Button = styled.button<{ backgroundColor: string; textColor: string }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
  min-width: 120px;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.95rem;
    min-width: 100px;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    min-width: 90px;
  }
`;

const BackButton = styled(Button)`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  min-width: auto;

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
`;

const StatusText = styled.div`
  margin: 1rem 0;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  text-align: center;
  min-width: 200px;

  @media (max-width: 768px) {
    margin: 0.75rem 0;
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    margin: 0.5rem 0;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    min-width: 180px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin: 0.75rem 0;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
`;

const FileInput = styled.input`
  display: none;
`;

interface ImageProcessorProps {
  title: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  processPixel: (r: number, g: number, b: number) => boolean;
}

const ImageProcessor = ({
  title,
  backgroundColor,
  textColor,
  buttonColor,
  processPixel,
}: ImageProcessorProps) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);
    setStatus('正在加载图像...');
    const imageElements: HTMLImageElement[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      imageElements.push(img);
      setStatus(`已加载 ${i + 1}/${files.length} 张图像`);
    }

    setImages(imageElements);
    setIsProcessing(false);
    setStatus(`加载完成，共 ${imageElements.length} 张图像`);
  };

  const processImages = () => {
    if (!canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsProcessing(true);
    setStatus('正在处理图像...');

    // 设置画布大小为第一张图片的尺寸
    canvas.width = images[0].width;
    canvas.height = images[0].height;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 处理并叠加每张图片
    images.forEach((img, index) => {
      // 创建临时画布处理单张图片
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // 绘制原始图片
      tempCtx.drawImage(img, 0, 0);

      // 获取图片数据
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;

      // 处理像素
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // 如果像素满足处理条件，则将其设为透明
        if (processPixel(r, g, b)) {
          data[i + 3] = 0; // 设置透明度为0
        }
      }

      // 将处理后的图片数据放回临时画布
      tempCtx.putImageData(imageData, 0, 0);

      // 将处理后的图片叠加到主画布上
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(tempCanvas, 0, 0);

      setStatus(`正在处理第 ${index + 1}/${images.length} 张图像`);
    });

    setIsProcessing(false);
    setStatus('处理完成');
  };

  const handleSave = () => {
    if (!canvasRef.current) return;

    // 创建一个临时链接
    const link = document.createElement('a');
    link.download = 'processed-image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <Container backgroundColor={backgroundColor} textColor={textColor}>
      <ContentWrapper>
        <BackButton
          onClick={handleBack}
          backgroundColor={buttonColor}
          textColor={backgroundColor}
        >
          返回首页
        </BackButton>
        <Title>{title}</Title>
        <FileInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
        />
        <ButtonGroup>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            backgroundColor={buttonColor}
            textColor={backgroundColor}
          >
            选择图像
          </Button>
          <Button
            onClick={processImages}
            disabled={isProcessing || images.length === 0}
            backgroundColor={buttonColor}
            textColor={backgroundColor}
          >
            处理图像
          </Button>
          <Button
            onClick={handleSave}
            disabled={isProcessing || images.length === 0}
            backgroundColor={buttonColor}
            textColor={backgroundColor}
          >
            保存图像
          </Button>
        </ButtonGroup>
        <StatusText>{status}</StatusText>
        <Canvas ref={canvasRef} color={textColor} />
      </ContentWrapper>
    </Container>
  );
};

export default ImageProcessor; 