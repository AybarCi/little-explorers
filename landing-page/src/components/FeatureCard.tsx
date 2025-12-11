import { ReactNode } from 'react';
import './FeatureCard.css';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    gradient?: string;
}

export default function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
    return (
        <div className="feature-card" data-gradient={gradient}>
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
}
