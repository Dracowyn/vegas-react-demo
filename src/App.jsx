import React from 'react';
import Vegas from './components/Vegas';
// 导入图片资源
// import dragon1 from './images/dragon1.jpg';
// import dragon2 from './images/dragon2.jpg';
// import dragon3 from './images/dragon3.png';
import defaultBackground from './images/dragon4.png';

import b1 from './images/b1.jpg';
import b2 from './images/b2.jpg';
import b3 from './images/b3.jpg';
import b4 from './images/b4.jpg';
import b5 from './images/b5.jpg';
import { delay, transform } from 'motion/react';

// 登录页面组件
const LoginPage = () => {
  // 幻灯片配置


  const slides = [
    {
      src: b1,
      delay: 7000,
      transition: 'fade'
    },
    {
      src: b2, 
      delay: 7000,
      transition: 'fade'
    },
    {
      src: b3,
      delay: 7000,
      transition: 'fade'
    },
    {
      src: b4,
      delay: 7000,
      transition: 'fade'
    },
    {
      src: b5,
      delay: 7000,
      transition: 'fade'
    }
  ];

  return (
    <div style={{ 
      width: '100vw',
      height: '100vh',
      position: 'relative'
    }}>
      {/* Vegas背景幻灯片 */}
      <Vegas
        slides={slides}
        overlay={true}
        timer={false}
        delay={7000}
        shuffle={true}
        transitionDuration={3000}
        defaultBackground={defaultBackground}
        defaultBackgroundDelay={3000}
        debug={true}
      />
      
      {/* 登录表单容器 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        padding: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'none'
      }}>
        <h1 style={{ 
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          登录
        </h1>
        
        {/* 登录表单 */}
        <form>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="用户名"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password" 
              placeholder="密码"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
