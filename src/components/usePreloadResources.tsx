import { useState, useEffect } from "react";
type LoadStatus = "loading" | "loaded" | "error";

const usePreloadResources = (
    slides: Array<{
        src: string;
        color?: string | null;
        delay?: number | null;
        align?: "left" | "center" | "right";
        valign?: "top" | "center" | "bottom";
        transition?: string | null;
        transitionDuration?: number | null;
        animation?: string | null;
        cover?: boolean;
        video?: { src: string[]; muted?: boolean; loop?: boolean };
    }>,
    preload: boolean,
    preloadImage: boolean,
    preloadVideo: boolean,
    logError: (message: string, ...args: unknown[]) => void
) => {
    const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");

    useEffect(() => {
        if (!preload) {
            setLoadStatus("loaded");
            return;
        }

        const preloadPromises: Promise<void>[] = [];

        slides.forEach(slide => {
            if (preloadImage && !slide.video) {
                const img = new Image();
                const imgPromise = new Promise<void>(resolve => {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        logError(`图片加载失败: ${slide.src}`);
                        resolve(); // 仍然resolve以继续加载其他资源
                    };
                });
                img.src = slide.src;
                preloadPromises.push(imgPromise);
            }

            if (preloadVideo && slide.video) {
                slide.video.src.forEach(src => {
                    const link = document.createElement("link");
                    link.rel = "preload";
                    link.as = "video";
                    link.href = src;
                    document.head.appendChild(link);
                    const videoPromise = new Promise<void>(resolve => {
                        link.onload = () => resolve();
                        link.onerror = () => {
                            logError(`视频预加载失败: ${src}`);
                            resolve(); // 仍然resolve以继续加载其他资源
                        };
                    });
                    preloadPromises.push(videoPromise);
                });
            }
        });

        Promise.all(preloadPromises)
            .then(() => {
                setLoadStatus("loaded");
            })
            .catch(error => {
                logError("预加载资源时发生错误:", error);
                setLoadStatus("error");
            });

        // 清理创建的link标签
        return () => {
            slides.forEach(slide => {
                if (preloadVideo && slide.video) {
                    slide.video.src.forEach(src => {
                        const links = document.head.querySelectorAll(
                            `link[rel="preload"][href="${src}"][as="video"]`
                        );
                        links.forEach(link => link.remove());
                    });
                }
            });
        };
    }, [slides, preload, preloadImage, preloadVideo, logError]);

    return loadStatus;
};

const usePreloadAdjacentResources = (
    slides: Array<{
        src: string;
        color?: string | null;
        delay?: number | null;
        align?: "left" | "center" | "right";
        valign?: "top" | "center" | "bottom";
        transition?: string | null;
        transitionDuration?: number | null;
        animation?: string | null;
        cover?: boolean;
        video?: { src: string[]; muted?: boolean; loop?: boolean };
    }>,
    currentIndex: number,
    preloadImage: boolean,
    preloadVideo: boolean,
    logError: (message: string, ...args: unknown[]) => void
) => {
    useEffect(() => {
        const preloadPromises: Promise<void>[] = [];

        const adjacentIndices = [currentIndex, currentIndex + 1, currentIndex - 1].filter(
            i => i >= 0 && i < slides.length
        );

        adjacentIndices.forEach(index => {
            const slide = slides[index];
            if (preloadImage && !slide.video) {
                const img = new Image();
                const imgPromise = new Promise<void>(resolve => {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        logError(`图片加载失败: ${slide.src}`);
                        resolve();
                    };
                });
                img.src = slide.src;
                preloadPromises.push(imgPromise);
            }

            if (preloadVideo && slide.video) {
                slide.video.src.forEach(src => {
                    const link = document.createElement("link");
                    link.rel = "preload";
                    link.as = "video";
                    link.href = src;
                    document.head.appendChild(link);
                    const videoPromise = new Promise<void>(resolve => {
                        link.onload = () => resolve();
                        link.onerror = () => {
                            logError(`视频预加载失败: ${src}`);
                            resolve();
                        };
                    });
                    preloadPromises.push(videoPromise);
                });
            }
        });

        Promise.all(preloadPromises).catch(error => {
            logError("按需预加载资源时发生错误:", error);
        });

        // 清理创建的link标签
        return () => {
            adjacentIndices.forEach(index => {
                const slide = slides[index];
                if (preloadVideo && slide.video) {
                    slide.video.src.forEach(src => {
                        const links = document.head.querySelectorAll(
                            `link[rel="preload"][href="${src}"][as="video"]`
                        );
                        links.forEach(link => link.remove());
                    });
                }
            });
        };
    }, [slides, currentIndex, preloadImage, preloadVideo, logError]);
};

export { usePreloadResources, usePreloadAdjacentResources };
