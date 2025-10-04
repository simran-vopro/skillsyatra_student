import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, BookOpen, CreditCard, Code, User, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';

// --- TYPE DEFINITIONS & MOCK DATA ---

type Category = 'All' | 'Course Access' | 'Practical & Scheduling' | 'Payment & Billing' | 'Technical Issues' | 'Account Management';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: Category;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "How do I access my purchased course materials?",
    answer: "All your courses are accessible via the main Dashboard. Navigate to the 'My Courses' section. Click on the course title, and you will be taken directly to the curriculum overview where you can start learning immediately. Ensure you are signed in with the correct account used for the purchase.",
    category: 'Course Access',
  },
  {
    id: 2,
    question: "Can I reschedule a practical or lab session?",
    answer: "Yes, you can reschedule practicals. Navigate to the 'Practicals' tab within your course page. Find the scheduled session and use the 'Reschedule' button. Please note, rescheduling must be done at least 24 hours before the original start time to avoid a cancellation fee.",
    category: 'Practical & Scheduling',
  },
  {
    id: 3,
    question: "Why can't I access Tier 2 or Premium content?",
    answer: "Access to Tier 2 or Premium content requires a specific subscription level. Please check your 'Subscription & Billing' page to confirm your current tier. If you believe you have the correct subscription, try logging out and logging back in, or contact Payment support.",
    category: 'Course Access',
  },
  {
    id: 4,
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards (Visa, MasterCard, Amex) and PayPal. For annual institutional payments, we also offer wire transfer options. All transactions are securely processed via Stripe.",
    category: 'Payment & Billing',
  },
  {
    id: 5,
    question: "I forgot my password. How do I reset it?",
    answer: "You can reset your password by clicking the 'Forgot Password' link on the login screen. An email with a secure reset link will be sent to your registered email address.",
    category: 'Account Management',
  },
  {
    id: 6,
    question: "The course video player is not loading correctly.",
    answer: "If you are experiencing issues with video playback, please try the following steps: 1) Clear your browser cache and cookies. 2) Try a different browser (Chrome, Firefox, Edge). 3) Ensure your internet connection is stable. If the issue persists, please submit a Technical support ticket.",
    category: 'Technical Issues',
  },
  {
    id: 7,
    question: "How do I get a refund for a course?",
    answer: "Our refund policy allows for full refunds within 14 days of purchase, provided less than 10% of the course content has been accessed. To request a refund, please contact Payment support directly with your Order ID.",
    category: 'Payment & Billing',
  },
  {
    id: 8,
    question: "Can I download course materials for offline viewing?",
    answer: "Due to licensing restrictions, direct download of video content is not permitted. However, PDF notes and certain supplementary materials are available for download within their respective modules.",
    category: 'Course Access',
  },
];

// --- UTILITY COMPONENTS ---

// Maps categories to icons for visual distinction
const getCategoryIcon = (category: Category) => {
    switch (category) {
        case 'Course Access':
            return <BookOpen size={20} className="text-blue-500" />;
        case 'Practical & Scheduling':
            return <Zap size={20} className="text-yellow-500" />;
        case 'Payment & Billing':
            return <CreditCard size={20} className="text-green-500" />;
        case 'Technical Issues':
            return <Code size={20} className="text-red-500" />;
        case 'Account Management':
            return <User size={20} className="text-purple-500" />;
        default:
            return <BookOpen size={20} className="text-gray-500" />;
    }
};

// Accordion Item Component
const AccordionItem: React.FC<{ faq: FAQItem }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-800 hover:bg-indigo-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`answer-${faq.id}`}
      >
        <span className="flex items-center space-x-3">
            {getCategoryIcon(faq.category)}
            <span>{faq.question}</span>
        </span>
        <ChevronDown 
          size={20} 
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-gray-400'}`} 
        />
      </button>
      
      <div
        id={`answer-${faq.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 p-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 py-2 border-l-4 border-indigo-400 bg-gray-50 rounded-lg text-gray-700 text-sm leading-relaxed">
            {faq.answer}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---


export default function StudentKnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const navigate = useNavigate();
  
  // Filter the FAQ data based on search term and active category
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);
  
  // Get unique categories for the sidebar
  const categories = useMemo(() => {
      const uniqueCats = Array.from(new Set(FAQ_DATA.map(faq => faq.category)));
      return ['All', ...uniqueCats].map(c => c as Category);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div>
        
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            Knowledge Base & Self-Serve Help
          </h1>
          <p className="text-gray-600 text-lg">
            Find instant answers to common questions about your courses, account, and more.
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-8 max-w-4xl mx-auto">
            <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for questions (e.g., 'refund', 'access', 'reschedule')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-indigo-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-150"
                />
            </div>
        </div>

        {/* Main Content: Categories & FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 sticky top-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Filter by Category</h3>
              <nav>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => {
                            setActiveCategory(category);
                            setSearchTerm(''); // Clear search when category changes
                        }}
                        className={`w-full text-left flex items-center p-2 rounded-lg transition-colors duration-150 text-sm font-medium 
                          ${activeCategory === category 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        {getCategoryIcon(category)}
                        <span className="ml-3">{category}</span>
                        {/* Show count if not 'All' */}
                        {category !== 'All' && (
                            <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${activeCategory === category ? 'bg-indigo-500/50 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {FAQ_DATA.filter(f => f.category === category).length}
                            </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
          
          {/* Right Column: FAQ List */}
          <main className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {activeCategory === 'All' ? 'All Articles' : activeCategory} {searchTerm && `(Search results for "${searchTerm}")`}
            </h2>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map(faq => (
                        <AccordionItem key={faq.id} faq={faq} />
                    ))
                ) : (
                    <div className="text-center p-12">
                        <Search size={48} className="mx-auto text-gray-300" />
                        <p className="mt-4 text-lg font-semibold text-gray-600">No matching articles found.</p>
                        <p className="text-sm text-gray-500">Try refining your search or selecting a different category.</p>
                    </div>
                )}
            </div>
            
            {/* CTA to Support if still stuck */}
            <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-md flex justify-between items-center flex-wrap">
                <p className="text-lg font-semibold text-indigo-800">Can't find what you're looking for?</p>
                <button onClick={() => {
                  navigate("/tickets")
                }} className="mt-3 sm:mt-0 px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg">
                    Submit a Ticket
                </button>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
