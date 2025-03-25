import {Vegas} from "react-vegas";

const p1 = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';
const p2 = 'https://images.unsplash.com/photo-1741986947217-d1a0ecc39149';
const p3 = 'https://cdn.pixabay.com/photo/2023/12/24/16/43/autumn-8467482_1280.jpg';
const p4 = 'https://cdn.pixabay.com/photo/2024/05/21/21/46/bird-8779199_1280.jpg';
const p5 = 'https://cdn.pixabay.com/photo/2021/03/13/21/54/planet-6092940_1280.jpg';
const p6 = 'https://cdn.pixabay.com/photo/2023/08/31/14/40/mountain-8225287_1280.jpg';
const defaultBackground = 'https://images.unsplash.com/photo-1742560897614-69c3f47771be';

// 登录页面组件
const LoginPage = () => {
	// 幻灯片配置


	const slides = [
		{
			src: p1,
			delay: 7000,
			transition: 'fade',
			align: 'center',
			valign: 'center',
		},
		{
			src: p2,
			delay: 7000,
			transition: 'slideLeft',
			align: 'center',
			valign: 'center',
		},
		{
			src: p3,
			delay: 7000,
			transition: 'slideRight',
			align: 'center',
			valign: 'center',
		},
		{
			src: p4,
			delay: 7000,
			transition: 'zoomIn',
			align: 'center',
			valign: 'center',
		},
		{
			src: p5,
			delay: 7000,
			transition: 'zoomOut',
			align: 'center',
			valign: 'center',
		},
		{
			src: p6,
			delay: 7000,
			transition: 'zoomInOut',
			align: 'center',
			valign: 'center',
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
				firstTransitionDuration={5000}
				defaultBackground={defaultBackground}
				defaultBackgroundDelay={2000}
				debug={true}
				color={'#000'}
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
					<div style={{marginBottom: '20px'}}>
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
					<div style={{marginBottom: '20px'}}>
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
