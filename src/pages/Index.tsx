import React from 'react';
import Vegas from '../components/Vegas';

// 登录页面组件
const LoginPage: React.FC = () => {
  // 幻灯片配置
  const slides = [
    {
      src: '/images/dragon1.jpg', // 漫画风格的中国龙腾飞图
      delay: 7000,
      transition: 'fade'
    },
    {
      src: '/images/dragon2.jpg', // 漫画风格的西方龙喷火图
      delay: 7000,
      transition: 'slideLeft'
    },
    {
      src: '/images/dragon3.jpg', // 漫画风格的龙与少年骑士图
      delay: 7000, 
      transition: 'slideRight'
    },
    {
      src: '/images/dragon4.jpg', // 漫画风格的双龙戏珠图
      delay: 7000,
      transition: 'zoomIn'
    },
    {
      src: '/images/dragon5.jpg', // 漫画风格的五爪金龙图
      delay: 7000,
      transition: 'zoomOut'
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
        transition="fade"
        delay={7000}
        animation="kenburns"
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
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
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
