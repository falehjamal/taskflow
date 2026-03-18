import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <rect
                width="36"
                height="36"
                x="2"
                y="2"
                rx="8"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M11 20l5 5 11-11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
