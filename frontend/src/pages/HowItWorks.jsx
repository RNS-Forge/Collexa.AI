import React from 'react';
import Navbar from '../components/navbar';
import {
    Upload,
    Brain,
    MessageCircle,
    FolderOpen,
    FileText,
    Search,
    Sparkles,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: FolderOpen,
            title: "Create Collections",
            description: "Organize your academic materials by creating collections for different courses or subjects.",
            details: "Start by creating collections that represent your courses, subjects, or any organizational structure that works for you."
        },
        {
            icon: Upload,
            title: "Upload Documents",
            description: "Add your syllabus documents, PDFs, and other course materials to each collection.",
            details: "Support for PDF, DOCX, DOC, and TXT files. Our system automatically extracts and processes the content."
        },
        {
            icon: Brain,
            title: "AI Processing",
            description: "Our advanced AI analyzes and understands your documents to provide intelligent insights.",
            details: "Using cutting-edge language models, we process your content to enable smart search and question answering."
        },
        {
            icon: MessageCircle,
            title: "Ask Questions",
            description: "Chat with our AI assistant to get instant answers about your syllabus and course materials.",
            details: "Ask specific questions about deadlines, assignments, course requirements, or any content in your documents."
        }
    ];

    const features = [
        {
            icon: Search,
            title: "Smart Search",
            description: "Find information across all your documents instantly with intelligent search capabilities."
        },
        {
            icon: Brain,
            title: "AI-Powered Insights",
            description: "Get intelligent answers based on the content of your uploaded documents."
        },
        {
            icon: FileText,
            title: "Document Management",
            description: "Organize and manage all your academic documents in one centralized location."
        },
        {
            icon: Sparkles,
            title: "Real-time Chat",
            description: "Interactive AI assistant that provides instant responses to your queries."
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent mb-6">
                            How Collexa.AI Works
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Transform your academic workflow with our intelligent document management and AI-powered assistance system
                        </p>
                    </div>

                    {/* Steps Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                            Get Started in 4 Simple Steps
                        </h2>
                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className="flex items-center">
                                        <div className="flex-1">
                                            <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                                                    <div className="flex items-center space-x-4 mb-4">
                                                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-xl">
                                                            <step.icon className="h-8 w-8 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-red-600 mb-1">
                                                                Step {index + 1}
                                                            </div>
                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                {step.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 mb-3">
                                                        {step.description}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {step.details}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Central Timeline */}
                                        <div className="flex flex-col items-center absolute left-1/2 transform -translate-x-1/2 z-10">
                                            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full p-4 shadow-lg">
                                                <div className="text-white font-bold text-lg">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className="w-1 h-16 bg-gradient-to-b from-red-600 to-red-700 mt-4"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                            Powerful Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-red-100 p-6 text-center hover:shadow-xl transition-all duration-300">
                                    <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl inline-block mb-4">
                                        <feature.icon className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-12 mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                            Why Choose Collexa.AI?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {[
                                    "Save time with instant document search",
                                    "Get accurate answers from your materials",
                                    "Organize all course content in one place",
                                    "Access your documents from anywhere"
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-6">
                                {[
                                    "AI-powered intelligent assistance",
                                    "Secure and private document storage",
                                    "Easy-to-use interface",
                                    "Support for multiple file formats"
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of students and educators who are already using Collexa.AI to streamline their academic workflow.
                        </p>
                        <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 mx-auto font-semibold shadow-lg">
                            <span>Start Now</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HowItWorks;
