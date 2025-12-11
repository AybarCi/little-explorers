import { useState } from 'react';
import './ScreenshotCarousel.css';

interface Screenshot {
    url: string;
    alt: string;
}

interface ScreenshotCarouselProps {
    screenshots: Screenshot[];
}

export default function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % screenshots.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    return (
        <div className="screenshot-carousel">
            <div className="device-mockup">
                <div className="device-frame">
                    <div className="device-notch"></div>
                    <div className="device-screen">
                        <img
                            src={screenshots[activeIndex].url}
                            alt={screenshots[activeIndex].alt}
                            className="screenshot-image"
                        />
                    </div>
                </div>
            </div>

            <div className="carousel-controls">
                <button onClick={prevSlide} className="carousel-button" aria-label="Previous">
                    ‹
                </button>
                <div className="carousel-dots">
                    {screenshots.map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                <button onClick={nextSlide} className="carousel-button" aria-label="Next">
                    ›
                </button>
            </div>
        </div>
    );
}
