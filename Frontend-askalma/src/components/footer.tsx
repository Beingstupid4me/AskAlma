import Link from "next/link"
import React from "react"

const FooterLink: React.FC<{ href?: string, children: React.ReactNode}> = ({ href, children }) => {
    return (
        <Link 
            href={href ? href : "#"}
            className="text-sm text-gray-400 hover:text-gray-600 hover:text-mint-accent transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-mint-accent hover:after:w-full after:transition-all after:duration-300"
        >
            {children}
        </Link>
    )
}

const Footer: React.FC = () => {
    return (
        <footer className="bg-deep-navy py-6 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">© 2025 Modern Chatbot. All rights reserved.</p>
                </div>
                <div className="flex gap-6">
                    <FooterLink href="/chat" >Chat</FooterLink>
                    <FooterLink href="/settings" >Settings</FooterLink>
                    <FooterLink>Privacy</FooterLink>
                    <FooterLink>Terms</FooterLink>
                </div>
            </div>
        </footer>
    )
}

export default Footer