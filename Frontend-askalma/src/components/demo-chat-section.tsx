import { MessageCircle, User } from "lucide-react"

export default function DemoChatSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-warm-sand">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-deep-navy mb-10 text-center">See It In Action</h2>

        <div className="bg-cloud-gray rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
          <div className="space-y-4 mb-4">
            {/* Bot message */}
            <div className="flex items-start">
              <div className="mr-2 mt-1 flex-shrink-0 rounded-full bg-mint-accent/20 p-1">
                <MessageCircle size={18} className="text-mint-accent" />
              </div>

              <div className="px-4 py-3 rounded-lg shadow-sm bg-mint-accent text-deep-navy rounded-tl-none max-w-[80%]">
                <p>Hello! How can I assist you today?</p>
                <div className="text-xs mt-1 opacity-70">10:30 AM</div>
              </div>
            </div>

            {/* User message */}
            <div className="flex items-start justify-end">
              <div className="px-4 py-3 rounded-lg shadow-sm bg-soft-slate text-white rounded-tr-none max-w-[80%]">
                <p>Can you help me find information about minimalist design principles?</p>
                <div className="text-xs mt-1 opacity-70 text-right">10:31 AM</div>
              </div>

              <div className="ml-2 mt-1 flex-shrink-0 rounded-full bg-soft-slate/20 p-1">
                <User size={18} className="text-soft-slate" />
              </div>
            </div>

            {/* Bot message */}
            <div className="flex items-start">
              <div className="mr-2 mt-1 flex-shrink-0 rounded-full bg-mint-accent/20 p-1">
                <MessageCircle size={18} className="text-mint-accent" />
              </div>

              <div className="px-4 py-3 rounded-lg shadow-sm bg-mint-accent text-deep-navy rounded-tl-none max-w-[80%]">
                <p>
                  Minimalist design focuses on simplicity, using only essential elements, negative space, and a limited
                  color palette. The key principles include:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Simplicity and clarity</li>
                  <li>Intentional use of white space</li>
                  <li>Limited color palette</li>
                  <li>Emphasis on typography</li>
                </ul>
                <div className="text-xs mt-1 opacity-70">10:32 AM</div>
              </div>
            </div>
          </div>

          {/* Input field */}
          <div className="border-t border-gray-200 pt-3">
            <div className="bg-white border border-gray-300 rounded-lg flex items-center px-3 py-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none focus:outline-none text-soft-slate"
                disabled
              />
              <button className="ml-2 text-mint-accent" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

