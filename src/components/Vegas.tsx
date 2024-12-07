import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// Vegas组件的Props类型定义
interface VegasProps {
    // 幻灯片索引
    slide?: number;
    // 幻灯片切换延迟时间(毫秒)
    delay?: number;
    // 是否循环播放
    loop?: boolean;
    // 是否预加载
    preload?: boolean;
    // 是否预加载图片
    preloadImage?: boolean;
    // 是否预加载视频
    preloadVideo?: boolean;
    // 是否显示计时器
    timer?: boolean;
    // 是否显示遮罩层
    overlay?: boolean;
    // 是否自动播放
    autoplay?: boolean;
    // 是否随机播放
    shuffle?: boolean;
    // 是否覆盖整个容器
    cover?: boolean;
    // 背景颜色
    color?: string | null;
    // 水平对齐方式
    align?: "left" | "center" | "right";
    // 垂直对齐方式
    valign?: "top" | "center" | "bottom";
    // 第一次切换动画
    firstTransition?: string | null;
    // 第一次切换动画持续时间
    firstTransitionDuration?: number;
    // 切换动画类型
    transition?: string;
    // 切换动画持续时间
    transitionDuration?: number;
    // 自定义切换动画注册
    transitionRegister?: string[];
    // 幻灯片动画类型
    animation?: string | null;
    // 自定义幻灯片动画注册
    animationRegister?: string[];
    // 保持的幻灯片数量
    slidesToKeep?: number;
    // 默认背景图
    defaultBackground?: string | {};
    // 默认背景图与第一张幻灯片间隔时间
    defaultBackgroundDuration?: number;
    // 是否启用日志
    debug?: boolean;
    // 幻灯片配置数组
    slides: Array<{
        // 图片/视频源地址
        src: string;
        // 幻灯片背景色
        color?: string | null;
        // 当前幻灯片延迟时间
        delay?: number | null;
        // 当前幻灯片水平对齐
        align?: "left" | "center" | "right";
        // 当前幻灯片垂直对齐
        valign?: "top" | "center" | "bottom";
        // 当前幻灯片切换动画
        transition?: string | null;
        // 当前幻灯片切换动画持续时间
        transitionDuration?: number | null;
        // 当前幻灯片是否覆盖
        cover?: boolean;
        // 视频配置
        video?: {
            // 视频源地址数组(支持多格式)
            src: string[];
            // 是否静音
            muted?: boolean;
            // 是否循环播放
            loop?: boolean;
        };
    }>;
    // 初始化回调
    onInit?: () => void;
    // 播放回调
    onPlay?: () => void;
    // 暂停回调
    onPause?: () => void;
    // 切换回调
    onWalk?: () => void;
}

/**
 * Vegas组件实现
 *
 * @param props 组件参数
 * @param ref 组件实例引用
 */
const Vegas = React.forwardRef<
    {
        previous: () => void;
        next: () => void;
        play: () => void;
        pause: () => void;
    } | null,
    VegasProps
>((props, ref) => {
    // 解构props获取所有配置参数
    const {
        slide = 0, // 初始幻灯片索引
        delay = 5000, // 默认切换延迟时间
        loop = true, // 是否循环播放
        preload = false, // 是否预加载
        preloadImage = false, // 是否预加载图片
        preloadVideo = false, // 是否预加载视频
        timer = true, // 是否显示进度条
        overlay = false, // 是否显示遮罩层
        autoplay = true, // 是否自动播放
        shuffle = false, // 是否随机播放
        cover = true, // 是否覆盖整个容器
        color = null, // 背景颜色
        align = "center", // 水平对齐方式
        valign = "center", // 垂直对齐方式
        firstTransitionDuration = 3000, // 第一次切换动画持续时间
        transition = "fade", // 切换动画类型
        transitionDuration = 1000, // 切换动画持续时间
        defaultBackground, // 默认背景图
        defaultBackgroundDuration = 3000, // 默认背景图与第一张幻灯片间隔时间
        debug = false, // 是否启用日志
        slides, // 幻灯片配置数组
        onInit, // 初始化回调
        onPlay, // 播放回调
        onPause, // 暂停回调
        onWalk // 切换回调
    } = props;

    // 日志打印函数
    const log = (message: string, ...args: unknown[]) => {
        if (debug) {
            console.log(message, ...args);
        }
    };

    const logError = (message: string, ...args: unknown[]) => {
        if (debug) {
            console.error(message, ...args);
        }
    };

    const logWarn = (message: string, ...args: unknown[]) => {
        if (debug) {
            console.warn(message, ...args);
        }
    };

    // 状态管理
    const [currentSlide, setCurrentSlide] = useState(slide); // 当前幻灯片索引
    const [isPlaying, setIsPlaying] = useState(autoplay); // 是否正在播放
    const [, setSlideOrder] = useState<number[]>([]); // 幻灯片播放顺序
    const [isTransitioning, setIsTransitioning] = useState(false); // 是否正在切换动画
    const [visibleSlides, setVisibleSlides] = useState([slide]); // 当前可见的幻灯片
    const containerRef = useRef<HTMLDivElement>(null); // 容器引用
    const [loading, setLoading] = useState(true);
    const [showDefaultBg, setShowDefaultBg] = useState(true); // 控制默认背景显示
    const [isFirstTransition, setIsFirstTransition] = useState(true); // 跟踪是否是第一次切换

    // 动画变体配置
    const variants = {
        fade: (custom: { duration: number }) => ({
            enter: { opacity: 1, transition: { duration: custom.duration } },
            exit: { opacity: 0, transition: { duration: transitionDuration / 1000 } }
        }),
        slideLeft: (custom: { duration: number }) => ({
            enter: {
                x: 0,
                opacity: 1,
                transition: { duration: custom.duration }
            },
            exit: {
                x: "-100%",
                opacity: 0,
                transition: { duration: transitionDuration / 1000 }
            }
        }),
        slideRight: (custom: { duration: number }) => ({
            enter: {
                x: 0,
                opacity: 1,
                transition: { duration: custom.duration }
            },
            exit: {
                x: "100%",
                opacity: 0,
                transition: { duration: transitionDuration / 1000 }
            }
        }),
        zoomIn: (custom: { duration: number }) => ({
            enter: {
                scale: 1,
                opacity: 1,
                transition: { duration: custom.duration }
            },
            exit: {
                scale: 0.5,
                opacity: 0,
                transition: { duration: transitionDuration / 1000 }
            }
        }),
        zoomOut: (custom: { duration: number }) => ({
            enter: {
                scale: 1,
                opacity: 1,
                transition: { duration: custom.duration }
            },
            exit: {
                scale: 1.25,
                opacity: 0,
                transition: { duration: transitionDuration / 1000 }
            }
        }),
        zoomInOut: (custom: { duration: number }) => ({
            enter: {
                scale: 1.25,
                opacity: 1,
                transition: { duration: custom.duration }
            },
            exit: {
                scale: 1,
                opacity: 0,
                transition: { duration: transitionDuration / 1000 }
            }
        })
    } as const;

    // 防抖函数实现
    const debounce = <T extends (...args: unknown[]) => unknown>(
        func: T,
        wait: number
    ): ((...args: Parameters<T>) => void) => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        return (...args: Parameters<T>) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
                timeoutId = null;
            }, wait);
        };
    };

    // 组件初始化
    useEffect(() => {
        log("Vegas组件开始初始化");
        // 初始化幻灯片顺序
        const order = Array.from({ length: slides.length }, (_, i) => i);
        if (shuffle) {
            // Fisher-Yates 洗牌算法随机排序
            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }
            // 设置当前幻灯片为随机顺序的第一张
            setCurrentSlide(order[0]);
            setVisibleSlides([order[0]]);
            log("幻灯片随机排序完成:", order);
            // 打印每个幻灯片的参数
            slides.forEach((slide, i) => {
                log(`幻灯片 ${i}:`, slide);
            });
        }
        setSlideOrder(order);

        // 预加载资源处理
        if (preload) {
            log("开始预加载资源");
            // 预加载图片资源
            if (preloadImage) {
                log("预加载图片资源");
                slides.forEach(slide => {
                    if (!slide.video) {
                        const img = new Image();
                        img.src = slide.src;
                    }
                });
            }
            // 预加载视频资源
            if (preloadVideo) {
                log("预加载视频资源");
                slides.forEach(slide => {
                    if (slide.video) {
                        slide.video.src.forEach(src => {
                            const link = document.createElement("link");
                            link.rel = "preload";
                            link.as = "video";
                            link.href = src;
                            document.head.appendChild(link);
                        });
                    }
                });
            }
        }

        // 执行初始化回调
        if (onInit) {
            log("执行初始化回调");
            onInit();
        }

        if (defaultBackground) {
            log("显示默认背景，并在延迟后开始播放");
            const initialTimer = window.setTimeout(() => {
                if (autoplay) {
                    play();
                }
            }, defaultBackgroundDuration);
            return () => {
                log("组件卸载，清理初始定时器");
                clearTimeout(initialTimer);
                pause();
            };
        } else {
            // 自动播放处理
            if (autoplay) {
                log("开始自动播放");
                play();
            }
            // 组件卸载时暂停播放
            return () => {
                log("Vegas组件卸载");
                pause();
            };
        }
    }, []);

    // 播放控制函数
    const play = useCallback(() => {
        log("开始播放幻灯片");
        setIsPlaying(true);
        if (onPlay) {
            onPlay();
        }
    }, [onPlay]);

    // 暂停控制函数
    const pause = () => {
        log("暂停播放幻灯片");
        setIsPlaying(false);
        if (onPause) {
            onPause();
        }
    };

    // 切换到指定幻灯片
    const goTo = (index: number) => {
        if (index >= 0 && index < slides.length && !isTransitioning) {
            log(`切换到幻灯片: ${index}`);
            setIsTransitioning(true);
            setVisibleSlides([index]); // 只保留当前幻灯片
            setCurrentSlide(index);
            if (onWalk) {
                onWalk();
            }
            // 动画完成后重置状态
            setTimeout(() => {
                setIsTransitioning(false);
                log("幻灯片切换动画完成");
            }, transitionDuration);
        }
    };

    // 切换到下一张幻灯片
    const next = () => {
        setIsFirstTransition(false);
        if (isTransitioning) {
            log("正在切换中,跳过本次切换");
            return;
        }
        let nextSlide = currentSlide + 1;
        if (nextSlide >= slides.length) {
            if (loop) {
                nextSlide = 0; // 循环播放时回到第一张
                log("到达最后一张,循环回到第一张");
            } else {
                log("到达最后一张,停止播放");
                pause(); // 非循环播放时暂停
                return;
            }
        }
        goTo(nextSlide);
    };

    // 切换到上一张幻灯片
    const previous = () => {
        if (isTransitioning) {
            log("正在切换中,跳过本次切换");
            return;
        }
        let prevSlide = currentSlide - 1;
        if (prevSlide < 0) {
            if (loop) {
                prevSlide = slides.length - 1; // 循环播放时跳到最后一张
                log("到达第一张,循环到最后一张");
            } else {
                log("到达第一张,停止播放");
                pause(); // 非循环播放时暂停
                return;
            }
        }
        goTo(prevSlide);
    };

    // 自动播放定时器
    useEffect(() => {
        let timer: number;
        if (isPlaying && !isTransitioning) {
            // 获取当前幻灯片的延迟时间或使用默认延迟
            const currentDelay = slides[currentSlide].delay || delay;
            log(`设置自动播放定时器,延迟: ${currentDelay}ms`);
            timer = window.setInterval(() => {
                next();
            }, currentDelay);
        }
        // 清理定时器
        return () => {
            if (timer) {
                log("清理自动播放定时器");
                clearInterval(timer);
            }
        };
    }, [isPlaying, currentSlide, isTransitioning]); // 移除delay依赖,避免重复创建定时器

    // 渲染幻灯片
    const renderSlide = (index: number) => {
        try {
            const slide = slides[index];
            if (!slide) {
                logError(`幻灯片索引 ${index} 不存在`);
                return null;
            }
            // 获取当前幻灯片的动画类型
            const currentTransition: string = slide.transition || transition;

            // 设置幻灯片样式
            const style: React.CSSProperties = {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: slide.color || color || undefined,
                objectFit: slide.cover ?? cover ? "cover" : "contain",
                objectPosition: `${slide.align || align} ${slide.valign || valign}`
            };

            // 确定切换持续时间
            const currentTransitionDurationValue = isFirstTransition ? firstTransitionDuration : transitionDuration;
            log(`当前切换动画持续时间: ${currentTransitionDurationValue}ms`);

            // 根据类型渲染视频或图片
            const content = slide.video ? (
                <video
                    key={index}
                    style={style}
                    autoPlay
                    muted={slide.video.muted}
                    loop={slide.video.loop}
                    onEnded={() => {
                        if (!slide.video?.loop) {
                            log("视频播放结束,切换到下一张");
                            next();
                        }
                    }}
                >
                    {slide.video.src.map((src, i) => (
                        <source key={i} src={src} />
                    ))}
                </video>
            ) : (
                <img
                    key={index}
                    src={slide.src}
                    style={style}
                    alt=""
                    onLoad={() => {
                        log(`图片加载完成: ${slide.src}`);
                        setLoading(false);
                        // 图片加载完成后,延迟一段时间再隐藏默认背景,实现平滑过渡
                        setTimeout(() => {
                            setShowDefaultBg(false);
                        }, currentTransitionDurationValue);
                    }}
                    onError={() => {
                        logError(`图片加载失败: ${slide.src}`);
                    }}
                />
            );

            // 解构variants对象,获取当前动画类型的变体函数
            const variant = variants[currentTransition as keyof typeof variants] || variants.fade;


            // 使用motion.div包装内容并应用动画
            return (
                <motion.div
                    key={slide.src}
                    initial="exit"
                    animate="enter"
                    exit="exit"
                    variants={
                        currentTransition in variants
                            ? variant({ duration: currentTransitionDurationValue / 1000 })
                            : variant({ duration: transitionDuration / 1000 })
                    }
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    {content}
                </motion.div>
            );
        } catch (error) {
            logError("渲染幻灯片时发生错误:", error);
            return null;
        }
    };

    // 为频繁触发的操作添加防抖
    useCallback(
        debounce(() => {
            next();
        }, 300),
        [next]
    );
    // 暴组件实例方法
    React.useImperativeHandle(ref, () => ({
        previous, // 上一张
        next, // 下一张
        play, // 播放
        pause // 暂停
    }));

    // 添加 props 验证
    if (slides.length === 0) {
        logError("幻灯片数组不能为空");
        return null;
    }

    if (transitionDuration <= 0) {
        logWarn("transitionDuration 应该大于 0");
    }

    // 渲染组件
    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden"
            }}
        >
            {/* 默认背景图层 */}
            {defaultBackground && showDefaultBg && (
                <motion.div
                    initial={{ opacity: 1 }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${defaultBackground})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0
                    }}
                />
            )}
            {/* 渲染幻灯片 */}
            {/*在isPlaying为true时，渲染幻灯片*/}
            {isPlaying && (
                <AnimatePresence mode={"sync"}>
                    {visibleSlides.map(index => renderSlide(index))}
                </AnimatePresence>
            )}
            {/* 渲染遮罩层 */}
            {overlay && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.3)"
                    }}
                />
            )}
            {/* 渲染进度条 */}
            {timer && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        height: "3px",
                        background: "#fff",
                        width:
                            slides.length > 1
                                ? `${(currentSlide / (slides.length - 1)) * 100}%`
                                : "100%",
                        transition: "width 0.5s linear"
                    }}
                />
            )}
            {loading && <div className="loading-indicator">加载中...</div>}
        </div>
    );
});
Vegas.displayName = "Vegas";
export default Vegas;
