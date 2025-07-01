import React, { useState } from 'react';
import Navbar from '../components/navbar';
import {
    Sparkles,
    Brain,
    Search,
    FileText,
    MessageSquare,
    TrendingUp,
    Zap,
    Target,
    ArrowRight,
    Play,
    CheckCircle2,
    Star,
    Users,
    Clock,
    BarChart3
} from 'lucide-react';

const Feature2 = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    const advancedFeatures = [
        {
            icon: Brain,
            title: "Advanced AI Analytics",
            description: "Deep learning algorithms analyze your study patterns and provide personalized insights.",
            details: "Our AI tracks your interaction patterns, identifies knowledge gaps, and suggests optimal study strategies tailored to your learning style.",
            benefits: ["Personalized learning paths", "Performance analytics", "Study optimization"]
        },
        {
            icon: Search,
            title: "Semantic Search",
            description: "Find information using natural language queries across all your documents.",
            details: "Go beyond keyword matching with our semantic search that understands context, meaning, and relationships between concepts.",
            benefits: ["Context-aware search", "Natural language queries", "Cross-document insights"]
        },
        {
            icon: TrendingUp,
            title: "Progress Tracking",
            description: "Monitor your learning progress with detailed analytics and visualizations.",
            details: "Comprehensive dashboards show your learning trajectory, time spent on topics, and mastery levels across subjects.",
            benefits: ["Visual progress tracking", "Time management insights", "Goal setting tools"]
        },
        {
            icon: Target,
            title: "Smart Recommendations",
            description: "Get AI-powered suggestions for study materials and focus areas.",
            details: "Machine learning algorithms analyze your performance and suggest the most effective study materials and topics to focus on.",
            benefits: ["Personalized recommendations", "Adaptive learning", "Efficiency optimization"]
        }
    ];

    const integrations = [
        { name: "Google Drive", logo: "📁", connected: true },
        { name: "Dropbox", logo: "📦", connected: true },
        { name: "OneDrive", logo: "☁️", connected: false },
        { name: "Canvas LMS", logo: "🎓", connected: true },
        { name: "Blackboard", logo: "📚", connected: false },
        { name: "Moodle", logo: "🏫", connected: true }
    ];

    const testimonials = [
        {
            name: "Alex Chen",
            role: "Computer Science Student",
            avatar: "👨‍💻",
            quote: "Feature2 has revolutionized how I study. The AI insights are incredibly accurate and have improved my grades significantly."
        },
        {
            name: "Sarah Johnson",
            role: "Medical Student",
            avatar: "👩‍⚕️",
            quote: "The semantic search feature is a game-changer. I can find specific medical concepts across all my textbooks instantly."
        },
        {
            name: "Dr. Martinez",
            role: "Professor",
            avatar: "👨‍🏫",
            quote: "I use Feature2 to organize my course materials. The analytics help me understand how students interact with the content."
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-red-200 px-4 py-2 rounded-full mb-6">
                            <Sparkles className="h-5 w-5 text-red-600" />
                            <span className="text-red-700 font-semibold">Advanced Features</span>
                        </div>
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent mb-6">
                            Feature2: Next-Gen AI
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Experience the future of academic assistance with our most advanced AI features designed for serious learners and educators.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg">
                                <Play className="h-5 w-5" />
                                <span>Try Feature2</span>
                            </button>
                            <button className="bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 font-semibold">
                                <span>Learn More</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Interactive Features Section */}
                    <div className="mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                            Powerful AI-Driven Features
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Feature Navigation */}
                            <div className="space-y-4">
                                {advancedFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setActiveFeature(index)}
                                        className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${activeFeature === index
                                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                                                : 'bg-white hover:bg-red-50 border border-red-100'
                                            }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-2 rounded-lg ${activeFeature === index ? 'bg-white/20' : 'bg-red-100'
                                                }`}>
                                                <feature.icon className={`h-6 w-6 ${activeFeature === index ? 'text-white' : 'text-red-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-semibold mb-2 ${activeFeature === index ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    {feature.title}
                                                </h3>
                                                <p className={`text-sm ${activeFeature === index ? 'text-white/90' : 'text-gray-600'
                                                    }`}>
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Feature Details */}
                            <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8">
                                <div className="mb-6">
                                    <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl inline-block mb-4">
                                        {React.createElement(advancedFeatures[activeFeature].icon, {
                                            className: "h-8 w-8 text-red-600"
                                        })}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {advancedFeatures[activeFeature].title}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {advancedFeatures[activeFeature].details}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Key Benefits:</h4>
                                    {advancedFeatures[activeFeature].benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <span className="text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-12 mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                            Feature2 Performance Metrics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl inline-block mb-4">
                                    <BarChart3 className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
                                <div className="text-gray-600">Accuracy Improvement</div>
                            </div>
                            <div className="text-center">
                                <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl inline-block mb-4">
                                    <Clock className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">60%</div>
                                <div className="text-gray-600">Time Saved</div>
                            </div>
                            <div className="text-center">
                                <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl inline-block mb-4">
                                    <Users className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">5,000+</div>
                                <div className="text-gray-600">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-xl inline-block mb-4">
                                    <Star className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">4.9</div>
                                <div className="text-gray-600">User Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Integrations Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                            Seamless Integrations
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {integrations.map((integration, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-red-100 p-6 text-center hover:shadow-xl transition-all duration-300">
                                    <div className="text-4xl mb-3">{integration.logo}</div>
                                    <div className="font-semibold text-gray-900 mb-2">{integration.name}</div>
                                    <div className={`text-xs px-2 py-1 rounded-full ${integration.connected
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {integration.connected ? 'Connected' : 'Available'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonials Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                            What Users Are Saying
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-red-100 p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="text-3xl">{testimonial.avatar}</div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-red-600">{testimonial.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                                    <div className="flex text-yellow-400 mt-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-12 text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">Ready to Experience Feature2?</h2>
                        <p className="text-xl mb-8 text-red-100">
                            Join thousands of students and educators who are already benefiting from our advanced AI features.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 font-semibold shadow-lg">
                                Start Free Trial
                            </button>
                            <button className="bg-red-800 text-white px-8 py-4 rounded-xl hover:bg-red-900 transition-all duration-300 font-semibold border-2 border-red-500">
                                View Pricing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Feature2;
