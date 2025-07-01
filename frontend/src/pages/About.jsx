import React from 'react';
import Navbar from '../components/navbar';
import {
    Users,
    Target,
    Lightbulb,
    Heart,
    Award,
    Zap,
    BookOpen,
    Brain,
    Globe,
    Mail,
    Github,
    Linkedin
} from 'lucide-react';

const About = () => {
    const team = [
        {
            name: "Dr. Sarah Chen",
            role: "AI Research Lead",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
            description: "PhD in Machine Learning with 10+ years in educational technology"
        },
        {
            name: "Michael Rodriguez",
            role: "Product Manager",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
            description: "Former educator with expertise in user experience design"
        },
        {
            name: "Emily Wang",
            role: "Software Engineer",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
            description: "Full-stack developer passionate about educational innovation"
        }
    ];

    const values = [
        {
            icon: Target,
            title: "Mission-Driven",
            description: "We're committed to making education more accessible and efficient through technology."
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description: "We continuously push the boundaries of what's possible with AI and education."
        },
        {
            icon: Heart,
            title: "Student-Centered",
            description: "Every feature we build is designed with students and educators in mind."
        },
        {
            icon: Award,
            title: "Excellence",
            description: "We strive for the highest quality in everything we do."
        }
    ];

    const stats = [
        { number: "10,000+", label: "Active Users" },
        { number: "500,000+", label: "Documents Processed" },
        { number: "1M+", label: "Questions Answered" },
        { number: "99.9%", label: "Uptime" }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent mb-6">
                            About Collexa.AI
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We're revolutionizing how students and educators interact with academic content through the power of artificial intelligence.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-12 mb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                                <p className="text-gray-600 text-lg mb-6">
                                    At Collexa.AI, we believe that education should be accessible, efficient, and intelligent.
                                    Our mission is to empower students and educators with AI-driven tools that transform how
                                    academic content is organized, accessed, and understood.
                                </p>
                                <p className="text-gray-600">
                                    We're building the future of educational technology, where artificial intelligence serves
                                    as a personal academic assistant, helping users navigate complex course materials with ease.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-2xl p-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl p-4 text-center">
                                            <BookOpen className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                            <div className="text-sm font-semibold text-gray-900">Smart Organization</div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 text-center">
                                            <Brain className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                            <div className="text-sm font-semibold text-gray-900">AI Assistance</div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 text-center">
                                            <Zap className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                            <div className="text-sm font-semibold text-gray-900">Instant Answers</div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 text-center">
                                            <Globe className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                            <div className="text-sm font-semibold text-gray-900">Global Access</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg border border-red-100 p-6 text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Values Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-red-100 p-6 text-center hover:shadow-xl transition-all duration-300">
                                    <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl inline-block mb-4">
                                        <value.icon className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="h-64 bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center">
                                        <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                                            <Users className="h-16 w-16 text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {member.name}
                                        </h3>
                                        <div className="text-red-600 font-medium mb-3">
                                            {member.role}
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            {member.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technology Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-12 mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Cutting-Edge Technology</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI & Machine Learning</h3>
                                <p className="text-gray-600 mb-6">
                                    We leverage state-of-the-art natural language processing models to understand and
                                    analyze academic content, providing intelligent insights and accurate responses.
                                </p>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Scalable</h3>
                                <p className="text-gray-600">
                                    Our infrastructure is built with security and scalability in mind, ensuring your
                                    data is protected while delivering fast, reliable performance.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                                    <Brain className="h-6 w-6 text-red-600" />
                                    <span className="font-medium text-gray-900">Advanced NLP Models</span>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                                    <Zap className="h-6 w-6 text-red-600" />
                                    <span className="font-medium text-gray-900">Real-time Processing</span>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                                    <Globe className="h-6 w-6 text-red-600" />
                                    <span className="font-medium text-gray-900">Cloud Infrastructure</span>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                                    <Award className="h-6 w-6 text-red-600" />
                                    <span className="font-medium text-gray-900">Enterprise Security</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Have questions or want to learn more about Collexa.AI? We'd love to hear from you.
                        </p>
                        <div className="flex justify-center space-x-6">
                            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg">
                                <Mail className="h-5 w-5" />
                                <span>Contact Us</span>
                            </button>
                            <button className="bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 font-semibold">
                                <Github className="h-5 w-5" />
                                <span>GitHub</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
