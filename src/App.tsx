import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import BlackBackgroundProcessor from './components/BlackBackgroundProcessor';
import WhiteBackgroundProcessor from './components/WhiteBackgroundProcessor';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--background-light) 0%, #e9ecef 100%);
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  text-align: center;
  padding: 2rem;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
`;

const Title = styled.h1`
  margin-bottom: 2.5rem;
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
`;

const OptionButton = styled(Link)`
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 1rem auto;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: var(--white);
  text-decoration: none;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  border: 2px solid transparent;

  &:hover {
    background-color: var(--primary-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:active {
    background-color: var(--primary-dark);
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }
`;

function Home() {
  return (
    <Container>
      <ContentWrapper>
        <Title>图像处理工具</Title>
        <Subtitle>选择底图颜色开始处理图像</Subtitle>
        <OptionButton to="/black">黑色底图处理</OptionButton>
        <OptionButton to="/white">白色底图处理</OptionButton>
      </ContentWrapper>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/black" element={<BlackBackgroundProcessor />} />
        <Route path="/white" element={<WhiteBackgroundProcessor />} />
      </Routes>
    </Router>
  );
}

export default App;
