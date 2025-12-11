import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import './AnimatedSection.css';

interface AnimatedSectionProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export default function AnimatedSection({ children, delay = 0, className = '' }: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animated-visible');
                        }, delay);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [delay]);

    return (
        <div ref={ref} className={`animated-section ${className}`}>
            {children}
        </div>
    );
}
